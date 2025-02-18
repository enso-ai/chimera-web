import { useState, useEffect } from 'react';

import styled from 'styled-components';

const Container = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;

    background-color: #bfbfbf;
`;

const LoginContainer = styled.div`
    box-sizing: border-box;
    width: 40%;
    max-width: 400px;
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    background-color: #f0f0f0;
    border-radius: 16px;

    padding-top: 30px;
`;

const Title = styled.h1`
    margin-bottom: 40px;
`;

const InputContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr;
    width: 70%;
    gap: 10px;
`;

const AccountsView = () => {
    // tmp solution to use state to store the accounts
    const [accounts, setAccounts] = useState([]);

    return (
        <Container>
            <LoginContainer>
                <Title> Login </Title>
                <InputContainer>
                    <label>username:</label>
                    <input></input>
                    <label>password:</label>
                    <input></input>
                </InputContainer>
            </LoginContainer>
        </Container>
    );
};
export default AccountsView;
