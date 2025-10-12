import React, { useState, useEffect, useRef, useContext } from "react";
import { Send } from "lucide-react";
import { ROUTES } from "../../const/route";
import styles from "./ChatWidget.module.scss";
import { ChatBotContext } from "./ChatBotContext";

export default function ChatWidget() {
  const { history, sendMessage, loading, setHistory } = useContext(ChatBotContext);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  // Thêm tin nhắn chào mừng khi mở chat lần đầu
  useEffect(() => {
    if (open && history.length === 0) {
      setHistory(prev => [
        ...prev,
        { role: "assistant", content: "Chào bạn! Tôi là AI của VOLtech, tôi có thể giúp gì cho bạn?" }
      ]);
    }
  }, [open, history.length, setHistory]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setMessage(""); // xóa input ngay

    // Hiển thị ngay tin nhắn user
    setHistory(prev => [
      ...prev,
      { role: "user", content: userMessage, activityId: null }
    ]);

    // Gọi bot
    try {
      await sendMessage(userMessage);
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  return (
    <div className={styles.chatWidget}>
      {open ? (
        <div className={`${styles.chatBox} fade-in`}>
          <div className={styles.header}>
            <span>🤖 ChatBot</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          <div className={styles.messages}>
            {history.map((msg, i) => {
              if (msg.activityId) {
                return (
                  <a
                    href={ROUTES.ACTIVE.withId(msg.activityId)}
                    key={i}
                    className={msg.role === "user" ? styles.userMessage : styles.botMessage}
                  >
                    {msg.content}
                  </a>
                );
              }
              return (
                <div
                  key={i}
                  className={msg.role === "user" ? styles.userMessage : styles.botMessage}
                >
                  {msg.content}
                </div>
              );
            })}

            {loading && <div className={styles.botMessage}>Đang trả lời...</div>}
            <div ref={messagesEndRef}></div>
          </div>

          <form className={styles.inputArea} onSubmit={handleSend}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
            />
            <button type="submit">
              <Send size={24} />
            </button>
          </form>
        </div>
      ) : (
        <button className={styles.toggleButton} onClick={() => setOpen(true)}>
          💬
        </button>
      )}
    </div>
  );
}
