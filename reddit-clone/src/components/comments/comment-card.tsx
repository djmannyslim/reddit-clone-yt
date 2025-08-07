'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ArrowUp, ArrowDown, Reply } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { createSupabaseBrowserClient } from '@/lib/supabase'

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

interface CommentCardProps {
  comment: Comment
  onReply?: (commentId: string) => void
}

export function CommentCard({ comment, onReply }: CommentCardProps) {
  const { user } = useAuth()
  const [votes, setVotes] = useState({
    upvotes: comment.upvotes,
    downvotes: comment.downvotes,
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
        .eq('comment_id', comment.id)
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
            comment_id: comment.id,
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
    <div className="border-l-2 border-gray-200 pl-4 mb-4">
      <div className="flex items-start space-x-3">
        <div className="flex flex-col items-center space-y-1">
          <Button
            variant={userVote === 'up' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleVote('up')}
            disabled={!user || voting}
            className="h-5 w-5 p-0"
          >
            <ArrowUp className="h-3 w-3" />
          </Button>
          <span className="text-xs font-medium text-gray-700">
            {score}
          </span>
          <Button
            variant={userVote === 'down' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleVote('down')}
            disabled={!user || voting}
            className="h-5 w-5 p-0"
          >
            <ArrowDown className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
            <Avatar className="h-4 w-4">
              <AvatarImage src={comment.profiles.avatar_url || undefined} />
              <AvatarFallback className="text-xs">
                {comment.profiles.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>u/{comment.profiles.username}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(comment.created_at))} ago</span>
          </div>
          
          <div className="text-sm text-gray-900 mb-2">
            <p className="whitespace-pre-wrap">{comment.content}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            {user && onReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReply(comment.id)}
                className="h-6 px-2 text-xs"
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}