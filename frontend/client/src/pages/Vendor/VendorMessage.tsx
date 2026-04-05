import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
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
import { API_BASE_URL, authHeaders } from "../../api/base";

type MessageStatus = "sent" | "delivered" | "read";
type MessageFrom = "me" | "them";

type VendorThread = {
  vendorId: string;
  lastMessage: string;
  lastAt?: string;
  unread?: number;
  vendor?: {
    _id?: string;
    storeName?: string;
    isApproved?: boolean;
  };
  product?: {
    _id?: string;
    name?: string;
    images?: string[];
  };
};

type BackendMessage = {
  _id: string;
  fromUser?: { _id?: string; name?: string };
  toUser?: { _id?: string; name?: string };
  toVendor?: { _id?: string; storeName?: string };
  fromVendor?: { _id?: string; storeName?: string };
  product?: { _id?: string; name?: string; images?: string[] };
  message: string;
  isReadByUser?: boolean;
  createdAt?: string;
};

type ChatMessage = {
  id: string;
  from: MessageFrom;
  text: string;
  time: string;
  status: MessageStatus;
  product?: { _id?: string; name?: string };
};

const quickReplies = ["Got it!", "Can you confirm delivery date?", "Please share updates.", "Thank you!"];
const emojis = ["😊", "🙏", "🚀", "❤️", "✅", "😍", "🎉", "👍", "🔥", "💯", "📦", "⭐"];

const statusIcon = (status: MessageStatus) => {
  if (status === "read") {
    return <BsCheck2All className="text-[13px] text-cyan-400" />;
  }

  if (status === "delivered") {
    return <BsCheck2All className="text-[13px] text-[var(--text-muted)]" />;
  }

  return <FiCheck className="text-[13px] text-[var(--text-muted)]" />;
};

