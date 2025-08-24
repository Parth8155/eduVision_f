import React, { createContext, useContext, useReducer } from "react";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

const initialState = {
  notifications: [],
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
      };
    case "CLEAR_ALL":
      return {
        ...state,
        notifications: [],
      };
    default:
      return state;
  }
};

const NotificationContext = createContext(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const addNotification = (notification) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };

    dispatch({ type: "ADD_NOTIFICATION", payload: newNotification });

    // Auto-remove non-persistent notifications
    if (!notification.persistent) {
      const duration = notification.duration || 5000;
      setTimeout(() => {
        dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
      }, duration);
    }
  };

  const removeNotification = (id) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
  };

  const clearAll = () => {
    dispatch({ type: "CLEAR_ALL" });
  };

  const showSuccess = (title, message, duration = 5000) => {
    addNotification({ type: "success", title, message, duration });
  };

  const showError = (title, message, persistent = false) => {
    addNotification({
      type: "error",
      title,
      message,
      persistent,
      duration: persistent ? undefined : 8000,
    });
  };

  const showWarning = (title, message, duration = 6000) => {
    addNotification({ type: "warning", title, message, duration });
  };

  const showInfo = (title, message, duration = 5000) => {
    addNotification({ type: "info", title, message, duration });
  };

  const value = {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <AlertCircle className="w-5 h-5" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5" />;
      case "info":
        return <Info className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getColorClasses = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "";
    }
  };

  const getIconColorClasses = (type) => {
    switch (type) {
      case "success":
        return "text-green-400";
      case "error":
        return "text-red-400";
      case "warning":
        return "text-yellow-400";
      case "info":
        return "text-blue-400";
      default:
        return "";
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-sm w-full">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border shadow-lg transition-all duration-300 ease-in-out ${getColorClasses(
            notification.type
          )}`}
        >
          <div className="flex items-start">
            <div
              className={`flex-shrink-0 ${getIconColorClasses(
                notification.type
              )}`}
            >
              {getIcon(notification.type)}
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium">{notification.title}</h3>
              {notification.message && (
                <p className="mt-1 text-sm opacity-90">
                  {notification.message}
                </p>
              )}
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={() => removeNotification(notification.id)}
                className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current opacity-60 hover:opacity-100 transition-opacity"
                aria-label="Close notification"
                title="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationProvider;
