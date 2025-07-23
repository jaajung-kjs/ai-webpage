"use client"

import { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface AccountSettingsProps {
  user: User
}

export function AccountSettings({ user }: AccountSettingsProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteAccount = async () => {
    if (!confirm("정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      return
    }

    setIsDeleting(true)
    try {
      // In a real application, you would implement proper account deletion
      // This might involve calling a server action or API endpoint
      toast.error("계정 삭제 기능은 현재 비활성화되어 있습니다.")
    } catch (error) {
      toast.error("계정 삭제에 실패했습니다.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>계정 ID</Label>
          <p className="text-sm text-muted-foreground mt-1">{user.id}</p>
        </div>

        <div>
          <Label>가입일</Label>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date(user.created_at).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div>
          <Label>마지막 로그인</Label>
          <p className="text-sm text-muted-foreground mt-1">
            {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : '정보 없음'}
          </p>
        </div>
      </div>

      <div className="pt-6 border-t">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-red-600 mb-2">위험 구역</h3>
            <p className="text-sm text-muted-foreground mb-4">
              계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
            </p>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  삭제 중...
                </>
              ) : (
                "계정 삭제"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}