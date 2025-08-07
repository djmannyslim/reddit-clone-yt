'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowUp, ArrowDown, MessageCircle, ExternalLink } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { createSupabaseBrowserClient } from '@/lib/supabase'

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

interface PostCardProps {
  post: Post
  showContent?: boolean
}

export function PostCard({ post, showContent = false }: PostCardProps) {
  const { user } = useAuth()
  const [votes, setVotes] = useState({
    upvotes: post.upvotes,
    downvotes: post.downvotes,
  })
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)
  const [voting, setVoting] = useState(false)

  const supabase = createSupabaseBrowserClient()

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!user || voting) return

    setVoting(true)

    try {
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('votes')
        .select('*')
        .eq('user_id', user.id)
        .eq('post_id', post.id)
        .single()

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote if clicking same vote
          await supabase
            .from('votes')
            .delete()
            .eq('id', existingVote.id)
          
          setUserVote(null)
          setVotes(prev => ({
            ...prev,
            [voteType === 'up' ? 'upvotes' : 'downvotes']: prev[voteType === 'up' ? 'upvotes' : 'downvotes'] - 1
          }))
        } else {
          // Update vote type
          await supabase
            .from('votes')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id)
          
          setUserVote(voteType)
          setVotes(prev => ({
            upvotes: voteType === 'up' ? prev.upvotes + 1 : prev.upvotes - 1,
            downvotes: voteType === 'down' ? prev.downvotes + 1 : prev.downvotes - 1,
          }))
        }
      } else {
        // Create new vote
        await supabase
          .from('votes')
          .insert({
            user_id: user.id,
            post_id: post.id,
            vote_type: voteType,
          })
        
        setUserVote(voteType)
        setVotes(prev => ({
          ...prev,
          [voteType === 'up' ? 'upvotes' : 'downvotes']: prev[voteType === 'up' ? 'upvotes' : 'downvotes'] + 1
        }))
      }
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setVoting(false)
    }
  }

  const score = votes.upvotes - votes.downvotes

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          <div className="flex flex-col items-center space-y-1">
            <Button
              variant={userVote === 'up' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleVote('up')}
              disabled={!user || voting}
              className="h-6 w-6 p-0"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-gray-700">
              {score}
            </span>
            <Button
              variant={userVote === 'down' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleVote('down')}
              disabled={!user || voting}
              className="h-6 w-6 p-0"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <Badge variant="secondary">r/{post.subreddit}</Badge>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={post.profiles.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">
                    {post.profiles.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>u/{post.profiles.username}</span>
              </div>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(post.created_at))} ago</span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              <Link href={`/posts/${post.id}`} className="hover:text-blue-600">
                {post.title}
              </Link>
            </h3>
            
            {post.url && (
              <div className="mb-2">
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm flex items-center"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  {new URL(post.url).hostname}
                </a>
              </div>
            )}
            
            {showContent && post.content && (
              <div className="text-gray-700 mb-3">
                <p className="whitespace-pre-wrap">{post.content}</p>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <Link href={`/posts/${post.id}`}>
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <MessageCircle className="h-3 w-3 mr-1" />
              {post._count?.comments || 0} comments
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}