import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router';
import { getCurrentUser } from '../services/backend';
import { PageNames } from '../constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

            console.log('userData: ', userData);
            if (window.location.pathname === `/${PageNames.SIGNIN}`) {
                console.log('navigating to home');
                navigate(`/${PageNames.APP}/dashboard`);
            }
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

    useEffect(() => {
        checkAuth();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
        setUser(null);
        navigate(`/${PageNames.SIGNIN}`);
    };

    const handleLogin = () => {
        // checkAuth();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                handleLogout,
                handleLogin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
