import styled from 'styled-components';

import StatsView from 'components/Home/StatsView';

const Container = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export default function HomeView() {
    return (
        <Container>
            <StatsView />
        </Container>
    );
}
