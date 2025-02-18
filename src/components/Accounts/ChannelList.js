import styled from 'styled-components';

import { CLIENT_KEY, REDIRECT_URI } from 'constants';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: calc(100vh - 75px);
    width: 100%;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;

`;

const AccountTitleContainer = styled.div`
    width: 100%;
    border-bottom: 3px solid gray;

    display: flex;
    justify-content: center;
    margin-bottom: 5px;
`

const AccountTitleText = styled.h3`
`

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
    
    background-color: ${props => props.selected ? 'white' : 'transparent'};
`

const ChannelLabel = styled.p`
    font-size: 16px;

    -webkit-user-select: none; /* Safari */        
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */
`

const AddChannelButton = styled.button`
    width: 80%;
    height: 50px;

    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 6px;
    background-color: orange;
    color: black;
    cursor: pointer;

    margin-bottom: 24px;
`;

const AccountButtonText = styled.h3`
`

export default function ChannelList({
    channels, onSelectChannel, highlightedChannel
}
) {
    const redirectToTiktok = () => {
        const csrfState = Math.random().toString(36).substring(2); // Generate CSRF state
        const scope = 'user.info.basic,user.info.stats,user.info.profile,video.list'; // Default scope

        // Store csrfState in localStorage.  This is client-side storage, but it's
        // temporary and only for this initial redirect.  A more robust approach
        // would involve a quick server-side set/get for the state.
        localStorage.setItem('csrfState', csrfState);

        let url = 'https://www.tiktok.com/v2/auth/authorize/';
        // Template literals for cleaner string construction
        url += `?client_key=${CLIENT_KEY}`;
        url += `&scope=${scope || 'user.info.basic'}`; // Default scope
        url += '&response_type=code';
        // URL-encode the redirect URI!
        url += `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
        url += `&state=${csrfState}`;

        window.location.href = url;
    };

    return (
        <Container>
            <AccountTitleContainer>
                <AccountTitleText>Accounts</AccountTitleText>
            </AccountTitleContainer>
            <AccountsContainer>
                {channels.map((channel, index) => (
                    <ChannelContainer
                        key={index} onClick={() =>onSelectChannel(channel)}
                        selected={highlightedChannel?.id === channel.id}
                    >
                        <ChannelLabel>{channel.display_name}</ChannelLabel>
                    </ChannelContainer>
                ))}
            </AccountsContainer>
            <AddChannelButton onClick={redirectToTiktok}>
                <AccountButtonText>Add Account</AccountButtonText>
            </AddChannelButton>
        </Container>
    );
};
