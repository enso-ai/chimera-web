import React from 'react';
import styled from 'styled-components';

const SignInContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const SignInCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const SignIn = () => {
  return (
    <SignInContainer>
      <SignInCard>
        <Title>Sign In</Title>
        {/* Sign in content will be added here */}
      </SignInCard>
    </SignInContainer>
  );
};

export default SignIn;
