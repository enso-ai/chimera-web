import React from 'react';
import styled from 'styled-components';
import LoginDialog from '../components/SignIn/LoginDialog';

const SignInContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100%;
    background: #f8f9fa;
`;

const SignIn = () => {
    return (
        <SignInContainer>
            <LoginDialog />
        </SignInContainer>
    );
};

export default SignIn;