const toTime = (dateValue?: string) => {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const toChatMessage = (item: BackendMessage): ChatMessage => {
  const from = item.fromUser ? "me" : "them";

  return {
    id: item._id,
    from,
    text: item.message,
    time: toTime(item.createdAt),
    status: from === "me" ? "delivered" : item.isReadByUser ? "read" : "delivered",
    product: item.product,
  };
};

const buildAuthHeaders = (): Record<string, string> => {
  const headers = authHeaders() as { Authorization?: string };
  return headers.Authorization ? { Authorization: headers.Authorization } : {};
};

export default function VendorMessage() {
  const { id: routeVendorId } = useParams();

  const [threads, setThreads] = useState<VendorThread[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<string>(routeVendorId || "");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const selectedThread = useMemo(
    () => threads.find((thread) => String(thread.vendorId) === String(selectedVendorId)),
    [threads, selectedVendorId]
  );

  const filteredThreads = useMemo(() => {
    const key = search.trim().toLowerCase();
    if (!key) return threads;

    return threads.filter((thread) => {
      const name = thread.vendor?.storeName || "Vendor";
      return name.toLowerCase().includes(key) || (thread.lastMessage || "").toLowerCase().includes(key);
    });
  }, [threads, search]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const loadThreads = async () => {
      setLoadingThreads(true);
      try {
        const response = await fetch(`${API_BASE_URL}/chat/threads`, {
          headers: buildAuthHeaders(),
        });

        if (!response.ok) {
          setThreads([]);
          setLoadingThreads(false);
          return;
        }

        const data = await response.json();
        const list: VendorThread[] = Array.isArray(data) ? data : [];
        setThreads(list);

        if (routeVendorId) {
          const hasRouteVendor = list.some((thread) => String(thread.vendorId) === String(routeVendorId));
          if (hasRouteVendor) {
            setSelectedVendorId(String(routeVendorId));
          } else {
            const vendorResponse = await fetch(`${API_BASE_URL}/vendors`, { headers: buildAuthHeaders() });
            const vendorData = vendorResponse.ok ? await vendorResponse.json() : [];
            const fallbackVendor = (Array.isArray(vendorData) ? vendorData : []).find(
              (vendor) => String(vendor?._id || vendor?.id) === String(routeVendorId)
            );

            if (fallbackVendor) {
              const fallbackThread: VendorThread = {
                vendorId: String(fallbackVendor._id || fallbackVendor.id),
                vendor: {
                  _id: String(fallbackVendor._id || fallbackVendor.id),
                  storeName: fallbackVendor.storeName || fallbackVendor.name || "Vendor",
                  isApproved: Boolean(fallbackVendor.isApproved),
                },
                lastMessage: "",
                unread: 0,
              };
              setThreads((prev) => [fallbackThread, ...prev]);
              setSelectedVendorId(String(routeVendorId));
            }
          }
        } else if (!selectedVendorId && list[0]?.vendorId) {
          setSelectedVendorId(String(list[0].vendorId));
        }
      } catch {
        setThreads([]);
      } finally {
        setLoadingThreads(false);
      }
    };

    loadThreads();
  }, [routeVendorId]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedVendorId) {
        setMessages([]);
        return;
      }

      setLoadingMessages(true);
      try {
        const response = await fetch(`${API_BASE_URL}/chat/messages?vendorId=${selectedVendorId}`, {
          headers: buildAuthHeaders(),
        });

        if (!response.ok) {
          setMessages([]);
          setLoadingMessages(false);
          return;
        }

        const data = await response.json();
        const list: ChatMessage[] = (Array.isArray(data) ? data : []).map(toChatMessage);
        setMessages(list);
      } catch {
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [selectedVendorId]);

  const sendMessage = async () => {
    if (!selectedVendorId || !input.trim()) return;

    const payload: Record<string, string> = {
      vendorId: selectedVendorId,
      message: input.trim(),
    };

    if (selectedThread?.product?._id) {
      payload.productId = selectedThread.product._id;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/chat/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...buildAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) return;
      const created: BackendMessage = await response.json();

      setMessages((prev) => [...prev, toChatMessage(created)]);
      setInput("");
      setShowEmojiPicker(false);

      // Refresh threads so last message/order stays in sync.
      const threadsResponse = await fetch(`${API_BASE_URL}/chat/threads`, {
        headers: buildAuthHeaders(),
      });
      const threadData = threadsResponse.ok ? await threadsResponse.json() : [];
      setThreads(Array.isArray(threadData) ? threadData : []);
    } catch {
      // Ignore network errors for now.
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full bg-[var(--bg-main)] text-[var(--text-primary)]">
      <style>{`
        @keyframes msgIn { from { opacity: 0; transform: translateY(8px) scale(0.98);} to { opacity: 1; transform: translateY(0) scale(1);} }
      `}</style>

      <div className="mx-auto flex h-[calc(100vh-64px)] max-w-[1280px] overflow-hidden border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow)] backdrop-blur-xl">
        <aside
          className={`absolute inset-y-0 left-0 z-30 w-[320px] border-r border-[var(--border)] bg-[var(--bg-card)] transition-transform duration-300 md:static md:translate-x-0 ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-[var(--border)] px-4 py-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-['Sora',sans-serif] text-lg font-semibold tracking-tight">Messages</h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-2 text-[var(--text-muted)] md:hidden"
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
                const isActive = String(thread.vendorId) === String(selectedVendorId);
                const vendorName = thread.vendor?.storeName || "Vendor";
                const avatarSeed = encodeURIComponent(vendorName || "V");

                return (
                  <button
                    key={String(thread.vendorId)}
                    onClick={() => {
                      setSelectedVendorId(String(thread.vendorId));
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
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}&backgroundColor=f97316&textColor=ffffff`}
                        alt={vendorName}
                        className="h-11 w-11 rounded-xl border border-[var(--border)] object-cover"
                      />
                      {thread.vendor?.isApproved && (
                        <span className="absolute -bottom-1 -right-1 rounded-full border-2 border-[var(--bg-card)] bg-white p-[2px] text-[10px] text-[var(--color-primary)]">
                          <BsFillPatchCheckFill />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold">{vendorName}</span>
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
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-2 text-[var(--text-secondary)] md:hidden"
              aria-label="Open sidebar"
            >
              <FiMenu />
            </button>

            <div className="relative shrink-0">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedThread?.vendor?.storeName || "V")}&backgroundColor=f97316&textColor=ffffff`}
                alt={selectedThread?.vendor?.storeName || "Vendor"}
                className="h-11 w-11 rounded-xl border border-[var(--border)]"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="truncate font-['Sora',sans-serif] text-[15px] font-semibold">
                  {selectedThread?.vendor?.storeName || "Vendor"}
                </h3>
                {selectedThread?.vendor?.isApproved && <BsFillPatchCheckFill className="text-sm text-[var(--color-primary)]" />}
              </div>
              <p className="text-xs font-medium text-[var(--text-muted)]">
                {selectedThread?.product?.name ? `Context: ${selectedThread.product.name}` : "Conversation"}
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
            {!selectedVendorId && (
              <div className="grid h-full place-items-center text-sm text-[var(--text-muted)]">Select a conversation</div>
            )}

            {selectedVendorId && loadingMessages && (
              <div className="grid h-full place-items-center text-sm text-[var(--text-muted)]">Loading messages...</div>
            )}

            {selectedVendorId && !loadingMessages && (
              <>
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-px flex-1 bg-[var(--border)]" />
                  <span className="rounded-full bg-[var(--bg-muted)] px-3 py-1 text-[11px] font-semibold text-[var(--text-muted)]">
                    Conversation
                  </span>
                  <span className="h-px flex-1 bg-[var(--border)]" />
                </div>

                <div className="flex flex-col gap-2">
                  {messages.map((message, index) => {
                    const isMine = message.from === "me";
                    const showAvatar = !isMine && (index === 0 || messages[index - 1]?.from !== "them");

                    return (
                      <div
                        key={message.id}
                        className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}
                        style={{ animation: `msgIn .24s ease-out ${index * 0.02}s both` }}
                      >
                        {!isMine && (
                          <div className="w-8 shrink-0">
                            {showAvatar && (
                              <img
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedThread?.vendor?.storeName || "V")}&backgroundColor=f97316&textColor=ffffff`}
                                alt="avatar"
                                className="h-8 w-8 rounded-lg border border-[var(--border)]"
                              />
                            )}
                          </div>
                        )}

                        <div className={`max-w-[75%] ${isMine ? "items-end" : "items-start"} flex flex-col`}>
                          {message.product?.name && (
                            <span className="mb-1 inline-flex rounded-full border border-[var(--border)] bg-[var(--bg-main)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-secondary)]">
                              {message.product.name}
                            </span>
                          )}

                          <div
                            className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                              isMine
                                ? "rounded-br-md bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] text-white"
                                : "rounded-bl-md border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                            }`}
                          >
                            {message.text}
                          </div>

                          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                            <span>{message.time}</span>
                            {isMine && statusIcon(message.status)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>
              </>
            )}
          </section>

          <div className="border-t border-[var(--border)] px-4 py-2 md:px-6">
            <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => setInput(reply)}
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
                      setInput((value) => value + emoji);
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
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type a message..."
              rows={1}
              className="max-h-24 flex-1 resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
            />

            <button
              onClick={sendMessage}
              disabled={!selectedVendorId || !input.trim()}
              className={`rounded-xl p-2.5 text-white transition ${
                selectedVendorId && input.trim()
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
          className="absolute inset-0 z-20 bg-black/20 md:hidden"
          aria-label="Close sidebar overlay"
        />
      )}
    </div>
  );
}
