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
  const [messages, setMessages] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const chatRef = useRef(null);
  const inputRef = useRef(null);

  /* =========================================
     AUTO SCROLL
  ========================================= */

  useEffect(() => {
    if (!chatRef.current) return;

    requestAnimationFrame(() => {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth"
      });
    });
  }, [messages, typing]);

  /* =========================================
     LOAD SAVED CHATS
  ========================================= */

  useEffect(() => {
    const saved = localStorage.getItem("incog_ai_chats");

    if (!saved) return;

    try {
      const chats = JSON.parse(saved);

      setChatHistory(chats);

      if (chats.length > 0) {
        setCurrentChatId(chats[0].id);
        setMessages(chats[0].messages || []);
      }
    } catch (error) {
      console.error("Failed to load chats:", error);
    }
  }, []);

  /* =========================================
     SAVE CHATS
  ========================================= */

  useEffect(() => {
    localStorage.setItem(
      "incog_ai_chats",
      JSON.stringify(chatHistory)
    );
  }, [chatHistory]);

  /* =========================================
     BUILD AI HISTORY
  ========================================= */

  const history = useMemo(() => {
    return messages.map((message) =>
      message.role === "user"
        ? {
            user: message.content
          }
        : {
            assistant: message.content
          }
    );
  }, [messages]);

  /* =========================================
     CREATE NEW CHAT
  ========================================= */

  function createNewChat() {
    const newChat = {
      id: crypto.randomUUID(),
      title: "New Chat",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: []
    };

    setChatHistory((prev) => [
      newChat,
      ...prev
    ]);

    setCurrentChatId(newChat.id);
    setMessages([]);
  }

  /* =========================================
     OPEN CHAT
  ========================================= */

  function openChat(chatId) {
    const chat = chatHistory.find(
      (item) => item.id === chatId
    );

    if (!chat) return;

    setCurrentChatId(chat.id);
    setMessages(chat.messages || []);
    setSidebarOpen(false);
  }

  /* =========================================
     DELETE CHAT
  ========================================= */

  function deleteChat(chatId) {
    const updated = chatHistory.filter(
      (chat) => chat.id !== chatId
    );

    setChatHistory(updated);

    if (chatId === currentChatId) {
      if (updated.length > 0) {
        setCurrentChatId(updated[0].id);
        setMessages(updated[0].messages || []);
      } else {
        setCurrentChatId(null);
        setMessages([]);
      }
    }
  }

  /* =========================================
     RENAME CHAT
  ========================================= */

  function renameChat(chatId, title) {
    const updated = chatHistory.map((chat) =>
      chat.id === chatId
        ? {
            ...chat,
            title
          }
        : chat
    );

    setChatHistory(updated);
  }

  /* =========================================
     UPDATE CURRENT CHAT
  ========================================= */

  function updateCurrentConversation(updatedMessages) {
    setMessages(updatedMessages);

    if (!currentChatId) return;

    setChatHistory((previous) =>
      previous.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: updatedMessages,
              updatedAt: Date.now()
            }
          : chat
      )
    );
  }

  /* =========================================
     SEARCH
  ========================================= */

  const filteredChats = chatHistory.filter(
    (chat) =>
      (chat.title || "Untitled Chat")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  /* =========================================
     SEND MESSAGE
  ========================================= */

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
      /*
       * IMPORTANT:
       *
       * `question` contains everything from the chat input.
       *
       * If the question came from MathEditor,
       * it can contain LaTeX such as:
       *
       * \\frac{2x+5}{3}
       *
       * The AI therefore receives the mathematical
       * structure instead of only what visually appears.
       */

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
      console.error("Chat error:", error);

      updateCurrentConversation([
        ...newMessages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Something went wrong. Please try again.",
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

  /* =========================================
     ENTER / SHIFT ENTER
  ========================================= */

  function handleKeyDown(e) {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      sendMessage();
    }
  }

  /* =========================================
     CLEAR CHAT
  ========================================= */

  function clearCurrentChat() {
    updateCurrentConversation([]);
  }

  /* =========================================
     INLINE MATH RENDERER
  ========================================= */

  function renderInlineSegments(
    line,
    keyPrefix
  ) {
    const parts = [];

    /*
     * Supports:
     *
     * \\(x^2\\)
     *
     * \\(\\frac{a}{b}\\)
     */

    const regex =
      /\\\(\s*([\s\S]*?)\s*\\\)/g;

    let lastIndex = 0;
    let match;
    let index = 0;

    while (
      (match = regex.exec(line)) !== null
    ) {
      /*
       * Normal text before mathematics
       */

      if (match.index > lastIndex) {
        parts.push(
          <span
            key={`${keyPrefix}-text-${index}`}
          >
            {line.slice(
              lastIndex,
              match.index
            )}
          </span>
        );
      }

      /*
       * MathLive mathematics
       */

      parts.push(
        <span
          key={`${keyPrefix}-math-${index}`}
          className="incog-inline-math"
          dangerouslySetInnerHTML={{
            __html:
              convertLatexToMarkup(
                match[1].trim()
              )
          }}
        />
      );

      lastIndex =
        regex.lastIndex;

      index++;
    }

    /*
     * Remaining normal text
     */

    if (lastIndex < line.length) {
      parts.push(
        <span
          key={`${keyPrefix}-text-end`}
        >
          {line.slice(lastIndex)}
        </span>
      );
    }

    return parts.length > 0
      ? parts
      : line;
  }

  /* =========================================
     FULL MATH RESPONSE RENDERER
  ========================================= */

  function renderMath(text = "") {
    if (!text) return null;

    /*
     * Display mathematics:
     *
     * $$ ... $$
     *
     * \\[ ... \\]
     */

    const blockRegex =
      /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]/g;

    const segments = [];

    let lastIndex = 0;
    let match;
    let blockIndex = 0;

    while (
      (match =
        blockRegex.exec(text)) !== null
    ) {
      /*
       * Normal text before block math
       */

      if (match.index > lastIndex) {
        segments.push({
          type: "text",
          content:
            text.slice(
              lastIndex,
              match.index
            )
        });
      }

      const latex =
        match[1] ?? match[2];

      segments.push({
        type: "block-math",
        content: latex,
        key:
          `block-${blockIndex++}`
      });

      lastIndex =
        blockRegex.lastIndex;
    }

    /*
     * Remaining text
     */

    if (lastIndex < text.length) {
      segments.push({
        type: "text",
        content:
          text.slice(lastIndex)
      });
    }

    /*
     * Render segments
     */

    return segments.map(
      (segment, segmentIndex) => {
        /*
         * DISPLAY MATH
         */

        if (
          segment.type ===
          "block-math"
        ) {
          return (
            <div
              key={segment.key}
              className="incog-display-math"
              dangerouslySetInnerHTML={{
                __html:
                  convertLatexToMarkup(
                    segment.content.trim(),
                    {
                      displayMode: true
                    }
                  )
              }}
            />
          );
        }

        /*
         * NORMAL TEXT
         */

        const sections =
          segment.content
            .split(/\n\s*\n/)
            .filter(
              (section) =>
                section.trim()
            );

        return sections.map(
          (section, sectionIndex) => {
            const lines =
              section.split("\n");

            const elements = [];

            lines.forEach(
              (line, lineIndex) => {
                /*
                 * IMPORTANT:
                 *
                 * Do NOT trim the actual
                 * displayed content.
                 *
                 * This preserves normal
                 * word spacing.
                 */

                const trimmed =
                  line.trim();

                const lineKey =
                  `s${segmentIndex}-${sectionIndex}-${lineIndex}`;

                if (!trimmed) {
                  elements.push(
                    <div
                      key={`space-${lineKey}`}
                      className="incog-chat-line-space"
                    />
                  );

                  return;
                }

                /*
                 * MATH: prefix
                 */

                if (
                  trimmed.startsWith(
                    "MATH:"
                  )
                ) {
                  const latex =
                    trimmed
                      .replace(
                        /^MATH:/,
                        ""
                      )
                      .trim();

                  elements.push(
                    <div
                      key={`math-${lineKey}`}
                      className="incog-display-math"
                      dangerouslySetInnerHTML={{
                        __html:
                          convertLatexToMarkup(
                            latex,
                            {
                              displayMode:
                                true
                            }
                          )
                      }}
                    />
                  );

                  return;
                }

                /*
                 * HEADINGS
                 */

                if (
                  /^#{1,4}\s+/.test(
                    trimmed
                  ) ||
                  /^Step\s+\d+/i.test(
                    trimmed
                  ) ||
                  /^Explanation$/i.test(
                    trimmed
                  ) ||
                  /^Final Answer$/i.test(
                    trimmed
                  )
                ) {
                  const headingText =
                    trimmed.replace(
                      /^#{1,4}\s+/,
                      ""
                    );

                  elements.push(
                    <h3
                      key={`heading-${lineKey}`}
                      className="incog-section-title"
                    >
                      {renderInlineSegments(
                        headingText,
                        `heading-${lineKey}`
                      )}
                    </h3>
                  );

                  return;
                }

                /*
                 * DIVIDER
                 */

                if (
                  /^(-{3,}|\*{3,})$/.test(
                    trimmed
                  )
                ) {
                  elements.push(
                    <hr
                      key={`divider-${lineKey}`}
                      className="incog-chat-divider"
                    />
                  );

                  return;
                }

                /*
                 * BULLET
                 */

                if (
                  trimmed.startsWith("•") ||
                  trimmed.startsWith("- ")
                ) {
                  elements.push(
                    <div
                      key={`bullet-${lineKey}`}
                      className="incog-chat-bullet"
                    >
                      <span className="incog-bullet-marker">
                        •
                      </span>

                      <span>
                        {renderInlineSegments(
                          trimmed.replace(
                            /^[•-]\s*/,
                            ""
                          ),
                          `bullet-${lineKey}`
                        )}
                      </span>
                    </div>
                  );

                  return;
                }

                /*
                 * NORMAL PARAGRAPH
                 */

                elements.push(
                  <p
                    key={`paragraph-${lineKey}`}
                    className="incog-chat-paragraph"
                  >
                    {renderInlineSegments(
                      trimmed,
                      `paragraph-${lineKey}`
                    )}
                  </p>
                );
              }
            );

            return (
              <div
                key={`${segmentIndex}-${sectionIndex}`}
                className="incog-chat-section"
              >
                {elements}
              </div>
            );
          }
        );
      }
    );
  }

  /* =========================================
     COPY MESSAGE
  ========================================= */

  async function copyMessage(text) {
    try {
      await navigator.clipboard.writeText(
        text
      );
    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );
    }
  }

  /* =========================================
     AUTO RESIZE INPUT
  ========================================= */

  useEffect(() => {
    if (!inputRef.current) return;

    inputRef.current.style.height =
      "0px";

    inputRef.current.style.height =
      `${inputRef.current.scrollHeight}px`;
  }, [input]);

  /* =========================================
     INPUT FOCUS
  ========================================= */

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* =========================================
     WELCOME MESSAGE
  ========================================= */

  useEffect(() => {
    if (messages.length > 0) return;

    const welcome = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: `Hello, I'm INCOG AI.

I can help you solve:

• Mathematics
• Physics
• Chemistry
• Electronics
• Engineering

Type your question below to begin.`,
      time: new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      )
    };

    setMessages([welcome]);
  }, []);

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="incog-chat">

      {/* =====================================
          SIDEBAR
      ===================================== */}

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
            onClick={() =>
              setSidebarOpen(false)
            }
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
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={
                  chat.id === currentChatId
                    ? "incog-history-item active"
                    : "incog-history-item"
                }
                onClick={() =>
                  openChat(chat.id)
                }
              >

                <div className="incog-history-title">
                  {chat.title ||
                    "Untitled Chat"}
                </div>

                <div className="incog-history-date">
                  {chat.updatedAt
                    ? new Date(
                        chat.updatedAt
                      ).toLocaleString()
                    : new Date(
                        chat.createdAt
                      ).toLocaleString()}
                </div>

                <div className="incog-history-actions">

                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      const newTitle =
                        prompt(
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
                        deleteChat(
                          chat.id
                        );
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

      {/* =====================================
          MAIN
      ===================================== */}

      <div className="incog-main">

        {/* HEADER */}

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

        {/* ===================================
            CHAT MESSAGES
        =================================== */}

        <div
          className="incog-chat-history"
          ref={chatRef}
        >

          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "user"
                  ? "incog-user-message"
                  : "incog-ai-message"
              }
            >

              <div className="incog-message-content">

                {message.role === "assistant" ? (
                  renderMath(
                    message.content
                  )
                ) : (
                  <p className="incog-chat-paragraph">
                    {message.content}
                  </p>
                )}

              </div>

              <div className="incog-message-footer">

                <span className="incog-message-time">
                  {message.time}
                </span>

                {message.role ===
                  "assistant" && (
                  <button
                    className="incog-copy-btn"
                    onClick={() =>
                      copyMessage(
                        message.content
                      )
                    }
                  >
                    Copy
                  </button>
                )}

              </div>

            </div>
          ))}

          {/* TYPING INDICATOR */}

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

        {/* ===================================
            HUMAN ASSISTANCE
        =================================== */}

        <div className="incog-human-help">

          <h3>
            Need Human Assistance?
          </h3>

          <a
            href="https://incog-psd.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="incog-help-button"
          >
            Take a Screenshot & Broadcast
            to INCOG PSD

            <span>→</span>
          </a>

        </div>

        {/* ===================================
            DISCLAIMER — KEPT
        =================================== */}

        <div className="incog-disclaimer">
          INCOG can make mistakes. Verify
          important calculations.
        </div>

        {/* ===================================
            INPUT
        =================================== */}

        <div className="incog-chat-input">

          <textarea
            ref={inputRef}
            className="incog-input"
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Ask Mathematics, Physics, Chemistry, Electronics..."
            rows={1}
            disabled={loading}
          />

          <button
            className="incog-send-btn"
            onClick={sendMessage}
            disabled={
              loading ||
              !input.trim()
            }
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

        {/* INPUT HINT */}

        <div className="incog-input-hint">

          <span>
            Press{" "}
            <strong>Enter</strong>{" "}
            to send
          </span>

          <span>
            Press{" "}
            <strong>
              Shift + Enter
            </strong>{" "}
            for a new line
          </span>

        </div>

      </div>
    </div>
  );
}