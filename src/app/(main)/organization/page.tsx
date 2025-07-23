import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Users, Plus } from "lucide-react"
import Link from "next/link"
import { OrganizationChart } from "@/components/organization/organization-chart"

export default async function OrganizationPage() {
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

  // Fetch organization data
  const { data: organization } = await supabase
    .from("organization")
    .select(`
      *,
      profiles:user_id (
        id,
        name,
        email,
        department,
        position
      )
    `)
    .order("order", { ascending: true })

  // Fetch all members for display
  const { data: members } = await supabase
    .from("profiles")
    .select("*")
    .order("name", { ascending: true })

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">조직도</h1>
            <p className="text-muted-foreground">AI 학습동아리 조직 구성</p>
          </div>
        </div>
        {isAdmin && (
          <Button asChild>
            <Link href="/organization/manage">
              <Plus className="mr-2 h-4 w-4" />
              조직도 관리
            </Link>
          </Button>
        )}
      </div>

      {organization && organization.length > 0 ? (
        <OrganizationChart data={organization} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              동아리 회원 목록
            </CardTitle>
            <CardDescription>
              {isAdmin ? "조직도가 아직 설정되지 않았습니다. 조직도 관리에서 설정해주세요." : "전체 회원 목록입니다."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members?.map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold">{member.name}</h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{member.department}</p>
                        <p>{member.position}</p>
                        <p className="text-xs">{member.email}</p>
                      </div>
                      {member.role === "admin" && (
                        <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-md">
                          관리자
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}