import { useToastStore } from '../store/toastStore'

const styles: Record<string, string> = {
  success: 'bg-[#E2EDD6] border-gl-moss text-[#3D5030]',
  error: 'bg-gl-danger-light border-gl-danger-mid text-gl-danger',
  info: 'bg-gl-softbloom border-gl-dustypetal text-gl-plum',
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)] sm:w-80">
      {toasts.map(t => (
        <div
          key={t.id}
          role="alert"
          className={`border text-sm px-4 py-3 rounded-lg shadow-lg flex items-start justify-between gap-3 ${styles[t.type]}`}
        >
          <span>{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="opacity-60 hover:opacity-100 leading-none flex-shrink-0"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
