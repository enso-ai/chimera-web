import { Button } from 'components/Button';
import styled from 'styled-components';

import { redirectToTiktokSignin } from 'utils/tiktok';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
`;

const AccountTitleContainer = styled.div`
    width: 100%;
    border-bottom: 2px solid #9a9a9a;

    display: flex;
    justify-content: center;
    margin-bottom: 5px;
`;

const AccountTitleText = styled.h3`
    color: #5f5f5f;
`;

const AccountsContainer = styled.div`
    flex-grow: 1;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
`;

const ChannelContainer = styled.div`
    width: 100%;
    height: 40px;
    display: flex;
    padding-left: 15px;
    align-items: center;
    cursor: pointer;

    background-color: ${(props) => (props.selected ? '#a0a0a0' : 'transparent')};
`;

const ChannelLabel = styled.p`
    font-size: 16px;

    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */
`;

const ButtonContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
`;

export default function ChannelList({
    channels,
    onSelectChannel,
    highlightedChannel,
    showAddButton = true,
    addButtonAction = redirectToTiktokSignin
}) {
    return (
        <Container>
            <AccountTitleContainer>
                <AccountTitleText>Channels</AccountTitleText>
            </AccountTitleContainer>
            <AccountsContainer>
                {channels.map((channel, index) => (
                    <ChannelContainer
                        key={index}
                        onClick={() => onSelectChannel(channel)}
                        selected={highlightedChannel?.id === channel.id}
                    >
                        <ChannelLabel>{channel.display_name}</ChannelLabel>
                    </ChannelContainer>
                ))}
            </AccountsContainer>
            {showAddButton && (
                <ButtonContainer>
                    <Button onClick={addButtonAction} fontSize="1.4em">
                        Add Channel
                    </Button>
                </ButtonContainer>
            )}
        </Container>
    );
}
