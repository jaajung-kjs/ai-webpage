import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Edit, Trash2, MessageSquare } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { CommentSection } from "@/components/board/comment-section"
import { DeleteButton } from "@/components/board/delete-button"

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>
}) {
  const { category, id } = await params
  const supabase = await createClient()
  
  // Fetch post with author info and files
  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles:author_id (
        id,
        name,
        email,
        department,
        position
      ),
      files (
        id,
        file_name,
        file_url,
        file_type,
        size
      )
    `)
    .eq("id", id)
    .eq("category", category)
    .single()

  if (error || !post) {
    notFound()
  }

  const { data: { user } } = await supabase.auth.getUser()
  
  let isAuthor = false
  let isAdmin = false
  
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("user_id", user.id)
      .single()
    
    isAuthor = profile?.id === post.author_id
    isAdmin = profile?.role === "admin"
  }

  const canEdit = isAuthor || isAdmin
  const canDelete = isAuthor || isAdmin

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-4">
        <Button variant="ghost" asChild>
          <Link href={`/board/${category}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록으로
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-2xl">{post.title}</CardTitle>
              {canEdit && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/board/${category}/${id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  {canDelete && (
                    <DeleteButton 
                      postId={id} 
                      category={category}
                    />
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="font-medium">{post.profiles?.name}</span>
                {post.profiles?.department && (
                  <>
                    <span>•</span>
                    <span>{post.profiles.department}</span>
                  </>
                )}
                {post.profiles?.position && (
                  <span>{post.profiles.position}</span>
                )}
              </div>
              <span>•</span>
              <span>
                {format(new Date(post.created_at), "yyyy.MM.dd HH:mm", {
                  locale: ko,
                })}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>

          {post.files && post.files.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-medium mb-3">첨부파일</h3>
              <div className="space-y-2">
                {post.files.map((file: any) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{file.file_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={file.file_url}
                        download={file.file_name}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        다운로드
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <CommentSection postId={id} />
    </div>
  )
}