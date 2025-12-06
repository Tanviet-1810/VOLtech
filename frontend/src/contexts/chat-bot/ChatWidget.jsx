import React, { useState, useEffect, useRef, useContext } from "react";
import { Send, X } from "lucide-react";
import { ROUTES } from "../../const/route";
import styles from "./ChatWidget.module.scss";
import voltechBot from "../../assets/Icons/voltech-bot.png";
import { useNavigate } from "react-router-dom";
import { ChatBotContext } from "./ChatBotContext";
import APP_CONFIG from "../../../config";

export default function ChatWidget() {
  const { history, sendMessage, loading, setHistory } = useContext(ChatBotContext);
  const navigate = useNavigate();
  const chatRef = useRef(null);
  const toggleRef = useRef(null);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const normalizeImage = (url) => {
    if (!url) return null;
    if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:')) return url;
    try {
      const base = APP_CONFIG.api.baseUrl || APP_CONFIG.api.base || APP_CONFIG.api.getFullPath ? APP_CONFIG.api.getFullPath('') : '';
      if (typeof APP_CONFIG.api.getFullPath === 'function') return APP_CONFIG.api.getFullPath(url);
      return (base.endsWith('/') ? base.slice(0, -1) : base) + '/' + (url.startsWith('/') ? url.slice(1) : url);
    } catch (err) {
      return url;
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  // Close chat when clicking outside the chat panel or toggle button
  useEffect(() => {
    function handleClickOutside(e) {
      if (!open) return;
      const target = e.target;
      if (chatRef.current && !chatRef.current.contains(target) && toggleRef.current && !toggleRef.current.contains(target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

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
    setMessage(""); 

    setHistory(prev => [
      ...prev,
      { role: "user", content: userMessage, activityId: null }
    ]);

    try {
      await sendMessage(userMessage);
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  return (
    <div className={styles.chatWidget}>
      {open ? (
        <div className={`${styles.chatBox} fade-in`} ref={chatRef}>
          <div className={styles.header}>
            <span>VOLtech Bot</span>
            <button 
              className={styles.closeBtn}
              title='Đóng'
              type='button'
              onClick={() => setOpen(false)}
              >
              <X size={16}/>
            </button>
          </div>

          <div className={styles.messages}>
            {history.map((msg, i) => {
              if (msg.type === 'activities_list' && Array.isArray(msg.items)) {
                return (
                  <div key={i} className={styles.botMessage}>
                    <div className={styles.activityList}>
                      {msg.items.map(item => (
                        <div
                          key={item._id}
                          className={styles.activityCard}
                          role="button"
                          tabIndex={0}
                          onClick={() => { navigate(ROUTES.ACTIVE.withId(item._id)); setOpen(false); }}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { navigate(ROUTES.ACTIVE.withId(item._id)); setOpen(false); } }}
                        >
                          {item.image ? (
                            <img src={normalizeImage(item.image)} alt={item.title} className={styles.thumb} onError={(e)=>{e.target.src='https://via.placeholder.com/150?text=No+Image'}} />
                          ) : (
                            <div className={styles.thumb} aria-hidden="true" />
                          )}
                          <div className={styles.meta}>
                            <div className={styles.title}>{item.title}
                              </div>
                                {/* {item.description && <div className={styles.desc}>{item.description}
                              </div>} */}
                            </div>
                          {/* <div className={styles.points}>{item.points}điểm</div> */}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (msg.activityId) {
                return (
                  <a
                    href={ROUTES.ACTIVE.withId(msg.activityId)}
                    key={i}
                    className={msg.role === "user" ? styles.userMessage : styles.botMessage}
                    onClick={(e) => { e.preventDefault(); navigate(ROUTES.ACTIVE.withId(msg.activityId)); setOpen(false); }}
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
        <button
          className={styles.toggleButton}
          onClick={() => setOpen(true)}
          aria-label="Mở chat VOLtech Bot"
          title="Mở chat VOLtech Bot"
        >
          <img src={voltechBot} alt="VOLtech Bot" className={styles.toggleIcon} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
