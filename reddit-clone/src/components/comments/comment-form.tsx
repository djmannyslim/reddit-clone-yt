'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CommentFormProps {
  postId: string
  parentId?: string | null
  onCommentAdded?: () => void
  onCancel?: () => void
}

export function CommentForm({ postId, parentId = null, onCommentAdded, onCancel }: CommentFormProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createSupabaseBrowserClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !content.trim()) return

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content: content.trim(),
          author_id: user.id,
          post_id: postId,
          parent_id: parentId,
        })

      if (error) {
        setError(error.message)
      } else {
        setContent('')
        onCommentAdded?.()
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'An error occurred while posting the comment')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-600 text-center">
            Please sign in to leave a comment.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {parentId ? 'Reply to comment' : 'Add a comment'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What are your thoughts?"
              rows={4}
              required
            />
          </div>
          
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={loading || !content.trim()}
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </Button>
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}