'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import { Navbar } from '@/components/layout/navbar'
import { PostCard } from '@/components/posts/post-card'
import { CommentCard } from '@/components/comments/comment-card'
import { CommentForm } from '@/components/comments/comment-form'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'

interface Post {
  id: string
  title: string
  content: string | null
  url: string | null
  author_id: string
  subreddit: string
  upvotes: number
  downvotes: number
  created_at: string
  profiles: {
    username: string
    avatar_url: string | null
  }
}

interface Comment {
  id: string
  content: string
  author_id: string
  post_id: string
  parent_id: string | null
  upvotes: number
  downvotes: number
  created_at: string
  profiles: {
    username: string
    avatar_url: string | null
  }
}

export default function PostDetailPage() {
  const params = useParams()
  const postId = params.id as string
  
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  
  const supabase = createSupabaseBrowserClient()

  const fetchPostAndComments = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch post
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (
            username,
            avatar_url
          )
        `)
        .eq('id', postId)
        .single()

      if (postError) {
        setError(postError.message)
        return
      }

      setPost(postData)

      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:author_id (
            username,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (commentsError) {
        console.error('Error fetching comments:', commentsError)
      } else {
        setComments(commentsData || [])
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to fetch post')
    } finally {
      setLoading(false)
    }
  }, [postId, supabase])

  useEffect(() => {
    if (postId) {
      fetchPostAndComments()
    }
  }, [postId, fetchPostAndComments])

  const handleCommentAdded = () => {
    setReplyingTo(null)
    fetchPostAndComments()
  }

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2 text-gray-600">Loading post...</span>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error || 'Post not found'}</div>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    )
  }

  // Separate top-level comments from replies
  const topLevelComments = comments.filter(comment => !comment.parent_id)
  const replies = comments.filter(comment => comment.parent_id)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Post */}
        <PostCard post={post} showContent={true} />
        
        <Separator className="my-6" />
        
        {/* Comments Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Comments ({comments.length})
          </h2>
          
          {/* Comment Form */}
          <CommentForm 
            postId={postId} 
            onCommentAdded={handleCommentAdded}
          />
          
          {/* Comments List */}
          <div className="space-y-4">
            {topLevelComments.map((comment) => (
              <div key={comment.id}>
                <CommentCard 
                  comment={comment} 
                  onReply={handleReply}
                />
                
                {/* Replies to this comment */}
                {replies
                  .filter(reply => reply.parent_id === comment.id)
                  .map((reply) => (
                    <div key={reply.id} className="ml-8">
                      <CommentCard 
                        comment={reply} 
                        onReply={handleReply}
                      />
                    </div>
                  ))
                }
                
                {/* Reply form */}
                {replyingTo === comment.id && (
                  <div className="ml-8 mt-4">
                    <CommentForm 
                      postId={postId}
                      parentId={comment.id}
                      onCommentAdded={handleCommentAdded}
                      onCancel={() => setReplyingTo(null)}
                    />
                  </div>
                )}
              </div>
            ))}
            
            {comments.length === 0 && (
              <div className="text-center py-8 text-gray-600">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}