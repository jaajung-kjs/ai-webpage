"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Trash2, GripVertical, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrganizationData {
  id: string
  user_id: string
  parent_id: string | null
  position: string
  order: number
  profiles: {
    id: string
    name: string
    email: string
    department: string | null
    position: string | null
  }
}

interface OrganizationManageListProps {
  organization: OrganizationData[]
  unassignedMembers: any[]
}

export function OrganizationManageList({ 
  organization: initialOrganization,
  unassignedMembers 
}: OrganizationManageListProps) {
  const [organization, setOrganization] = useState(initialOrganization)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleDelete = async (id: string) => {
    if (!confirm("정말로 이 직책을 삭제하시겠습니까?")) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("organization")
        .delete()
        .eq("id", id)

      if (error) throw error

      setOrganization(organization.filter(item => item.id !== id))
      toast.success("직책이 삭제되었습니다.")
    } catch (error) {
      toast.error("삭제에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const buildTree = (items: OrganizationData[], parentId: string | null = null): any[] => {
    return items
      .filter(item => item.parent_id === parentId)
      .sort((a, b) => a.order - b.order)
      .map(item => ({
        ...item,
        children: buildTree(items, item.id)
      }))
  }

  const renderNode = (node: any, level: number = 0) => {
    return (
      <div key={node.id} className="space-y-2">
        <Card className={cn("relative", level > 0 && "ml-8")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                <div>
                  <p className="font-medium">{node.position}</p>
                  <p className="text-sm text-muted-foreground">
                    {node.profiles.name} ({node.profiles.department})
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(node.id)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        {node.children && node.children.length > 0 && (
          <div className="space-y-2">
            {node.children.map((child: any) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  const tree = buildTree(organization)

  return (
    <div className="space-y-2">
      {tree.length > 0 ? (
        tree.map(node => renderNode(node))
      ) : (
        <p className="text-center text-muted-foreground py-8">
          아직 조직도가 설정되지 않았습니다.
        </p>
      )}
    </div>
  )
}