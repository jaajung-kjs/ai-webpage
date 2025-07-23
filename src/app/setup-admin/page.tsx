"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Shield } from "lucide-react"

export default function SetupAdminPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleSetupAdmin = async () => {
    setIsLoading(true)

    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error("로그인이 필요합니다.")
        router.push("/login")
        return
      }

      // Update user role to admin
      const { error } = await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("user_id", user.id)

      if (error) {
        throw error
      }

      toast.success("관리자 권한이 설정되었습니다!")
      router.push("/")
    } catch (error) {
      console.error("Error setting up admin:", error)
      toast.error("관리자 설정 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>관리자 설정</CardTitle>
          <CardDescription>
            현재 로그인한 계정을 관리자로 설정합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            <p className="mb-2">관리자 권한을 받으면:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>공지사항 작성 가능</li>
              <li>일정 추가/수정 가능</li>
              <li>조직도 관리 가능</li>
            </ul>
          </div>
          <Button 
            onClick={handleSetupAdmin} 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                설정 중...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                관리자로 설정
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}