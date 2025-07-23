import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, MessageSquare, Image as ImageIcon, BookOpen } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

const categoryInfo = {
  notice: {
    title: "공지사항",
    description: "동아리의 중요한 공지사항을 확인하세요",
    icon: FileText,
    adminOnly: true,
  },
  study: {
    title: "학습자료",
    description: "AI 학습 자료와 발표 PPT를 공유합니다",
    icon: BookOpen,
    adminOnly: false,
  },
  free: {
    title: "자유게시판",
    description: "자유롭게 의견을 나누고 소통하세요",
    icon: MessageSquare,
    adminOnly: false,
  },
  photo: {
    title: "사진 게시판",
    description: "동아리 활동 사진을 공유합니다",
    icon: ImageIcon,
    adminOnly: false,
  },
}

export default async function BoardPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const categoryKey = category as keyof typeof categoryInfo
  const info = categoryInfo[categoryKey]

  if (!info) {
    notFound()
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let canCreate = false
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single()

    canCreate = info.adminOnly ? profile?.role === "admin" : true
  }

  // Fetch posts with files for photo category
  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles:author_id (
        name,
        email
      ),
      _count:comments(count),
      files (
        id,
        file_url,
        file_type
      )
    `)
    .eq("category", category)
    .order("created_at", { ascending: false })

  const Icon = info.icon

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Icon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">{info.title}</h1>
            <p className="text-muted-foreground">{info.description}</p>
          </div>
        </div>
        {user && canCreate && (
          <Button asChild>
            <Link href={`/board/${category}/write`}>
              <Plus className="mr-2 h-4 w-4" />
              글쓰기
            </Link>
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <Link href={`/board/${category}/${post.id}`}>
                <CardHeader className="pb-3">
                  <div className="space-y-1">
                    <CardTitle className="text-lg hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-sm">
                      <span>{post.profiles?.name || "익명"}</span>
                      <span className="text-muted-foreground/50">•</span>
                      <span>
                        {format(new Date(post.created_at), "yyyy.MM.dd HH:mm", {
                          locale: ko,
                        })}
                      </span>
                      {post._count && (
                        <>
                          <span className="text-muted-foreground/50">•</span>
                          <span>댓글 {post._count[0]?.count || 0}</span>
                        </>
                      )}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground line-clamp-2">
                    {post.content}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                아직 게시글이 없습니다. 첫 번째 글을 작성해보세요!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}