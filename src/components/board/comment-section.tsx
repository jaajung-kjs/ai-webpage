"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { MessageSquare, Loader2, Trash2 } from "lucide-react"

interface Comment {
  id: string
  content: string
  created_at: string
  author_id: string
  profiles: {
    id: string
    name: string
    department: string | null
    position: string | null
  }
}

export function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchComments()
    getCurrentUser()
  }, [postId])

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single()
      
      setCurrentUserId(profile?.id || null)
    }
  }

  const fetchComments = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          profiles:author_id (
            id,
            name,
            department,
            position
          )
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: true })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      toast.error("댓글을 불러오는데 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error("로그인이 필요합니다.")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (!profile) {
        toast.error("프로필 정보를 찾을 수 없습니다.")
        return
      }

      const { error } = await supabase.from("comments").insert({
        content: newComment,
        post_id: postId,
        author_id: profile.id,
      })

      if (error) throw error

      toast.success("댓글이 작성되었습니다.")
      setNewComment("")
      fetchComments()
    } catch (error) {
      toast.error("댓글 작성에 실패했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return

    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId)

      if (error) throw error

      toast.success("댓글이 삭제되었습니다.")
      fetchComments()
    } catch (error) {
      toast.error("댓글 삭제에 실패했습니다.")
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          댓글 {comments.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comment Form */}
        {currentUserId && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 작성하세요..."
              rows={3}
              disabled={isSubmitting}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    작성 중...
                  </>
                ) : (
                  "댓글 작성"
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Comments List */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 bg-muted rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{comment.profiles.name}</span>
                      {comment.profiles.department && (
                        <span className="text-muted-foreground">
                          {comment.profiles.department}
                        </span>
                      )}
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        {format(new Date(comment.created_at), "yyyy.MM.dd HH:mm", {
                          locale: ko,
                        })}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                  </div>
                  {currentUserId === comment.author_id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(comment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
          </p>
        )}
      </CardContent>
    </Card>
  )
}