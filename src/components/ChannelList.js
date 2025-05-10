import { useState, useEffect } from 'react';
import { Button } from 'components/Button';
import styled from 'styled-components';
import ScopeSelectionDialog from 'components/Channels/ScopeSelectionDialog'; // Added import

// Custom hook for debounced value
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set debouncedValue to value after the specified delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cancel the timeout if value changes or component unmounts
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

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

const SearchContainer = styled.div`
    width: 100%;
    padding: 10px 15px;
    box-sizing: border-box;
    position: relative;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 8px 12px;
    padding-right: 30px; /* Space for the clear button */
    border-radius: 4px;
    border: 1px solid #9a9a9a;
    font-size: 14px;
    box-sizing: border-box;
    
    &:focus {
        outline: none;
        border-color: #1565C0;
        box-shadow: 0 0 0 2px rgba(21, 101, 192, 0.2);
    }
    
    &::placeholder {
        color: #aaa;
    }
`;

const ClearButton = styled.button`
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #999;
    font-size: 16px;
    display: ${props => props.visible ? 'block' : 'none'};
    
    &:hover {
        color: #666;
    }
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
    background-color: ${(props) => (props.selected ? '#e0e0e0' : 'transparent')};
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

const NoResultsMessage = styled.div`
    padding: 20px;
    text-align: center;
    color: #666;
    font-style: italic;
`;

export default function ChannelList({
    channels,
    onSelectChannel,
    highlightedChannel,
    showAddButton = true
    // Removed addButtonAction prop
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 300); // 300ms delay
    const [showScopeDialog, setShowScopeDialog] = useState(false); // Added state for dialog

    // Filter channels based on debounced search query
    const filteredChannels = channels.filter(channel =>
        channel.display_name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );

    return (
        <Container>
            <AccountTitleContainer>
                <AccountTitleText>Channels</AccountTitleText>
            </AccountTitleContainer>

            <SearchContainer>
                <SearchInput
                    type="text"
                    placeholder="Search channels..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <ClearButton
                    visible={searchQuery.length > 0}
                    onClick={() => setSearchQuery('')}
                >
                    ✕
                </ClearButton>
            </SearchContainer>

            <AccountsContainer>
                {filteredChannels.length > 0 ? (
                    filteredChannels.map((channel, index) => (
                        <ChannelContainer
                            key={index}
                            onClick={() => onSelectChannel(channel)}
                            selected={highlightedChannel?.id === channel.id}
                        >
                            <ChannelLabel>{channel.display_name}</ChannelLabel>
                        </ChannelContainer>
                    ))
                ) : (
                    <NoResultsMessage>
                        No channels match your search
                    </NoResultsMessage>
                )}
            </AccountsContainer>

            {showAddButton && (
                <ButtonContainer>
                    <Button onClick={() => setShowScopeDialog(true)} fontSize="1.4em">
                        Add Channel
                    </Button>
                </ButtonContainer>
            )}

            {showScopeDialog && (
                <ScopeSelectionDialog onClose={() => setShowScopeDialog(false)} />
            )}
        </Container>
    );
}
