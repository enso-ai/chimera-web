import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { login, signup } from 'services/backend';

const IconContainer = styled.div`
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 0.5rem;
`;

const IconImage = styled.img`
    width: 80px;
    height: 80px;
`;

const TabContainer = styled.div`
    display: flex;
    width: 100%;
    margin-bottom: 2rem;
    border-bottom: 1px solid #eaeaea;
`;

const Tab = styled.button`
    flex: 1;
    padding: 1rem;
    background: transparent;
    border: none;
    font-weight: 600;
    cursor: pointer;
    color: ${(props) => (props.$active ? '#2563eb' : '#64748b')};
    border-bottom: 2px solid ${(props) => (props.$active ? '#2563eb' : 'transparent')};
    transition: all 0.2s ease;

    &:hover {
        color: #2563eb;
    }
`;

const LoginContainer = styled.div`
    box-sizing: border-box;
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-items: center;
    background-color: white;
    border-radius: 0.5rem;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    margin-bottom: 2rem;
`;

const Label = styled.label`
    font-size: 0.875rem;
    font-weight: 500;
    color: #475569;
`;

const Input = styled.input`
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    transition: border-color 0.2s ease;

    &:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
    }
`;

const SubmitButton = styled.button`
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #1d4ed8;
    }

    &:disabled {
        background-color: #e2e8f0;
        cursor: not-allowed;
    }
`;

export default function LoginDialog() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!isFormValid) {
            setError('Please fill in all fields correctly.');
            return;
        }

        try {
            let response;
            if (activeTab === 'login') {
                response = await login(username, password);
            } else {
                response = await signup(username, password);
            }
            console.log('user signed in:', response);
            navigate('/app/dashboard');
        } catch (err) {
            console.log('error: ', err);
            if (err.message === 'No Authorization') {
                setError('Invalid username or password');
            } else if (err.message === 'Conflict') {
                setError('Username already exists');
            } else {
                setError(err.message || 'An error occurred');
            }
        }
    };

    useEffect(() => {
        if (!username && !password) {
            setIsFormValid(false);
            setError('');
            return;
        }

        const usernameRegex = /^[a-zA-Z0-9_-]{6,}$/;
        if (!usernameRegex.test(username)) {
            setError('Username must be at least 6 characters, no spaces, no special characters.');
            setIsFormValid(false);
            return;
        }
        if (password.length < 5) {
            setError('Password must be at least 5 characters.');
            setIsFormValid(false);
            return;
        }

        setError('');
        setIsFormValid(true);
    }, [username, password]);

    return (
        <LoginContainer>
            <IconContainer>
                <IconImage src='/logo.png' alt='logo' />
            </IconContainer>
            <TabContainer>
                <Tab $active={activeTab === 'login'} onClick={() => setActiveTab('login')}>
                    Login
                </Tab>
                <Tab $active={activeTab === 'signup'} onClick={() => setActiveTab('signup')}>
                    Sign Up
                </Tab>
            </TabContainer>

            <InputContainer>
                <Label>Username:</Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                <Label>Password:</Label>
                <Input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </InputContainer>

            {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

            <SubmitButton onClick={handleSubmit} disabled={!isFormValid}>
                {activeTab === 'login' ? 'Login' : 'Sign Up'}
            </SubmitButton>
        </LoginContainer>
    );
}
