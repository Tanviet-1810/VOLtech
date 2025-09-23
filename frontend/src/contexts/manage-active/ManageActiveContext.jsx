import React, { createContext, useContext } from 'react';

export const ManageActiveContext = createContext();

export function useManageActiveContext() {
	return useContext(ManageActiveContext);
}
