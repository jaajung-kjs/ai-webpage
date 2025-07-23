"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function SecuritySettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (passwords.new !== passwords.confirm) {
      toast.error("새 비밀번호가 일치하지 않습니다.")
      return
    }

    if (passwords.new.length < 6) {
      toast.error("비밀번호는 최소 6자 이상이어야 합니다.")
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      })

      if (error) throw error

      toast.success("비밀번호가 변경되었습니다.")
      setPasswords({ current: "", new: "", confirm: "" })
    } catch (error) {
      toast.error("비밀번호 변경에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current">현재 비밀번호</Label>
          <Input
            id="current"
            name="current"
            type="password"
            value={passwords.current}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new">새 비밀번호</Label>
          <Input
            id="new"
            name="new"
            type="password"
            value={passwords.new}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <p className="text-sm text-muted-foreground">
            최소 6자 이상 입력해주세요.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">새 비밀번호 확인</Label>
          <Input
            id="confirm"
            name="confirm"
            type="password"
            value={passwords.confirm}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            변경 중...
          </>
        ) : (
          "비밀번호 변경"
        )}
      </Button>
    </form>
  )
}