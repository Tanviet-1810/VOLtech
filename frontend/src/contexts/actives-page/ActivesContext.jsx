import React, { createContext, useContext } from 'react';

export const ActivesContext = createContext();

export function useActivesContext() {
	return useContext(ActivesContext);
}
