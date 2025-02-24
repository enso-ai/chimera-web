import React from 'react';
import styled, { keyframes } from 'styled-components';
    
const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;
    
const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
`;
    
const Loader = styled.div`
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: ${rotate} 1s linear infinite;
`;
    
const LoadingSpinner = () => {
    return (
        <Container>
            <Loader />
        </Container>
    );
};
    
export default LoadingSpinner;