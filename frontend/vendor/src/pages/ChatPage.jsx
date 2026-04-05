import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiCheck,
  FiMenu,
  FiMoreHorizontal,
  FiPaperclip,
  FiPhone,
  FiSearch,
  FiSend,
  FiSmile,
  FiVideo,
  FiX,
} from "react-icons/fi";
import { BsCheck2All, BsFillPatchCheckFill } from "react-icons/bs";
import { getChatMessages, getChatThreads, sendChatMessage } from "../services/featureService";

const quickReplies = ["Thanks for reaching out", "Please confirm your order ID", "Shipping update coming soon", "Happy to help"];
const emojis = ["😊", "🙏", "🚀", "❤️", "✅", "😍", "🎉", "👍", "🔥", "💯", "📦", "⭐"];

const toTime = (dateValue) => {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const statusIcon = (isRead) => {
  if (isRead) {
    return <BsCheck2All className="text-[13px] text-cyan-400" />;
  }
  return <FiCheck className="text-[13px] text-[var(--text-muted)]" />;
};

export default function ChatPage() {
  const [threads, setThreads] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  const selectedThread = useMemo(
    () => threads.find((thread) => String(thread.userId) === String(selectedUserId)),
    [threads, selectedUserId]
  );

  const filteredThreads = useMemo(() => {
    const key = search.trim().toLowerCase();
    if (!key) return threads;

    return threads.filter((thread) => {
      const userName = thread.user?.name || "Customer";
      return userName.toLowerCase().includes(key) || (thread.lastMessage || "").toLowerCase().includes(key);
    });
  }, [threads, search]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadThreads = async () => {
    setLoadingThreads(true);
    try {
      const res = await getChatThreads();
      const list = Array.isArray(res.data) ? res.data : [];
      setThreads(list);
      if (!selectedUserId && list[0]?.userId) {
        setSelectedUserId(String(list[0].userId));
      }
    } catch {
      setThreads([]);
    } finally {
      setLoadingThreads(false);
    }
  };

  const loadMessages = async (userId) => {
    if (!userId) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    try {
      const res = await getChatMessages(userId);
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch {
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  useEffect(() => {
    loadMessages(selectedUserId);
  }, [selectedUserId]);

  const handleSend = async () => {
    if (!selectedUserId || !draft.trim()) return;

    const payload = { message: draft.trim() };
    if (selectedThread?.product?._id) {
      payload.productId = selectedThread.product._id;
    }

    try {
      const res = await sendChatMessage(selectedUserId, payload);
      setMessages((prev) => [...prev, res.data]);
      setDraft("");
      setShowEmojiPicker(false);
      await loadThreads();
    } catch {
      // Ignore failure for now.
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[var(--bg-main)] px-4 py-6 text-[var(--text-primary)] md:px-8">
      <style>{`
        @keyframes msgIn { from { opacity: 0; transform: translateY(8px) scale(0.98);} to { opacity: 1; transform: translateY(0) scale(1);} }
      `}</style>

      <div className="mx-auto flex h-[calc(100vh-120px)] max-w-[1280px] overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow)] backdrop-blur-xl">
        <aside
          className={`absolute inset-y-0 left-0 z-30 w-[320px] border-r border-[var(--border)] bg-[var(--bg-card)] transition-transform duration-300 lg:static lg:translate-x-0 ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-[var(--border)] px-4 py-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-['Sora',sans-serif] text-lg font-semibold tracking-tight">Customer Chats</h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-2 text-[var(--text-muted)] lg:hidden"
                  aria-label="Close sidebar"
                >
                  <FiX />
                </button>
              </div>

              <label className="relative block">
                <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search conversations"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] py-2 pl-10 pr-3 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
                />
              </label>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingThreads && <p className="px-4 py-3 text-sm text-[var(--text-muted)]">Loading conversations...</p>}
              {!loadingThreads && filteredThreads.length === 0 && (
                <p className="px-4 py-3 text-sm text-[var(--text-muted)]">No conversations yet.</p>
              )}

              {filteredThreads.map((thread) => {
                const isActive = String(thread.userId) === String(selectedUserId);
                const userName = thread.user?.name || "Customer";
                const avatarSeed = encodeURIComponent(userName || "C");

                return (
                  <button
                    key={String(thread.userId)}
                    onClick={() => {
                      setSelectedUserId(String(thread.userId));
                      setShowSidebar(false);
                    }}
                    className={`flex w-full items-start gap-3 border-l-2 px-4 py-3 text-left transition ${
                      isActive
                        ? "border-l-[var(--color-primary)] bg-[var(--bg-hover)]"
                        : "border-l-transparent hover:bg-[var(--bg-hover)]"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}&backgroundColor=22d3ee&textColor=ffffff`}
                        alt={userName}
                        className="h-11 w-11 rounded-xl border border-[var(--border)] object-cover"
                      />
                      <span className="absolute -bottom-1 -right-1 rounded-full border-2 border-[var(--bg-card)] bg-white p-[2px] text-[10px] text-[var(--color-primary)]">
                        <BsFillPatchCheckFill />
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold">{userName}</span>
                        <span className="text-[11px] text-[var(--text-muted)]">{toTime(thread.lastAt)}</span>
                      </div>

                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <span className="truncate text-xs text-[var(--text-muted)]">{thread.lastMessage || "No messages yet"}</span>
                        {(thread.unread || 0) > 0 && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] text-[10px] font-bold text-white">
                            {thread.unread}
                          </span>
                        )}
                      </div>

                      {thread.product?.name && (
                        <span className="mt-1 inline-flex rounded-full border border-[var(--border)] bg-[var(--bg-main)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-secondary)]">
                          {thread.product.name}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <main className="relative flex min-w-0 flex-1 flex-col">
          <header className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--bg-card)] px-4 py-3">
            <button
              onClick={() => setShowSidebar((value) => !value)}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-2 text-[var(--text-secondary)] lg:hidden"
              aria-label="Open sidebar"
            >
              <FiMenu />
            </button>

            <div className="relative shrink-0">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedThread?.user?.name || "C")}&backgroundColor=22d3ee&textColor=ffffff`}
                alt={selectedThread?.user?.name || "Customer"}
                className="h-11 w-11 rounded-xl border border-[var(--border)]"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate font-['Sora',sans-serif] text-[15px] font-semibold">{selectedThread?.user?.name || "Customer"}</h3>
              <p className="text-xs font-medium text-[var(--text-muted)]">
                {selectedThread?.product?.name ? `Product: ${selectedThread.product.name}` : "Conversation"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-2 text-[var(--text-secondary)] hover:text-[var(--color-primary)]">
                <FiPhone />
              </button>
              <button className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-2 text-[var(--text-secondary)] hover:text-[var(--color-primary)]">
                <FiVideo />
              </button>
              <button className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-2 text-[var(--text-secondary)] hover:text-[var(--color-primary)]">
                <FiMoreHorizontal />
              </button>
            </div>
          </header>

          <section className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
            {!selectedUserId && (
              <div className="grid h-full place-items-center text-sm text-[var(--text-muted)]">Select a conversation</div>
            )}

            {selectedUserId && loadingMessages && (
              <div className="grid h-full place-items-center text-sm text-[var(--text-muted)]">Loading messages...</div>
            )}

            {selectedUserId && !loadingMessages && (
              <div className="flex flex-col gap-2">
                {messages.map((message, index) => {
                  const mine = Boolean(message.fromVendor);
                  const showAvatar = !mine && (index === 0 || messages[index - 1]?.fromVendor);

                  return (
                    <div
                      key={message._id}
                      className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}
                      style={{ animation: `msgIn .24s ease-out ${index * 0.02}s both` }}
                    >
                      {!mine && (
                        <div className="w-8 shrink-0">
                          {showAvatar && (
                            <img
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedThread?.user?.name || "C")}&backgroundColor=22d3ee&textColor=ffffff`}
                              alt="avatar"
                              className="h-8 w-8 rounded-lg border border-[var(--border)]"
                            />
                          )}
                        </div>
                      )}

                      <div className={`max-w-[75%] ${mine ? "items-end" : "items-start"} flex flex-col`}>
                        {message.product?.name && (
                          <span className="mb-1 inline-flex rounded-full border border-[var(--border)] bg-[var(--bg-main)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-secondary)]">
                            {message.product.name}
                          </span>
                        )}

                        <div
                          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            mine
                              ? "rounded-br-md bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] text-white"
                              : "rounded-bl-md border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                          }`}
                        >
                          {message.message}
                        </div>

                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                          <span>{toTime(message.createdAt)}</span>
                          {mine && statusIcon(Boolean(message.isReadByUser))}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            )}
          </section>

          <div className="border-t border-[var(--border)] px-4 py-2 md:px-6">
            <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => setDraft(reply)}
                  className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {showEmojiPicker && (
            <div className="absolute bottom-[86px] left-4 z-20 w-[230px] rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3 shadow-[var(--shadow)] backdrop-blur-xl md:left-6">
              <div className="grid grid-cols-6 gap-2">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setDraft((value) => value + emoji);
                      setShowEmojiPicker(false);
                      inputRef.current?.focus();
                    }}
                    className="rounded-lg p-1 text-xl transition hover:scale-110 hover:bg-[var(--bg-hover)]"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          <footer className="flex items-end gap-2 border-t border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 md:px-6">
            <button className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-2.5 text-[var(--text-muted)] hover:text-[var(--color-primary)]">
              <FiPaperclip />
            </button>

            <button
              onClick={() => setShowEmojiPicker((value) => !value)}
              className={`rounded-xl border p-2.5 ${
                showEmojiPicker
                  ? "border-[var(--color-primary)] bg-[var(--bg-hover)] text-[var(--color-primary)]"
                  : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--color-primary)]"
              }`}
            >
              <FiSmile />
            </button>

            <textarea
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your reply..."
              rows={1}
              className="max-h-24 flex-1 resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
            />

            <button
              onClick={handleSend}
              disabled={!selectedUserId || !draft.trim()}
              className={`rounded-xl p-2.5 text-white transition ${
                selectedUserId && draft.trim()
                  ? "bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] shadow-[0_10px_24px_rgba(249,115,22,0.35)]"
                  : "cursor-not-allowed bg-[var(--bg-muted)] text-[var(--text-muted)]"
              }`}
            >
              <FiSend />
            </button>
          </footer>
        </main>
      </div>

      {showSidebar && (
        <button
          onClick={() => setShowSidebar(false)}
          className="absolute inset-0 z-20 bg-black/20 lg:hidden"
          aria-label="Close sidebar overlay"
        />
      )}
    </div>
  );
}
