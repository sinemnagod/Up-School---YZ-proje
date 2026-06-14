import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastStore {
  toasts: Toast[]
  addToast: (type: ToastType, message: string) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (type, message) => {
    const id = crypto.randomUUID()
    set(state => ({ toasts: [...state.toasts, { id, type, message }] }))
    setTimeout(() => {
      set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }))
    }, 4000)
  },
  removeToast: (id) => set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),
}))

export function toast(type: ToastType, message: string) {
  useToastStore.getState().addToast(type, message)
}

export function toastSuccess(message: string) {
  toast('success', message)
}

export function toastError(message: string) {
  toast('error', message)
}

export function toastInfo(message: string) {
  toast('info', message)
}
