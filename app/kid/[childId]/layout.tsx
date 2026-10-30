import type { ReactNode } from 'react'
import PipCompanion from '@/components/PipCompanion'

interface KidLayoutProps {
  children: ReactNode
  params: {
    childId: string
  }
}

export default function KidLayout({ children }: KidLayoutProps) {
  return (
    <div className="clay-puffy-canvas relative min-h-screen w-full overflow-x-hidden text-clay-text">
      {/* Main page content container */}
      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-28 pt-6 sm:px-6 md:pb-12">
        {children}
      </main>

      {/* Unboxed free-floating 3D clay companion */}
      <PipCompanion />
    </div>
  )
}