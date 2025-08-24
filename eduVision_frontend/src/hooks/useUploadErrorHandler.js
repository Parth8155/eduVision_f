import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useUploadErrorHandler = () => {
  const navigate = useNavigate();

  const handleUploadError = (error) => {
    let errorMessage = "Upload failed";

    // Handle specific error codes from the backend
    if (error.message) {
      switch (error.message) {
        case "SESSION_EXPIRED":
          errorMessage = "Session expired. Please login again.";
          setTimeout(() => {
            navigate("/login");
          }, 2000);
          break;
        case "UPLOAD_FORMAT_ERROR":
          errorMessage = "Upload format error. Please try again.";
          break;
        case "FILE_TOO_LARGE":
          errorMessage =
            "One or more files are too large. Maximum size is 10MB per file.";
          break;
        case "INVALID_FILE_TYPE":
          errorMessage =
            "Invalid file type. Only images and PDF files are allowed.";
          break;
        default:
          if (
            error.message.includes("Authentication required") ||
            error.message.includes("Session expired")
          ) {
            errorMessage = "Session expired. Please login again.";
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          } else if (error.message.includes("timeout")) {
            errorMessage =
              "Upload timeout. Please try again with smaller files.";
          } else if (error.message.includes("File too large")) {
            errorMessage =
              "One or more files are too large. Maximum size is 10MB per file.";
          } else if (error.message.includes("Unexpected field")) {
            errorMessage = "Upload format error. Please try again.";
          } else if (error.message.includes("Invalid file type")) {
            errorMessage =
              "Invalid file type. Only images and PDF files are allowed.";
          } else if (error.message.includes("Network")) {
            errorMessage =
              "Network error. Please check your connection and try again.";
          } else if (error.message.includes("CORS")) {
            errorMessage =
              "Connection error. Please check your network settings.";
          } else if (error.message.includes("fetch")) {
            errorMessage =
              "Connection failed. Please check your internet connection.";
          } else {
            errorMessage = error.message;
          }
          break;
      }
    }

    // Handle HTTP status codes
    if (error.statusCode) {
      switch (error.statusCode) {
        case 401:
          errorMessage = "Session expired. Please login again.";
          setTimeout(() => {
            navigate("/login");
          }, 2000);
          break;
        case 403:
          errorMessage =
            "Access denied. You do not have permission to upload files.";
          break;
        case 413:
          errorMessage = "File too large. Maximum size is 10MB per file.";
          break;
        case 422:
          errorMessage = "Invalid file format or corrupted file.";
          break;
        case 429:
          errorMessage =
            "Too many requests. Please wait a moment and try again.";
          break;
        case 500:
          errorMessage = "Server error. Please try again later.";
          break;
        case 502:
        case 503:
        case 504:
          errorMessage =
            "Service temporarily unavailable. Please try again later.";
          break;
      }
    }

    return errorMessage;
  };

  const showUploadError = (error) => {
    const message = handleUploadError(error);
    toast.error(message);
    return message;
  };

  const showUploadSuccess = (message = "Upload completed successfully!") => {
    toast.success(message);
  };

  const showUploadWarning = (message) => {
    toast.warning(message);
  };

  const showUploadInfo = (message) => {
    toast.info(message);
  };

  return {
    handleUploadError,
    showUploadError,
    showUploadSuccess,
    showUploadWarning,
    showUploadInfo,
  };
};

export default useUploadErrorHandler;
