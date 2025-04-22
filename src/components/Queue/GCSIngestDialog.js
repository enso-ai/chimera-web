import { useState, useCallback } from 'react';
import { styled } from 'styled-components';
import { FiX, FiInfo } from 'react-icons/fi'; // Added FiInfo

import { ingestFromGCS } from 'services/backend';
import { Button } from '../Button'; // Import the refactored Button
import { Theme } from 'constants'; // Import theme constants

// Reusing styled components from PostMenu or similar structure
const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
`;

const DialogContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    width: 450px; // Slightly smaller than PostMenu
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-height: 90vh;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Title = styled.h2`
    margin: 0;
    font-size: 20px; // Slightly smaller title
    color: #333;
`;

const CloseButton = styled.div`
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    cursor: pointer;
    color: #666;
`;

const ContentArea = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

// New styled components for Info Box style
const InstructionsWrapper = styled.div`
    /* No specific styles needed for the wrapper itself */
`;

const PrimaryInstruction = styled.p`
    font-size: 14px;
    color: #555;
    line-height: 1.4;
    margin: 0 0 15px 0; /* Added bottom margin */
`;

const InfoBox = styled.div`
    border: 1px solid ${(props) => Theme.PRIMARY};
    background-color: ${(props) => Theme.PRIMARY_LIGHT};
    border-radius: 5px;
    padding: 15px;
`;

const InfoHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`;

const InfoIcon = styled(FiInfo)` /* Use FiInfo icon */
    font-size: 1.5em; /* Adjust size as needed */
    margin-right: 10px;
    color: #4CCF50; /* Match border color */
`;

const InfoTitle = styled.h4`
    margin: 0;
    font-size: 1.1em; /* 15.4px */
    color: #333;
`;

const InfoList = styled.ul`
    list-style: none;
    padding-left: 0;
    margin: 0;
`;

const InfoListItem = styled.li`
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #555;
    line-height: 1.4;
`;

const Checkmark = styled.span`
    color: #4CCF50;
    margin-right: 8px;
    font-weight: bold;
    font-size: 1.1em; /* Make checkmark slightly larger */
`;

const CodeSnippet = styled.code`
    background-color: #d0f0d1; /* Lighter green background */
    padding: 2px 4px;
    border-radius: 3px;
    font-family: monospace;
`;


const InputLabel = styled.label`
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
`;

const InputField = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    width: 100%;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: #4CCF50;
        box-shadow: 0 0 0 2px rgba(76, 207, 80, 0.2);
    }
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 14px;
    margin: 0;
    min-height: 1.4em; // Reserve space even when empty
`;

const ButtonRow = styled.div`
    display: flex;
    justify-content: flex-end; // Align buttons to the right
    gap: 12px; // Add gap between buttons
    margin-top: 8px;
`;

// Removed the local Button styled component definition, as we now import it.

const GCSIngestDialog = ({ channel, onClose, onSuccess }) => {
    const [jobId, setJobId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleConfirm = useCallback(async () => {
        if (!jobId || isLoading || !channel?.id) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await ingestFromGCS(channel.id, jobId);
            console.log('GCS Ingestion API Result:', result);
            // Assuming success if no error is thrown
            // The backend job starts, UI doesn't need to wait.
            onSuccess(channel.id); // Notify parent component, and close the dialog
        } catch (err) {
            console.error('GCS Ingestion Failed:', err);
            // Attempt to extract a user-friendly message
            const message = err?.message || err?.detail || 'Failed to start GCS ingestion job. Check Job ID and GCS data structure.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [jobId, channel, isLoading, onClose, onSuccess]);

    const handleClose = () => {
        if (!isLoading) {
            onClose();
        }
    };

    return (
        <>
            <Overlay onClick={handleClose} />
            <DialogContainer>
                <CloseButton onClick={handleClose} disabled={isLoading}>
                    <FiX size={27} color='#333' />
                </CloseButton>
                <Header>
                    <Title>GCS Ingest for {channel?.display_name || 'Channel'}</Title>
                </Header>

                <ContentArea>
                    {/* Updated Instructions Section */}
                    <InstructionsWrapper>
                        <PrimaryInstruction>
                            Enter your GCS upload Job ID (UUID).
                        </PrimaryInstruction>
                        <InfoBox>
                            <InfoHeader>
                                <InfoIcon size={20} /> {/* Adjust size if needed */}
                                <InfoTitle>Job data requirements</InfoTitle>
                            </InfoHeader>
                            <InfoList>
                                <InfoListItem>
                                    <Checkmark>✓</Checkmark>
                                    GCS folder must contain a <CodeSnippet>
                                        data.json
                                    </CodeSnippet>{' '}
                                    file
                                </InfoListItem>
                                <InfoListItem>
                                    <Checkmark>✓</Checkmark>
                                    File must be a list of objects
                                </InfoListItem>
                                <InfoListItem>
                                    <Checkmark>✓</Checkmark>
                                    Each object needs <CodeSnippet>
                                        video_filename
                                    </CodeSnippet> and <CodeSnippet>video_title</CodeSnippet>
                                </InfoListItem>
                            </InfoList>
                        </InfoBox>
                    </InstructionsWrapper>
                    {/* End of Updated Instructions Section */}

                    <div>
                        <InputLabel htmlFor='gcs-job-id'>GCS Job ID:</InputLabel>
                        <InputField
                            id='gcs-job-id'
                            type='text'
                            value={jobId}
                            onChange={(e) => setJobId(e.target.value)}
                            placeholder='UUID'
                            disabled={isLoading}
                        />
                    </div>
                    <ErrorMessage>{error}</ErrorMessage>
                </ContentArea>

                <ButtonRow>
                    {/* Use imported Button with 'secondary' variant */}
                    <Button variant='secondary' onClick={handleClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    {/* Use imported Button with specific orange color */}
                    {/* Use imported Button with specific orange color via the new 'color' prop */}
                    <Button primary onClick={handleConfirm} disabled={isLoading || !jobId.trim()}>
                        {isLoading ? 'Starting...' : 'Confirm'}
                    </Button>
                </ButtonRow>
            </DialogContainer>
        </>
    );
};

export default GCSIngestDialog;
