import { Link } from 'react-router-dom'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  actionTo?: string
  onAction?: () => void
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="bg-gl-softbloom border border-gl-dustypetal rounded-xl p-10 text-center">
      <p className="font-display text-display-md text-gl-ink mb-2">{title}</p>
      <p className="text-sm text-gl-stone mb-6 max-w-sm mx-auto">{description}</p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="bg-gl-moss text-white text-sm font-medium px-5 py-2.5 rounded-md hover:opacity-90 inline-block"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <button
          onClick={onAction}
          className="bg-gl-moss text-white text-sm font-medium px-5 py-2.5 rounded-md hover:opacity-90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
