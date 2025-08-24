import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Bot,
  User,
  Loader2,
  MessageSquare,
  Settings,
  Trash2,
  Plus,
  ChevronDown,
  Clock,
} from "lucide-react";
import chatService from "../../services/chatService";

// Component to format AI responses with basic markdown-like formatting
const FormattedMessage = ({ content }) => {
  const formatContent = (text) => {
    // Split by lines to handle different types of content
    const lines = text.split("\n");
    const formattedLines = [];
    let inCodeBlock = false;
    let codeLanguage = "";
    let codeLines = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Handle code blocks
      if (trimmedLine.startsWith("```")) {
        if (!inCodeBlock) {
          // Start of code block
          inCodeBlock = true;
          codeLanguage = trimmedLine.replace("```", "") || "code";
          codeLines = [];
        } else {
          // End of code block
          inCodeBlock = false;
          formattedLines.push(
            <div key={`codeblock-${index}`} className="my-3">
              <div className="text-xs bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-t text-gray-600 dark:text-gray-400 font-mono">
                {codeLanguage}
              </div>
              <div className="bg-gray-900 dark:bg-gray-800 px-3 py-2 rounded-b font-mono text-sm overflow-x-auto">
                {codeLines.map((codeLine, lineIndex) => (
                  <div
                    key={lineIndex}
                    className="text-green-400 dark:text-green-300"
                  >
                    {codeLine || "\u00A0"}
                  </div>
                ))}
              </div>
            </div>
          );
        }
        return;
      }

      // If we're inside a code block, collect the lines
      if (inCodeBlock) {
        codeLines.push(line);
        return;
      }

      // Skip empty lines (but keep them for spacing)
      if (!trimmedLine) {
        formattedLines.push(<div key={index} className="h-2" />);
        return;
      }

      // Headers (### text)
      if (trimmedLine.startsWith("### ")) {
        formattedLines.push(
          <h3
            key={index}
            className="font-bold text-lg mt-4 mb-2 text-blue-700 dark:text-blue-300"
          >
            {trimmedLine.replace("### ", "")}
          </h3>
        );
      }
      // Subheaders (#### text)
      else if (trimmedLine.startsWith("#### ")) {
        formattedLines.push(
          <h4
            key={index}
            className="font-semibold text-base mt-3 mb-2 text-gray-700 dark:text-gray-300"
          >
            {trimmedLine.replace("#### ", "")}
          </h4>
        );
      }
      // Special styled headers with emojis
      else if (trimmedLine.match(/^[📚🚀💡🛠️🧩🔍]\s*\*\*(.*?)\*\*/)) {
        const match = trimmedLine.match(/^([📚🚀💡🛠️🧩🔍])\s*\*\*(.*?)\*\*/);
        if (match) {
          formattedLines.push(
            <div key={index} className="flex items-center mt-4 mb-3">
              <span className="text-2xl mr-2">{match[1]}</span>
              <h3 className="font-bold text-lg text-blue-700 dark:text-blue-300">
                {match[2]}
              </h3>
            </div>
          );
        }
      }
      // Horizontal rules (---)
      else if (trimmedLine === "---" || trimmedLine.match(/^-{30,}/)) {
        formattedLines.push(
          <hr
            key={index}
            className="border-gray-300 dark:border-gray-600 my-3"
          />
        );
      }
      // Numbered lists
      else if (trimmedLine.match(/^\d+\.\s/)) {
        const content = trimmedLine.replace(/^\d+\.\s/, "");
        formattedLines.push(
          <div key={index} className="ml-4 mb-2 flex items-start">
            <span className="text-blue-600 dark:text-blue-400 mr-2 font-medium min-w-[1.5rem]">
              {trimmedLine.match(/^(\d+)\./)?.[1]}.
            </span>
            <span className="text-sm">{formatInlineText(content)}</span>
          </div>
        );
      }
      // Lists (- item, * item, or • item)
      else if (
        trimmedLine.startsWith("- ") ||
        trimmedLine.startsWith("* ") ||
        trimmedLine.startsWith("• ")
      ) {
        const content = trimmedLine.slice(2).trim();
        formattedLines.push(
          <div key={index} className="ml-4 mb-1 flex items-start">
            <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
            <span className="text-sm">{formatInlineText(content)}</span>
          </div>
        );
      }
      // Table separator lines (-------)
      else if (trimmedLine.match(/^[\-\|:\s]+$/)) {
        // Skip table separator lines
        return;
      }
      // Table rows (| cell | cell |)
      else if (trimmedLine.includes("|") && trimmedLine.split("|").length > 2) {
        const cells = trimmedLine
          .split("|")
          .map((cell) => cell.trim())
          .filter((cell) => cell);
        formattedLines.push(
          <div
            key={index}
            className="grid grid-cols-2 gap-4 py-2 text-sm border-b border-gray-200 dark:border-gray-700 mb-1"
          >
            {cells.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className={
                  cellIndex === 0
                    ? "font-semibold text-gray-800 dark:text-gray-200"
                    : "text-gray-600 dark:text-gray-400"
                }
              >
                {formatInlineText(cell)}
              </div>
            ))}
          </div>
        );
      }
      // Question prompts (❓ text or special patterns)
      else if (
        trimmedLine.includes("❓") ||
        trimmedLine.includes("Need More Details") ||
        trimmedLine.includes("Just ask")
      ) {
        formattedLines.push(
          <div
            key={index}
            className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400"
          >
            <div className="text-sm text-blue-800 dark:text-blue-200">
              {formatInlineText(trimmedLine)}
            </div>
          </div>
        );
      }
      // Regular paragraphs
      else {
        formattedLines.push(
          <p key={index} className="mb-2 text-sm leading-relaxed">
            {formatInlineText(trimmedLine)}
          </p>
        );
      }
    });

    return formattedLines;
  };

  // Helper function to format inline text (bold, inline code, etc.)
  const formatInlineText = (text) => {
    // Handle bold text (**text**)
    const parts = text.split(/(\*\*.*?\*\*)/);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong
            key={index}
            className="font-semibold text-gray-800 dark:text-gray-200"
          >
            {part.slice(2, -2)}
          </strong>
        );
      }
      // Handle inline code (`code`)
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={index}
            className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs font-mono"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return <div className="space-y-1 max-w-none">{formatContent(content)}</div>;
};

