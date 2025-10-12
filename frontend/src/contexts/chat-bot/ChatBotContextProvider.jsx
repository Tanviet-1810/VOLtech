import React, { useState, useCallback, useRef } from "react";
import { ChatBotContext } from "./ChatBotContext";
import APP_CONFIG from "../../../config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import instructions from "./chatbot-instructions.json";
import { useActivesContext } from "../actives-page/ActivesContext";

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
      const chat = initChat();
      const result = await chat.sendMessage(message);
      let response = result.response.text();

      // Loại bỏ tất cả dấu * Markdown
      response = response.replace(/\*/g, "");

      // Thêm tin nhắn bot vào history
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
  }, [initChat]);

  const value = { history, loading, sendMessage, setHistory };
  return <ChatBotContext.Provider value={value}>{children}</ChatBotContext.Provider>;
}
