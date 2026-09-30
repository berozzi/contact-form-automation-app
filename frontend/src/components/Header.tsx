import type { ReactNode } from 'react'

type HeaderProps = {
  title: string
  subtitle?: ReactNode
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-1 px-6 py-8 sm:py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 sm:text-base">{subtitle}</p>}
      </div>
    </header>
  )
}
