import { cn } from '@/lib/utils'
import { ImageIcon } from 'lucide-react'

/**
 * Reusable phone frame. Pass `label` to render a labeled screenshot
 * placeholder slot, or pass `children` to render custom screen content.
 */
export function PhoneFrame({
  label,
  children,
  className,
}: {
  label?: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative aspect-[9/19] w-full max-w-[300px] overflow-hidden rounded-[2.5rem] border-[6px] border-foreground bg-secondary shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]',
        className,
      )}
    >
      <div
        className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-foreground"
        aria-hidden="true"
      />
      {children ? (
        <div className="absolute inset-0">{children}</div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <ImageIcon className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm font-medium text-muted-foreground text-balance">
            {label ? `Screenshot: ${label}` : 'Screenshot slot'}
          </p>
        </div>
      )}
    </div>
  )
}
