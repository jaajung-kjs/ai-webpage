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
        <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
          {children}
        </main>
        <MobileNav />
      </div>
    </SupabaseProvider>
  )
}