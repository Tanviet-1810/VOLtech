import React, { createContext, useContext } from 'react';

export const ChatBotContext = createContext();

export function useChatBotContext() {
	return useContext(ChatBotContext);
}
