import React, { useState, useRef, useEffect } from "react";
import "./ChatBot.css";

/* ====================================
   KNOWLEDGE BASE — rule-based replies
==================================== */
const FAQ = [
  {
    keywords: ["track", "where", "shipping", "delivery", "status", "when"],
    answer:
      "You can track your order from the **Orders** page. Once shipped, delivery usually takes 3-5 business days. If your order shows 'Pending', it hasn't shipped yet.",
  },
  {
    keywords: ["return", "exchange", "replace"],
    answer:
      "We offer a **7-day return policy** on most items. To initiate a return, go to **Orders → Help with this Order** and select the item you'd like to return.",
  },
  {
    keywords: ["refund", "money back", "payment failed"],
    answer:
      "Refunds are processed within **5-7 business days** after the return is approved. If your payment failed, the amount will be auto-refunded within 48 hours.",
  },
  {
    keywords: ["cancel", "cancel order"],
    answer:
      "You can cancel your order before it's shipped. Go to **Orders**, find your order, and click **Help with this Order** to request cancellation.",
  },
  {
    keywords: ["payment", "pay", "upi", "card", "cod", "cash"],
    answer:
      "We accept **COD, UPI, and Credit/Debit Cards**. If your payment failed, please try again or choose a different method.",
  },
  {
    keywords: ["account", "login", "password", "register", "sign"],
    answer:
      "You can create an account or log in from the **Login** page. If you forgot your password, please contact support for a reset.",
  },
  {
    keywords: ["contact", "support", "email", "phone", "call"],
    answer:
      "📧 Email: support@flipkartclone.com\n📞 Phone: 1800-xxx-xxxx (Mon-Sat, 9AM-9PM)\nOr just ask me anything here!",
  },
  {
    keywords: ["hello", "hi", "hey", "help", "start"],
    answer:
      "Hi there! 👋 I'm your Flipkart Clone assistant. How can I help you today?\n\nI can help with:\n• Order tracking & status\n• Returns & refunds\n• Payment issues\n• Account help\n\nJust type your question!",
  },
  {
    keywords: ["thank", "thanks", "bye", "okay", "ok"],
    answer:
      "You're welcome! 😊 If you need anything else, feel free to ask. Happy shopping! 🛍️",
  },
  {
    keywords: ["need help with order", "help with order"],
    answer:
      "I can see your order details! Here's what I can help with:\n\n• **Track** — Check delivery status\n• **Cancel** — Cancel before shipping\n• **Return** — Start a return (within 7 days)\n• **Refund** — Check refund status\n\nJust tell me what you'd like to do!",
  },
];

function getReply(message) {
  const lower = message.toLowerCase();

  for (const faq of FAQ) {
    if (faq.keywords.some((kw) => lower.includes(kw))) {
      return faq.answer;
    }
  }

  return "I'm not sure about that, but I'd love to help! Could you try rephrasing? You can ask about **orders, returns, refunds, payments,** or **account issues**.";
}

/* ====================================
   QUICK ACTIONS (suggestion chips)
==================================== */
const QUICK_ACTIONS = [
  "Track my order",
  "Return/Refund",
  "Payment issue",
  "Cancel order",
  "Contact support",
];

/* ====================================
   CHATBOT COMPONENT
==================================== */
function ChatBot({ initialMessage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi! 👋 I'm your Flipkart assistant. How can I help you today?",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const lastInitialMsg = useRef("");

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handle initialMessage from Orders page — auto-open and send
  useEffect(() => {
    if (initialMessage && initialMessage !== lastInitialMsg.current) {
      lastInitialMsg.current = initialMessage;
      setIsOpen(true);
      // Small delay to let the window animate open
      setTimeout(() => {
        handleSend(initialMessage);
      }, 400);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = (text) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    // Add user message
    const userMsg = { from: "user", text: messageText, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Bot typing indicator
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const reply = getReply(messageText);
      const botMsg = { from: "bot", text: reply, time: new Date() };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600 + Math.random() * 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Format markdown-like bold text
  const formatText = (text) => {
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={j}>{part.slice(2, -2)}</strong>
          ) : (
            part
          )
        )}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* 💬 FLOATING BUTTON */}
      <button
        id="chatbot-toggle"
        className={`chatbot-fab ${isOpen ? "chatbot-fab--open" : ""}`}
        onClick={toggleChat}
        aria-label="Customer Support Chat"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="chatbot-fab-badge">Help</span>
          </>
        )}
      </button>

      {/* 💬 CHAT WINDOW */}
      <div className={`chatbot-window ${isOpen ? "chatbot-window--open" : ""}`}>
        {/* HEADER */}
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <h4>Flipkart Support</h4>
              <span className="chatbot-status">● Online</span>
            </div>
          </div>
          <button className="chatbot-close" onClick={toggleChat}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* MESSAGES */}
        <div className="chatbot-messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chatbot-msg ${msg.from === "user" ? "chatbot-msg--user" : "chatbot-msg--bot"}`}
            >
              {msg.from === "bot" && (
                <div className="chatbot-msg-avatar">🤖</div>
              )}
              <div className="chatbot-msg-bubble">
                <p>{formatText(msg.text)}</p>
                <span className="chatbot-msg-time">{formatTime(msg.time)}</span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="chatbot-msg chatbot-msg--bot">
              <div className="chatbot-msg-avatar">🤖</div>
              <div className="chatbot-msg-bubble chatbot-typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* QUICK ACTIONS */}
        {messages.length <= 2 && (
          <div className="chatbot-quick-actions">
            {QUICK_ACTIONS.map((action, i) => (
              <button
                key={i}
                className="chatbot-chip"
                onClick={() => handleSend(action)}
              >
                {action}
              </button>
            ))}
          </div>
        )}

        {/* INPUT */}
        <div className="chatbot-input-area">
          <input
            ref={inputRef}
            id="chatbot-input"
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            id="chatbot-send"
            className="chatbot-send"
            onClick={() => handleSend()}
            disabled={!input.trim()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatBot;
