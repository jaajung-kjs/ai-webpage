"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Upload, X } from "lucide-react"

interface WriteFormProps {
  category: string
  categoryName: string
}

export function WriteForm({ category, categoryName }: WriteFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  })
  const supabase = createClient()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const uploadFiles = async (postId: string) => {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split(".").pop()
      const fileName = `${postId}/${Date.now()}.${fileExt}`
      const bucketName = category === "photo" ? "photos" : "files"

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName)

      return {
        file_name: file.name,
        file_url: publicUrl,
        file_type: file.type,
        size: file.size,
      }
    })

    return Promise.all(uploadPromises)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error("로그인이 필요합니다.")
        router.push("/login")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (!profile) {
        toast.error("프로필 정보를 찾을 수 없습니다.")
        return
      }

      // Create post
      const { data: post, error: postError } = await supabase
        .from("posts")
        .insert({
          title: formData.title,
          content: formData.content,
          category: category,
          author_id: profile.id,
        })
        .select()
        .single()

      if (postError) throw postError

      // Upload files if any
      if (files.length > 0) {
        const uploadedFiles = await uploadFiles(post.id)
        
        const { error: filesError } = await supabase
          .from("files")
          .insert(
            uploadedFiles.map((file) => ({
              ...file,
              post_id: post.id,
              uploaded_by: profile.id,
            }))
          )

        if (filesError) throw filesError
      }

      toast.success("게시글이 작성되었습니다.")
      router.push(`/board/${category}/${post.id}`)
    } catch (error) {
      console.error("Error creating post:", error)
      toast.error("게시글 작성 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>새 글 작성</CardTitle>
          <CardDescription>
            {categoryName}에 새 글을 작성합니다
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="제목을 입력하세요"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="내용을 입력하세요"
                rows={10}
                required
                disabled={isLoading}
              />
            </div>
            {(category === "study" || category === "photo") && (
              <div className="space-y-2">
                <Label htmlFor="files">파일 첨부</Label>
                <Input
                  id="files"
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  accept={category === "photo" ? "image/*" : "*"}
                  disabled={isLoading}
                />
                {files.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded-md"
                      >
                        <span className="text-sm truncate">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardContent className="flex gap-2 pt-0">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  작성 중...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  작성하기
                </>
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
          </CardContent>
        </form>
      </Card>
    </div>
  )
}