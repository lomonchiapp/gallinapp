interface LogoProps {
  variant?: 'line' | 'full' | 'icon'
  height?: number
  className?: string
}

export function Logo({ variant = 'line', height = 40, className }: LogoProps) {
  // Por ahora, un placeholder. Debería usar el logo real de @gallinapp/assets
  return (
    <div className={className} style={{ height }}>
      <span className="text-primary-500 font-bold text-xl">Gallinapp</span>
      {variant === 'line' && <span className="text-secondary-500 ml-2">Admin</span>}
    </div>
  )
}

