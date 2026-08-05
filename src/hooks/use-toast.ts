import * as React from "react";

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
}

type Listener = (toasts: ToastProps[]) => void;
let toasts: ToastProps[] = [];
let listeners: Listener[] = [];

export function toast(props: ToastProps) {
  const id = crypto.randomUUID();
  const newToast = { ...props, id };
  toasts = [...toasts, newToast];
  listeners.forEach((l) => l(toasts));
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((l) => l(toasts));
  }, 4000);
}

export function useToast() {
  const [state, setState] = React.useState<ToastProps[]>(toasts);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      listeners = listeners.filter((l) => l !== setState);
    };
  }, []);

  return { toasts: state, toast };
}
