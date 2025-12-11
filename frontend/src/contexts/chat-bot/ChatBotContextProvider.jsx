import React, { useState, useCallback, useRef } from "react";
import { ChatBotContext } from "./ChatBotContext";
import APP_CONFIG from "../../../config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import instructions from "./chatbot-instructions.json";
import { useActivesContext } from "../actives-page/ActivesContext";
import { getList } from '../../services/api/v1/active-api.service';

const genAI = new GoogleGenerativeAI(APP_CONFIG.chat_bot.api_key);

export default function ChatBotContextProvider({ children }) {
  const { activities } = useActivesContext();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const initChat = useCallback(() => {
    if (!chatRef.current) {
      const model = genAI.getGenerativeModel({
        model: APP_CONFIG.chat_bot.model,
      });

      chatRef.current = model.startChat({
        history: [
          {
            role: "user",
            parts: [
              {
                text: instructions.systemPrompt || "Bạn là chatbot hỗ trợ tình nguyện viên.",
              },
            ],
          },
        ],
      });
    }
    return chatRef.current;
  }, []);

  const sendMessage = useCallback(async (message) => {
    setLoading(true);
    try {
      const text = (message || "").toLowerCase();
      const suggestRegex = /hoạt động|gợi ý|tiêu biểu|tiêu-biểu|đề xuất|gợi ý hoạt động|hoạt động tiêu biểu/;

      if (suggestRegex.test(text)) {
        // prefer activities from context, otherwise fetch top activities from API
        let source = Array.isArray(activities) && activities.length ? activities : null;

        if (!source) {
          try {
            const res = await getList({ limit: 3, sortBy: 'points', sortOrder: 'desc' });
            if (res && res.ok) {
              const data = await res.json();
              if (Array.isArray(data.items) && data.items.length) source = data.items;
            }
          } catch (fetchErr) {
            console.error('Failed to fetch activities for chat suggestions:', fetchErr);
          }
        }

        if (source && source.length) {
          const top = [...source].sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 3);

          // build structured items with image and points
          const items = top.map(act => ({
            _id: act._id,
            title: act.title,
            description: act.description ? (act.description.length > 120 ? act.description.slice(0, 117) + '...' : act.description) : '',
            image: Array.isArray(act.images) && act.images.length ? act.images[0] : null,
            points: act.points || 0,
          }));

          setHistory(prev => [
            ...prev,
            { role: 'assistant', content: 'Mình tìm thấy một vài hoạt động tiêu biểu bạn có thể quan tâm:' },
            { role: 'assistant', type: 'activities_list', items }
          ]);

          return 'Đã gửi danh sách hoạt động.';
        }
        // fallthrough to normal model response if no activities found
      }

      const chat = initChat();
      const result = await chat.sendMessage(message);
      let response = result.response.text();

      response = response.replace(/\*/g, "");

      setHistory(prev => [
        ...prev,
        { role: "assistant", content: response }
      ]);

      return response;
    } catch (error) {
      console.error("ChatBot error:", error);
      setHistory(prev => [
        ...prev,
        { role: "assistant", content: "Xin lỗi, ChatBot tạm thời không khả dụng. Vui lòng thử lại sau." }
      ]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [initChat, activities]);

  const value = { history, loading, sendMessage, setHistory };
  return <ChatBotContext.Provider value={value}>{children}</ChatBotContext.Provider>;
}
