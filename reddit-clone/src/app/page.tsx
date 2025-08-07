'use client'

import { useEffect, useState, useCallback } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import { Navbar } from '@/components/layout/navbar'
import { PostCard } from '@/components/posts/post-card'
import { Button } from '@/components/ui/button'
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
  _count?: {
    comments: number
  }
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createSupabaseBrowserClient()

  const fetchPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        setError(error.message)
      } else {
        setPosts(data || [])
      }
         } catch (err: unknown) {
       setError((err as Error).message || 'Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Popular Posts
          </h1>
          <p className="text-gray-600">
            Discover what the community is talking about
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2 text-gray-600">Loading posts...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <Button onClick={fetchPosts}>Try Again</Button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No posts yet. Be the first to share something!</p>
            <Button onClick={() => window.location.href = '/create'}>
              Create Post
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
