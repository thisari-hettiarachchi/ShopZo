import { useEffect, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { getChatMessages, getChatThreads, sendChatMessage } from "../services/featureService";

export default function ChatPage() {
  const [threads, setThreads] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");

  const loadThreads = async () => {
    const res = await getChatThreads();
    const allThreads = res.data || [];
    setThreads(allThreads);
    if (!selectedUserId && allThreads[0]?.userId) {
      setSelectedUserId(allThreads[0].userId);
    }
  };

  const loadMessages = async (userId) => {
    if (!userId) return;
    const res = await getChatMessages(userId);
    setMessages(res.data || []);
  };

  useEffect(() => {
    loadThreads();
  }, []);

  useEffect(() => {
    loadMessages(selectedUserId);
  }, [selectedUserId]);

  const handleSend = async () => {
    if (!selectedUserId || !draft.trim()) return;
    const res = await sendChatMessage(selectedUserId, { message: draft });
    setMessages((prev) => [...prev, res.data]);
    setDraft("");
    await loadThreads();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-6 py-8 md:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">Communication</p>
          <h1 className="mt-2 text-3xl font-black">Vendor-Customer Chat</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Answer pre-purchase questions faster and recover abandoned checkouts.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)]">Conversations</h2>
            <div className="space-y-2">
              {threads.length === 0 && <p className="text-sm text-[var(--text-secondary)]">No conversations yet.</p>}
              {threads.map((thread) => (
                <button
                  key={thread.userId}
                  onClick={() => setSelectedUserId(thread.userId)}
                  className={`w-full rounded-xl border px-3 py-2 text-left ${selectedUserId === thread.userId ? "border-[var(--color-primary)] bg-[var(--bg-muted)]" : "border-[var(--border)] bg-[var(--bg-main)]"}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{thread.user?.name || "Customer"}</p>
                    {thread.unread > 0 && <span className="rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[10px] font-bold text-white">{thread.unread}</span>}
                  </div>
                  <p className="mt-1 truncate text-xs text-[var(--text-secondary)]">{thread.lastMessage}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
            {!selectedUserId ? (
              <div className="flex h-[420px] items-center justify-center text-[var(--text-secondary)]">
                <MessageCircle className="mr-2" size={20} /> Select a conversation
              </div>
            ) : (
              <>
                <div className="h-[420px] overflow-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-main)] p-3">
                  <div className="space-y-2">
                    {messages.map((message) => {
                      const mine = Boolean(message.fromVendor);
                      return (
                        <div key={message._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[72%] rounded-2xl px-3 py-2 text-sm ${mine ? "bg-[var(--color-primary)] text-white" : "bg-[var(--bg-muted)] text-[var(--text-primary)]"}`}>
                            {message.message}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2 text-sm"
                  />
                  <button onClick={handleSend} className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2 text-sm font-semibold text-white">
                    <Send size={14} /> Send
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
