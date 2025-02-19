import { useState } from 'react';

import styled from 'styled-components';

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

export default function LoginDialog({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <LoginContainer>
            <Title> Login </Title>
            <InputContainer>
                <Label>username:</Label>
                <Input
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                />
                <Label>password:</Label>
                <Input
                    type='password'
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
            </InputContainer>
            <SubmitButton
                onClick={() => {
                    const res = onLogin(username, password);
                    if (!res) {
                        alert('Wrong username or password, try again');
                    }
                }}
            >
                Submit
            </SubmitButton>
        </LoginContainer>
    );
};
