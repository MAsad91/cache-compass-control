
import { createContext, useContext, useState } from "react";

const ToastContext = createContext({
  toasts: [],
  addToast: () => {},
  dismissToast: () => {},
  dismissAll: () => {},
});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Math.random().toString(36).slice(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    if (toast.duration !== Infinity) {
      setTimeout(() => {
        dismissToast(id);
      }, toast.duration || 5000);
    }

    return id;
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const dismissAll = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, dismissToast, dismissAll }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return {
    ...context,
    toast: (props) => {
      return context.addToast(props);
    },
  };
}

export const toast = (props) => {
  const context = useContext(ToastContext);

  if (!context) {
    return;
  }

  if (typeof props === "string") {
    return context.addToast({ description: props });
  }

  return context.addToast(props);
};

// For external use (if needed)
toast.dismiss = (id) => {
  const context = useContext(ToastContext);
  if (context) context.dismissToast(id);
};

toast.success = (props) => {
  const description = typeof props === "string" ? props : props?.description;
  return toast({
    variant: "default",
    title: "Success",
    description,
    ...(typeof props === "object" ? props : {}),
  });
};

toast.error = (props) => {
  const description = typeof props === "string" ? props : props?.description;
  return toast({
    variant: "destructive",
    title: "Error",
    description,
    ...(typeof props === "object" ? props : {}),
  });
};

toast.warning = (props) => {
  const description = typeof props === "string" ? props : props?.description;
  return toast({
    variant: "default",
    title: "Warning",
    description,
    ...(typeof props === "object" ? props : {}),
  });
};

toast.info = (props) => {
  const description = typeof props === "string" ? props : props?.description;
  return toast({
    variant: "default",
    title: "Info",
    description,
    ...(typeof props === "object" ? props : {}),
  });
};
