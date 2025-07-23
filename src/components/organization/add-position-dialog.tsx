"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Plus, Loader2 } from "lucide-react"

interface AddPositionDialogProps {
  members: Array<{
    id: string
    name: string
    email: string
    department: string | null
    position: string | null
  }>
}

export function AddPositionDialog({ members }: AddPositionDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    position: "",
    userId: "",
    order: 0
  })
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.position || !formData.userId) {
      toast.error("모든 필드를 입력해주세요.")
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("organization")
        .insert({
          position: formData.position,
          user_id: formData.userId,
          order: formData.order
        })

      if (error) throw error

      toast.success("직책이 추가되었습니다.")
      setOpen(false)
      setFormData({ position: "", userId: "", order: 0 })
      router.refresh()
    } catch (error) {
      toast.error("직책 추가에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          새 직책 추가
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>새 직책 추가</DialogTitle>
            <DialogDescription>
              조직도에 새로운 직책을 추가합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="position">직책명</Label>
              <Input
                id="position"
                placeholder="회장, 부회장, 총무 등"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member">담당자</Label>
              <Select
                value={formData.userId}
                onValueChange={(value) => setFormData({ ...formData, userId: value })}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="담당자를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.department || "소속 없음"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">순서</Label>
              <Input
                id="order"
                type="number"
                placeholder="0"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                낮은 숫자가 위에 표시됩니다.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  추가 중...
                </>
              ) : (
                "추가"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}