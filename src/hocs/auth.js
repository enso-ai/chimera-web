import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router';
import { getCurrentUser } from '../services/backend';
import { PageNames } from '../constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                handleLogout();
                return;
            }

            try {
                const userData = await getCurrentUser();
                setUser({
                    id: userData.id,
                    username: userData.username
                });
            } catch (error) {
                handleLogout();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
        setUser(null);
        navigate(`/${PageNames.SIGNIN}`);
    };

    const value = {
        user,
        loading,
        handleLogout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
