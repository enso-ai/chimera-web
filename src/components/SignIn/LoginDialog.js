import { useState } from 'react';
import styled from 'styled-components';
import { login, signup } from '../../services/backend';

const TabContainer = styled.div`
    display: flex;
    width: 100%;
    margin-bottom: 20px;
`;

const Tab = styled.button`
    flex: 1;
    padding: 10px;
    background: ${props => props.active ? '#ffcc00' : '#e0e0e0'};
    border: none;
    font-weight: bold;
    cursor: pointer;
    
    &:first-child {
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
    }
    
    &:last-child {
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
    }
`;

const LoginContainer = styled.div`
    box-sizing: border-box;
    width: 40%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;

    background-color: #f0f0f0;
    border-radius: 16px;

    padding: 30px;
`;

const Title = styled.div`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 30px;
`;

const InputContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr;
    width: 70%;
    gap: 10px;

    margin-bottom: 30px;
`;

const Label = styled.label`
    font-size: 16px;
    font-weight: bold;
`;

const Input = styled.input`
    width: 100%;
    height: 20px;

    font-size: 16px;
`;

const SubmitButton = styled.button`
    width: 100px;
    height: 40px;

    font-size: 16px;
    font-weight: bold;
    background-color: #ffcc00;
`;

export default function LoginDialog({ onLoginSuccess }) {
    const [activeTab, setActiveTab] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        try {
            let response;
            if (activeTab === 'login') {
                response = await login(username, password);
            } else {
                response = await signup(username, password);
            }
            onLoginSuccess(response);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <LoginContainer>
            <TabContainer>
                <Tab 
                    active={activeTab === 'login'}
                    onClick={() => setActiveTab('login')}
                >
                    Login
                </Tab>
                <Tab 
                    active={activeTab === 'signup'}
                    onClick={() => setActiveTab('signup')}
                >
                    Sign Up
                </Tab>
            </TabContainer>

            <Title>{activeTab === 'login' ? 'Login' : 'Sign Up'}</Title>
            
            <InputContainer>
                <Label>Username:</Label>
                <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Label>Password:</Label>
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </InputContainer>

            {error && <div style={{color: 'red', marginBottom: '20px'}}>{error}</div>}

            <SubmitButton onClick={handleSubmit}>
                {activeTab === 'login' ? 'Login' : 'Sign Up'}
            </SubmitButton>
        </LoginContainer>
    );
}
