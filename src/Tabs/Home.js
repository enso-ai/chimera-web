import { useState } from 'react';

import styled from 'styled-components';

import LoginDialog from 'components/Home/LoginDialog';
import StatsView from 'components/Home/StatsView';

const Container = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export default function HomeView() {
    // tmp solution to use state to store login state
    const [loginState, setLoginState] = useState(false);

    const handleLogin = (username, password) => {
        if (username === 'tester' && password === '123456') {
            setLoginState(true);
            return true;
        } else {
            return false;
        }
    };

    return (
        <Container>{loginState ? <StatsView /> : <LoginDialog onLogin={handleLogin} />}</Container>
    );
}
