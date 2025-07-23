"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface ProfileFormProps {
  profile: {
    id: string
    user_id: string
    name: string
    email: string
    department: string | null
    position: string | null
    role: string
  }
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: profile.name,
    department: profile.department || "",
    position: profile.position || "",
  })
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: formData.name,
          department: formData.department || null,
          position: formData.position || null,
        })
        .eq("id", profile.id)

      if (error) throw error

      toast.success("프로필이 업데이트되었습니다.")
      router.refresh()
    } catch (error) {
      toast.error("프로필 업데이트에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            disabled
            className="bg-muted"
          />
          <p className="text-sm text-muted-foreground">
            이메일은 변경할 수 없습니다.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">이름</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">소속</Label>
          <Input
            id="department"
            name="department"
            type="text"
            placeholder="전력관리처 전자제어부"
            value={formData.department}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">직급</Label>
          <Input
            id="position"
            name="position"
            type="text"
            placeholder="대리"
            value={formData.position}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        {profile.role === "admin" && (
          <div className="p-4 bg-primary/10 rounded-lg">
            <p className="text-sm font-medium text-primary">관리자 계정</p>
            <p className="text-sm text-muted-foreground mt-1">
              이 계정은 관리자 권한을 가지고 있습니다.
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              저장 중...
            </>
          ) : (
            "변경사항 저장"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          취소
        </Button>
      </div>
    </form>
  )
}