"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Trash2, Loader2 } from "lucide-react"

interface DeleteButtonProps {
  postId: string
  category: string
}

export function DeleteButton({ postId, category }: DeleteButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) return

    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId)

      if (error) throw error

      toast.success("게시글이 삭제되었습니다.")
      router.push(`/board/${category}`)
    } catch (error) {
      toast.error("게시글 삭제에 실패했습니다.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  )
}