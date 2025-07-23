import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { SupabaseProvider } from "@/components/providers/supabase-provider"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SupabaseProvider>
      <div className="relative min-h-screen">
        <Header />
        <main className="pb-20 md:pb-0">
          {children}
        </main>
        <MobileNav />
      </div>
    </SupabaseProvider>
  )
}