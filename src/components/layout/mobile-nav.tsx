"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, MessageSquare, Image, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    label: "홈",
    href: "/",
    icon: Home,
  },
  {
    label: "공지사항",
    href: "/board/notice",
    icon: BookOpen,
  },
  {
    label: "학습자료",
    href: "/board/study",
    icon: BookOpen,
  },
  {
    label: "자유게시판",
    href: "/board/free",
    icon: MessageSquare,
  },
  {
    label: "사진",
    href: "/board/photo",
    icon: Image,
  },
  {
    label: "조직도",
    href: "/organization",
    icon: Building2,
  },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="flex justify-around">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center py-2 px-3 min-w-[64px]",
                "text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}