"use client"

import { Card, CardContent } from "@/components/ui/card"
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

interface OrganizationChartProps {
  data: OrganizationData[]
}

export function OrganizationChart({ data }: OrganizationChartProps) {
  // Build tree structure
  const buildTree = (items: OrganizationData[], parentId: string | null = null): any[] => {
    return items
      .filter(item => item.parent_id === parentId)
      .sort((a, b) => a.order - b.order)
      .map(item => ({
        ...item,
        children: buildTree(items, item.id)
      }))
  }

  const tree = buildTree(data)

  const renderNode = (node: any, level: number = 0) => {
    const isRoot = level === 0
    const hasChildren = node.children && node.children.length > 0

    return (
      <div key={node.id} className="flex flex-col items-center">
        <Card className={cn(
          "mb-4 hover:shadow-lg transition-all",
          isRoot && "ring-2 ring-primary"
        )}>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <h3 className="font-bold text-lg">{node.position}</h3>
              <div className="space-y-1">
                <p className="font-medium text-base">{node.profiles.name}</p>
                {node.profiles.department && (
                  <p className="text-sm text-muted-foreground">
                    {node.profiles.department}
                  </p>
                )}
                {node.profiles.position && (
                  <p className="text-sm font-medium text-primary">
                    {node.profiles.position}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {hasChildren && (
          <>
            <div className="w-0.5 h-8 bg-border" />
            <div className="flex gap-8 relative">
              {node.children.length > 1 && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-border" />
              )}
              {node.children.map((child: any, index: number) => (
                <div key={child.id} className="flex flex-col items-center">
                  {node.children.length > 1 && (
                    <div className="w-0.5 h-8 bg-border" />
                  )}
                  {renderNode(child, level + 1)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto pb-8">
      <div className="min-w-max flex justify-center">
        <div className="flex flex-col items-center space-y-4">
          {tree.map(node => renderNode(node))}
        </div>
      </div>
    </div>
  )
}