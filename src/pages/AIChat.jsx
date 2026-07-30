import React, {
  useState,
  useEffect,
  useRef,
  useMemo
} from "react";

import { chatWithAssistant } from "../services/ai/incogAI";

import { convertLatexToMarkup } from "mathlive";

import "mathlive";
import "mathlive/static.css";

import "../styles/AIChat.css";

export default function AIChat() {

  /* ===========================
     CHAT STATE
  =========================== */

  const [messages, setMessages] = useState([]);

  const [currentChatId, setCurrentChatId] = useState(null);

  const [chatHistory, setChatHistory] = useState([]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [typing, setTyping] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");

  /* ===========================
     REFERENCES
  =========================== */

  const chatRef = useRef(null);

  const inputRef = useRef(null);

  /* ===========================
     AUTO SCROLL
  =========================== */

  useEffect(() => {

    if (!chatRef.current) return;

    chatRef.current.scrollTo({

      top: chatRef.current.scrollHeight,

      behavior: "smooth"

    });

  }, [messages, typing]);

  /* ===========================
     LOAD CHAT HISTORY
  =========================== */

  useEffect(() => {

    const saved = localStorage.getItem(
      "incog_ai_chats"
    );

    if (!saved) return;

    try {

      const chats = JSON.parse(saved);

      setChatHistory(chats);

      if (chats.length > 0) {

        setCurrentChatId(chats[0].id);

        setMessages(chats[0].messages || []);

      }

    } catch (error) {

      console.error(error);

    }

  }, []);

  /* ===========================
     SAVE CHAT HISTORY
  =========================== */

  useEffect(() => {

    localStorage.setItem(

      "incog_ai_chats",

      JSON.stringify(chatHistory)

    );

  }, [chatHistory]);

  /* ===========================
     BUILD AI HISTORY
  =========================== */

  const history = useMemo(() => {

    return messages.map(message =>

      message.role === "user"

        ? { user: message.content }

        : { assistant: message.content }

    );

  }, [messages]);

  /* ===========================
     CONVERSATION MANAGER
  =========================== */

  function createNewChat() {

    const newChat = {

      id: crypto.randomUUID(),

      title: "New Chat",

      createdAt: Date.now(),

      messages: []

    };

    setChatHistory(prev => [

      newChat,

      ...prev

    ]);

    setCurrentChatId(newChat.id);

    setMessages([]);

  }

  function openChat(chatId) {

    const chat = chatHistory.find(

      item => item.id === chatId

    );

    if (!chat) return;

    setCurrentChatId(chat.id);

    setMessages(chat.messages || []);

    setSidebarOpen(false);

  }

  function deleteChat(chatId) {

    const updated = chatHistory.filter(

      item => item.id !== chatId

    );

    setChatHistory(updated);

    if (chatId === currentChatId) {

      if (updated.length > 0) {

        setCurrentChatId(updated[0].id);

        setMessages(updated[0].messages);

      } else {

        setCurrentChatId(null);

        setMessages([]);

      }

    }

  }

  function renameChat(chatId, title) {

    const updated = chatHistory.map(chat =>

      chat.id === chatId

        ? {

            ...chat,

            title

          }

        : chat

    );

    setChatHistory(updated);

  }

  function updateCurrentConversation(updatedMessages) {

    setMessages(updatedMessages);

    if (!currentChatId) return;

    const updated = chatHistory.map(chat =>

      chat.id === currentChatId

        ? {

            ...chat,

            messages: updatedMessages,

            updatedAt: Date.now()

          }

        : chat

    );

    setChatHistory(updated);

  }

  /* ===========================
     SEARCH HISTORY
  =========================== */

  const filteredChats = chatHistory.filter(

    chat =>

      chat.title

        .toLowerCase()

        .includes(

          search.toLowerCase()

        )

  );

  /* ===========================
     SEND MESSAGE
  =========================== */

  async function sendMessage() {

    const question = input.trim();

    if (!question || loading) return;

    const userMessage = {

      id: crypto.randomUUID(),

      role: "user",

      content: question,

      time: new Date().toLocaleTimeString([], {

        hour: "2-digit",

        minute: "2-digit"

      })

    };

    const newMessages = [

      ...messages,

      userMessage

    ];

    updateCurrentConversation(newMessages);

    setInput("");

    setLoading(true);

    setTyping(true);

    try {

      const reply = await chatWithAssistant(

        question,

        history

      );

      const assistantMessage = {

        id: crypto.randomUUID(),

        role: "assistant",

        content: reply,

        time: new Date().toLocaleTimeString([], {

          hour: "2-digit",

          minute: "2-digit"

        })

      };

      updateCurrentConversation([

        ...newMessages,

        assistantMessage

      ]);

    } catch (error) {

      console.error(error);

      updateCurrentConversation([

        ...newMessages,

        {

          id: crypto.randomUUID(),

          role: "assistant",

          

          time: new Date().toLocaleTimeString([], {

            hour: "2-digit",

            minute: "2-digit"

          })

        }

      ]);

    } finally {

      setLoading(false);

      setTyping(false);

    }

  }

  /* ===========================
     ENTER TO SEND
  =========================== */

  function handleKeyDown(e) {

    if (

      e.key === "Enter" &&

      !e.shiftKey

    ) {

      e.preventDefault();

      sendMessage();

    }

  }

  /* ===========================
     CLEAR CURRENT CHAT
  =========================== */

  function clearCurrentChat() {

    updateCurrentConversation([]);

  }

  /* ===========================
     REGENERATE RESPONSE
  =========================== */

  async function regenerateResponse() {

    const lastUser = [...messages]

      .reverse()

      .find(

        msg => msg.role === "user"

      );

    if (!lastUser) return;

    setLoading(true);

    setTyping(true);

    try {

      const reply = await chatWithAssistant(

        lastUser.content,

        history

      );

      updateCurrentConversation([

        ...messages,

        {

          id: crypto.randomUUID(),

          role: "assistant",

          content: reply,

          time: new Date().toLocaleTimeString([], {

            hour: "2-digit",

            minute: "2-digit"

          })

        }

      ]);

    } finally {

      setTyping(false);

      setLoading(false);

    }

  }

  /* ===========================
     MATH RENDERER
  =========================== */

  function renderMath(text = "") {

  if (!text) return null;

  const sections = text
    .split(/\n\s*\n/)
    .filter(Boolean);

  return sections.map((section, index) => {

    const lines = section
      .split("\n")
      .filter(Boolean);

    const elements = [];

    lines.forEach((line, i) => {

      const trimmed = line.trim();

      // Mathematics
      if (
        trimmed.startsWith("MATH:")
      ) {

        const latex = trimmed
          .replace(/^MATH:/, "")
          .trim();

        elements.push(

          <div
            key={`math-${i}`}
            className="incog-display-math"
            dangerouslySetInnerHTML={{
              __html: convertLatexToMarkup(
                latex,
                {
                  displayMode: true
                }
              )
            }}
          />

        );

        return;

      }

      // Titles
      if (

        /^Step\s+\d+/i.test(trimmed) ||

        /^Explanation$/i.test(trimmed) ||

        /^Final Answer$/i.test(trimmed)

      ) {

        elements.push(

          <h3
            key={`title-${i}`}
            className="incog-section-title"
          >

            {trimmed}

          </h3>

        );

        return;

      }

      // Bullet points
      if (
        trimmed.startsWith("•")
      ) {

        elements.push(

          <li
            key={`bullet-${i}`}
            className="incog-chat-bullet"
          >

            {trimmed.substring(1).trim()}

          </li>

        );

        return;

      }

      // Normal paragraph
      elements.push(

        <p
          key={`text-${i}`}
          className="incog-chat-paragraph"
        >

          {trimmed}

        </p>

      );

    });

    return (

      <div
        key={index}
        className="incog-chat-section"
      >

        {elements}

      </div>

    );

  });

}
  /* ===========================
     COPY MESSAGE
  =========================== */

  async function copyMessage(text) {

    try {

      await navigator.clipboard.writeText(text);

    } catch (error) {

      console.error(error);

    }

  }

  /* ===========================
     AUTO RESIZE TEXTAREA
  =========================== */

  useEffect(() => {

    if (!inputRef.current) return;

    inputRef.current.style.height = "0px";

    inputRef.current.style.height =
      inputRef.current.scrollHeight + "px";

  }, [input]);

  /* ===========================
     AUTO FOCUS
  =========================== */

  useEffect(() => {

    inputRef.current?.focus();

  }, []);

  /* ===========================
     WELCOME MESSAGE
  =========================== */

  useEffect(() => {

    if (messages.length > 0) return;

    const welcome = {

      id: crypto.randomUUID(),

      role: "assistant",

      content:
`Hello, I'm INCOG AI.

I can help you solve:

• Mathematics
• Physics
• Chemistry
• Electronics
• Engineering

Type your question below to begin.`,

      time: new Date().toLocaleTimeString([], {

        hour: "2-digit",

        minute: "2-digit"

      })

    };

    setMessages([welcome]);

  }, []);

  /* ===========================
     SCROLL TO LATEST
  =========================== */

  function scrollToBottom() {

    requestAnimationFrame(() => {

      if (!chatRef.current) return;

      chatRef.current.scrollTop =
        chatRef.current.scrollHeight;

    });

  }

  useEffect(() => {

    scrollToBottom();

  }, [messages, typing]);

  return (

    <div className="incog-chat">

      {/* ==========================
          SIDEBAR
      ========================== */}

      <aside
        className={
          sidebarOpen
            ? "incog-sidebar open"
            : "incog-sidebar"
        }
      >

        <div className="incog-sidebar-header">

          <button
            className="incog-new-chat"
            onClick={createNewChat}
          >

            + New Chat

          </button>

          <button
            className="incog-close-sidebar"
            onClick={() => setSidebarOpen(false)}
          >

            ✕

          </button>

        </div>

        <div className="incog-search">

          <input

            type="text"

            placeholder="Search chats..."

            value={search}

            onChange={(e) =>
              setSearch(e.target.value)
            }

          />

        </div>

        <div className="incog-history">

          {filteredChats.length === 0 ? (

            <div className="incog-empty-history">

              No conversations

            </div>

          ) : (

            filteredChats.map(chat => (

              <div

                key={chat.id}

                className={
                  chat.id === currentChatId
                    ? "incog-history-item active"
                    : "incog-history-item"
                }

                onClick={() => openChat(chat.id)}

              >

                <div className="incog-history-title">

                  {chat.title || "Untitled Chat"}

                </div>

                <div className="incog-history-date">

                  {chat.updatedAt
                    ? new Date(chat.updatedAt).toLocaleString()
                    : new Date(chat.createdAt).toLocaleString()}

                </div>

                <div className="incog-history-actions">

                  <button

                    onClick={(e) => {

                      e.stopPropagation();

                      const newTitle = prompt(
                        "Rename conversation",
                        chat.title
                      );

                      if (
                        newTitle &&
                        newTitle.trim()
                      ) {

                        renameChat(
                          chat.id,
                          newTitle.trim()
                        );

                      }

                    }}

                  >

                    Rename

                  </button>

                  <button

                    onClick={(e) => {

                      e.stopPropagation();

                      if (
                        window.confirm(
                          "Delete this conversation?"
                        )
                      ) {

                        deleteChat(chat.id);

                      }

                    }}

                  >

                    Delete

                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </aside>

      {/* ==========================
          MAIN AREA
      ========================== */}

      <div className="incog-main">

        <header className="incog-header">

          <button

            className="incog-menu"

            onClick={() =>
              setSidebarOpen(true)
            }

          >

            ☰

          </button>

          <div className="incog-header-title">

            INCOG AI

          </div>

          <button

            className="incog-clear"

            onClick={clearCurrentChat}

          >

            Clear

          </button>

        </header>

        <div
          className="incog-chat-history"
          ref={chatRef}
        >

          {messages.map(message => (

            <div
              key={message.id}
              className={
                message.role === "user"
                  ? "incog-user-message"
                  : "incog-ai-message"
              }
            >

              <div className="incog-message-content">

                <>
  {message.role === "assistant"
    ? renderMath(message.content)
    : (
        <p className="incog-chat-paragraph">
          {message.content}
        </p>
      )
  }

  

</>

              </div>

              <div className="incog-message-footer">

                <span className="incog-message-time">

                  {message.time}

                </span>

                {message.role === "assistant" && (

                  <button

                    className="incog-copy-btn"

                    onClick={() =>
                      copyMessage(message.content)
                    }

                  >

                    Copy

                  </button>

                )}

              </div>

            </div>

          ))}

          {typing && (

            <div className="incog-ai-message">

              <div className="incog-typing">

                <span></span>

                <span></span>

                <span></span>

              </div>

            </div>

          )} 

          </div>

{/* ==========================
    CHAT ACTIONS
========================== */}

<div className="incog-chat-actions">

  <button
    className="incog-action-btn"
    onClick={regenerateResponse}
    disabled={loading || messages.length === 0}
  >
    ↻ Regenerate
  </button>

  <button
    className="incog-action-btn"
    onClick={clearCurrentChat}
    disabled={messages.length === 0}
  >
    🗑 Clear Chat
  </button>

</div>

{/* ==========================
    HUMAN ASSISTANCE
========================== */}

{messages.length > 0 && (

<div className="incog-human-help">

  <h3>

    Need Human Assistance? https://incog-psd.vercel.app

  </h3>

  <p>

    Didn't get the answer you expected?

    Ask experienced members of

    <strong> INCOG PSD  </strong>

    for further explanation.

  </p>
  <a
  href="https://incog-psd.vercel.app"
  target="_blank"
  rel="noopener noreferrer"
  className="font-['JetBrains_Mono'] text-xs text-[#60a5fa] bg-[#0d121b] border border-[#1e2836] hover:border-[#3b82f6] px-4 py-2.5 rounded-[8px] transition flex items-center justify-center gap-2"
>
  Ask Community
</a>

  

  

</div>

)}

{/* ==========================
    CHAT INPUT
========================== */}

<div className="incog-chat-input">

  <textarea

    ref={inputRef}

    className="incog-input"

    value={input}

    onChange={(e) => setInput(e.target.value)}

    onKeyDown={handleKeyDown}

    placeholder="Ask Mathematics, Physics, Chemistry, Electronics..."

    rows={1}

    disabled={loading}

  />

  <button

    className="incog-send-btn"

    onClick={sendMessage}

    disabled={loading || !input.trim()}

  >

    {loading ? (

      <span className="incog-loading">

        Thinking...

      </span>

    ) : (

      "Send"

    )}

  </button>

</div>

{/* ==========================
    INPUT HINT
========================== */}

<div className="incog-input-hint">

  <span>

    Press <strong>Enter</strong> to send

  </span>

  <span>

    Press <strong>Shift + Enter</strong> for a new line

  </span>

</div>
    {/* ==========================
    CHAT FOOTER
========================== */}

<footer className="incog-footer">

  <div className="incog-footer-left">

    <span>

      INCOG AI Mathematics Engine

    </span>

  </div>

  <div className="incog-footer-right">

    <span>

      Responses may contain mistakes. Always verify important calculations.

    </span>

  </div>

</footer>

      </div>

    </div>

  );

}