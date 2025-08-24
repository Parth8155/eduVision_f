import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";

// Simple ToastProvider and ToastViewport
export const ToastProvider = ToastPrimitives.Provider;
export const ToastViewport = React.forwardRef((props, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    style={{ position: "fixed", top: 20, right: 20, zIndex: 1000, minWidth: 320 }}
    {...props}
  />
));

// Simple Toast component
export const Toast = React.forwardRef((props, ref) => (
  <ToastPrimitives.Root
    ref={ref}
    style={{
      background: "#222",
      color: "#fff",
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      minWidth: 280,
      maxWidth: 400,
    }}
    {...props}
  />
));

// Simple ToastTitle and ToastDescription
export const ToastTitle = React.forwardRef((props, ref) => (
  <ToastPrimitives.Title ref={ref} style={{ fontWeight: 600, fontSize: 16 }} {...props} />
));
export const ToastDescription = React.forwardRef((props, ref) => (
  <ToastPrimitives.Description ref={ref} style={{ fontSize: 14, opacity: 0.85 }} {...props} />
));

// Simple ToastClose
export const ToastClose = React.forwardRef((props, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}
    {...props}
  >
    ×
  </ToastPrimitives.Close>
));
