"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    emailPosts: true,
    emailComments: true,
    emailEvents: false,
    emailNewsletter: false,
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings({
      ...settings,
      [key]: !settings[key],
    })
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // In a real application, you would save these settings to the database
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("알림 설정이 저장되었습니다.")
    } catch (error) {
      toast.error("설정 저장에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailPosts">새 게시글 알림</Label>
            <p className="text-sm text-muted-foreground">
              새로운 게시글이 작성되면 이메일로 알려드립니다.
            </p>
          </div>
          <Switch
            id="emailPosts"
            checked={settings.emailPosts}
            onCheckedChange={() => handleToggle("emailPosts")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailComments">댓글 알림</Label>
            <p className="text-sm text-muted-foreground">
              내 게시글에 댓글이 달리면 이메일로 알려드립니다.
            </p>
          </div>
          <Switch
            id="emailComments"
            checked={settings.emailComments}
            onCheckedChange={() => handleToggle("emailComments")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailEvents">행사 알림</Label>
            <p className="text-sm text-muted-foreground">
              새로운 행사가 등록되면 이메일로 알려드립니다.
            </p>
          </div>
          <Switch
            id="emailEvents"
            checked={settings.emailEvents}
            onCheckedChange={() => handleToggle("emailEvents")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailNewsletter">뉴스레터</Label>
            <p className="text-sm text-muted-foreground">
              동아리 소식과 AI 트렌드를 정기적으로 받아보세요.
            </p>
          </div>
          <Switch
            id="emailNewsletter"
            checked={settings.emailNewsletter}
            onCheckedChange={() => handleToggle("emailNewsletter")}
          />
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              저장 중...
            </>
          ) : (
            "설정 저장"
          )}
        </Button>
      </div>
    </div>
  )
}