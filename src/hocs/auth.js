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
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    throw new Error('No token found');
                }

                const userData = await getCurrentUser();
                setUser({
                    id: userData.id,
                    username: userData.username,
                });
            } catch (error) {
                // Only redirect if it's a 401 error (session expired) and not on auth pages
                console.log('curent path: ', window.location.pathname);
                if (
                    window.location.pathname.includes(PageNames.TERMS_OF_SERVICE) ||
                    window.location.pathname.includes(PageNames.PRIVACY_POLICY)
                ) {
                    return;
                }
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
