import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { OrganizationManageList } from "@/components/organization/organization-manage-list"
import { AddPositionDialog } from "@/components/organization/add-position-dialog"

export default async function OrganizationManagePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single()
  
  if (profile?.role !== "admin") {
    redirect("/organization")
  }

  // Fetch organization data with profiles
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

  // Fetch all verified members not in organization
  const { data: availableMembers } = await supabase
    .from("profiles")
    .select("*")
    .eq("email_verified", true)
    .order("name", { ascending: true })

  // Filter out members already in organization
  const organizationUserIds = organization?.map(o => o.user_id) || []
  const unassignedMembers = availableMembers?.filter(
    member => !organizationUserIds.includes(member.id)
  ) || []

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">조직도 관리</h1>
            <p className="text-muted-foreground">조직 구성원을 추가하고 구조를 관리합니다</p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href="/organization">
            조직도 보기
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>현재 조직도</CardTitle>
            <CardDescription>
              드래그하여 순서를 변경하거나 삭제할 수 있습니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrganizationManageList 
              organization={organization || []} 
              unassignedMembers={unassignedMembers}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>직책 추가</CardTitle>
            <CardDescription>
              새로운 직책을 추가하고 구성원을 배정합니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddPositionDialog members={unassignedMembers} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}