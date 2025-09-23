import { useContext } from 'react';
import AuthContext from './AuthContext.jsx';

const useAuthContext = () => useContext(AuthContext);

export default useAuthContext;
