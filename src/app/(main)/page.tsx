import { EventCalendar } from "@/components/calendar/event-calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Users, Calendar, Sparkles } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"

function getCategoryName(category: string): string {
  const categoryNames: Record<string, string> = {
    notice: "공지사항",
    study: "학습자료",
    free: "자유게시판",
    photo: "사진 게시판"
  }
  return categoryNames[category] || category
}

function getRelativeTime(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), { 
    addSuffix: true, 
    locale: ko 
  })
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single()
    
    isAdmin = profile?.role === "admin"
  }

  // Fetch recent activities
  const [postsResult, eventsResult, profilesResult] = await Promise.all([
    supabase
      .from("posts")
      .select("id, title, category, created_at")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("events")
      .select("id, title, start_date")
      .gte("start_date", new Date().toISOString())
      .order("start_date", { ascending: true })
      .limit(1),
    supabase
      .from("profiles")
      .select("id, name, created_at")
      .order("created_at", { ascending: false })
      .limit(3)
  ])

  const recentPosts = postsResult.data || []
  const upcomingEvent = eventsResult.data?.[0]
  const newMembers = profilesResult.data || []

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 px-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            한국전력공사 전력관리처 생성형 AI 학습동아리
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            전력관리의 미래를 AI와 함께
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            한국전력공사 전력관리처 직원들이 함께 모여 최신 AI 기술을 학습하고, 
            전력관리 업무에 AI를 접목시키는 방안을 연구하는 학습동아리입니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {user ? (
              <>
                <Button size="lg" asChild>
                  <Link href="/board/study">
                    <BookOpen className="mr-2 h-5 w-5" />
                    학습자료 보기
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/board/free">
                    커뮤니티 참여하기
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" asChild>
                  <Link href="/signup">
                    지금 가입하기
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">
                    로그인
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <BookOpen className="h-10 w-10 text-primary mb-2" />
            <CardTitle>학습 자료 공유</CardTitle>
            <CardDescription>
              최신 AI 기술 자료와 발표 PPT를 공유합니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/board/study">
                자료 보러가기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Users className="h-10 w-10 text-primary mb-2" />
            <CardTitle>활발한 커뮤니티</CardTitle>
            <CardDescription>
              자유롭게 질문하고 경험을 공유하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/board/free">
                커뮤니티 가기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Calendar className="h-10 w-10 text-primary mb-2" />
            <CardTitle>정기 모임</CardTitle>
            <CardDescription>
              매주 진행되는 스터디와 특별 세미나
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="#calendar">
                일정 확인하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Calendar Section */}
      <section id="calendar" className="scroll-mt-20">
        <EventCalendar canCreate={isAdmin} />
      </section>

      {/* Recent Activities */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
            <CardDescription>
              동아리의 최신 소식과 활동을 확인하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <Link key={post.id} href={`/board/${post.category}/${post.id}`}>
                  <div className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        {getCategoryName(post.category)}에 새 글: {post.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getRelativeTime(post.created_at)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
              
              {upcomingEvent && (
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      예정된 행사: {upcomingEvent.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(upcomingEvent.start_date).toLocaleDateString('ko-KR', { 
                        month: 'long', 
                        day: 'numeric', 
                        weekday: 'short' 
                      })}
                    </p>
                  </div>
                </div>
              )}
              
              {newMembers.length > 0 && (
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      새로운 회원: {newMembers.map(m => m.name).join(', ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getRelativeTime(newMembers[0].created_at)}
                    </p>
                  </div>
                </div>
              )}
              
              {recentPosts.length === 0 && !upcomingEvent && newMembers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  아직 활동 내역이 없습니다.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}