const ChatBot = ({
  noteData,
  isVisible,
  selectedText,
  onClearSelectedText,
}) => {
  const [conversation, setConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [conversationStarters, setConversationStarters] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showConversationList, setShowConversationList] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load conversation when note changes or component becomes visible
  useEffect(() => {
    if (isVisible && noteData?._id) {
      loadConversations();
      loadConversationStarters();
    }
  }, [isVisible, noteData?._id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-focus input when text is selected
  useEffect(() => {
    if (selectedText && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedText]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    if (!noteData?._id) return;

    setIsLoadingConversation(true);
    setConnectionError(null);
    try {
      // Load all conversations for this note
      const allConversations = await chatService.getAllConversations(
        noteData._id
      );
      setConversations(allConversations);

      // Load the most recent conversation (or create new one if none exists)
      if (allConversations.length > 0) {
        const mostRecent = allConversations[0]; // Assuming they're sorted by date
        setConversation(mostRecent);
        setMessages(mostRecent.messages || []);
      } else {
        // Create a new conversation if none exists
        const newConv = await chatService.getConversation(noteData._id);
        setConversation(newConv);
        setMessages(newConv.messages || []);
        setConversations([newConv]);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
      setMessages([]);
      setConversations([]);
      if (error instanceof Error) {
        if (error.message.includes("Access token required")) {
          setConnectionError(
            "Authentication required. Please make sure you are logged in."
          );
        } else if (
          error.message.includes("Network error") ||
          error.message.includes("Failed to fetch")
        ) {
          setConnectionError(
            "Cannot connect to chat server. Please make sure the backend server is running."
          );
        } else {
          setConnectionError("Failed to load conversations. Please try again.");
        }
      }
    } finally {
      setIsLoadingConversation(false);
    }
  };

  const createNewConversation = async () => {
    if (!noteData?._id) return;

    try {
      const newConv = await chatService.createNewConversation(noteData._id);
      setConversation(newConv);
      setMessages([]);
      setConversations((prev) => [newConv, ...prev]);
      setShowConversationList(false);
    } catch (error) {
      console.error("Failed to create new conversation:", error);
    }
  };

  const switchToConversation = async (conv) => {
    try {
      setConversation(conv);
      setMessages(conv.messages || []);
      setShowConversationList(false);
    } catch (error) {
      console.error("Failed to switch conversation:", error);
    }
  };

  const deleteConversation = async (convId, event) => {
    if (event) {
      event.stopPropagation();
    }

    if (!window.confirm("Are you sure you want to delete this conversation?")) {
      return;
    }

    try {
      await chatService.deleteConversation(convId);

      // Remove from conversations list
      const updatedConversations = conversations.filter(
        (c) => c._id !== convId
      );
      setConversations(updatedConversations);

      // If we deleted the current conversation, switch to another or create new
      if (conversation?._id === convId) {
        if (updatedConversations.length > 0) {
          const nextConv = updatedConversations[0];
          setConversation(nextConv);
          setMessages(nextConv.messages || []);
        } else {
          // Create a new conversation if no others exist
          await createNewConversation();
        }
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  const loadConversationStarters = async () => {
    if (!noteData?._id) return;

    try {
      const starters = await chatService.getConversationStarters(noteData._id);
      setConversationStarters(starters);
    } catch (error) {
      console.error("Failed to load conversation starters:", error);
    }
  };

  const sendMessage = async (message) => {
    if (!message.trim() || !noteData?._id || isLoading) return;

    setIsLoading(true);

    // Add user message to UI immediately
    const userMessage = {
      role: "user",
      content: message.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...(prev || []), userMessage]);
    setInputMessage("");

    try {
      // Prepare context with selected text if available
      const context = selectedText
        ? {
            selectedText: selectedText.text,
            pageNumber: selectedText.pageNumber,
            context: selectedText.context,
          }
        : undefined;

      // Send message to backend and get AI response
      const response = await chatService.sendMessage(
        noteData._id,
        message.trim(),
        context
      );

      // Add AI response to messages
      setMessages((prev) => [...(prev || []), response]);

      // Clear selected text after sending
      if (selectedText && onClearSelectedText) {
        onClearSelectedText();
      }

      // Update conversation if needed
      if (!conversation) {
        await loadConversations();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Remove the user message if sending failed
      setMessages((prev) => (prev || []).slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const handleStarterClick = (starter) => {
    sendMessage(starter);
  };

  const clearConversation = async () => {
    if (!conversation?._id) return;

    if (window.confirm("Are you sure you want to clear this conversation?")) {
      try {
        await chatService.deleteConversation(conversation._id);
        setMessages([]);
        setConversation(null);
        await loadConversations();
      } catch (error) {
        console.error("Failed to clear conversation:", error);
      }
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours =
      Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Study Assistant
            </h3>
            {conversation && (
              <button
                onClick={() => setShowConversationList(!showConversationList)}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Switch conversation"
              >
                <span className="truncate max-w-20">
                  {conversation.title ||
                    `Chat ${
                      conversations.findIndex(
                        (c) => c._id === conversation._id
                      ) + 1
                    }`}
                </span>
                <ChevronDown className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={createNewConversation}
            className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            title="New conversation"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={clearConversation}
            className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            title="Clear conversation"
            disabled={!conversation || !messages || messages.length === 0}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Conversation List Dropdown */}
      {showConversationList && conversations.length > 0 && (
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="p-2 max-h-40 overflow-y-auto">
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Conversation:
            </div>
            {conversations.map((conv, index) => (
              <div
                key={conv._id}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                  conv._id === conversation?._id
                    ? "bg-blue-100 dark:bg-blue-900/20"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => switchToConversation(conv)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {conv.title || `Chat ${index + 1}`}
                    </span>
                    {conv._id === conversation?._id && (
                      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{conv.messages?.length || 0} messages</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(conv.metadata.lastActivity)}</span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => deleteConversation(conv._id, e)}
                  className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Delete conversation"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {connectionError ? (
          <div className="text-center py-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center mb-2">
                <Bot className="w-8 h-8 text-red-500" />
              </div>
              <h4 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
                Connection Error
              </h4>
              <p className="text-red-700 dark:text-red-300 text-sm mb-4">
                {connectionError}
              </p>
              <button
                onClick={() => loadConversations()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : isLoadingConversation ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500 dark:text-gray-400">
              Loading conversation...
            </span>
          </div>
        ) : !messages || messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Start a conversation
            </h4>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Ask questions about your notes or get study help
            </p>

            {/* Conversation Starters */}
            {conversationStarters && conversationStarters.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Try asking:
                </p>
                {conversationStarters.map((starter, index) => (
                  <button
                    key={index}
                    onClick={() => handleStarterClick(starter)}
                    className="block w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          (messages || [])
            .filter((message) => message && message.role)
            .map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-1 text-sm ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                  }`}
                >
                  <div className="flex items-start space-x-1">
                    {message.role === "assistant" && (
                      <Bot className="w-4 h-4 mt-0.5 text-blue-600" />
                    )}
                    {message.role === "user" && (
                      <User className="w-4 h-4 mt-0.5 text-white" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm leading-relaxed">
                        {message.role === "assistant" ? (
                          <FormattedMessage content={message.content} />
                        ) : (
                          <p className="whitespace-pre-wrap">
                            {message.content}
                          </p>
                        )}
                      </div>
                      <p className="text-xs opacity-70 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                      {message.noteReferences &&
                        message.noteReferences.length > 0 && (
                          <div className="mt-2 text-xs opacity-80">
                            <p className="font-medium">References:</p>
                            {(message.noteReferences || [])
                              .filter((ref) => ref)
                              .map((ref, i) => (
                                <p key={i}>
                                  Page {ref.pageNumber}: {ref.excerpt}
                                </p>
                              ))}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[80%]">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-blue-600" />
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">
                  Thinking...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Selected Text Display */}
      {selectedText && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20 p-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center mb-2">
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">
                  Page {selectedText.pageNumber} - Selected Text
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-3">
                "{selectedText.text}"
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setInputMessage(
                      `Explain this text from page ${selectedText.pageNumber}: "${selectedText.text}"`
                    );
                    onClearSelectedText?.();
                  }}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                >
                  Explain this
                </button>
                <button
                  onClick={() => {
                    setInputMessage(
                      `What does this mean in context: "${selectedText.text}"`
                    );
                    onClearSelectedText?.();
                  }}
                  className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors"
                >
                  Ask about meaning
                </button>
                <button
                  onClick={() => {
                    setInputMessage(
                      `Create a question about: "${selectedText.text}"`
                    );
                    onClearSelectedText?.();
                  }}
                  className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded transition-colors"
                >
                  Create question
                </button>
              </div>
            </div>
            <button
              onClick={onClearSelectedText}
              className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Clear selection"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about your notes..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading || !noteData?._id}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading || !noteData?._id}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center space-x-1"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
