import { styled } from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 400px;
    overflow-y: auto;
    padding-right: 8px;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 3px;
    }
`;

const FileItem = styled.div`
    display: grid;
    grid-template-columns: 60px 1fr;
    gap: 12px;
    padding: 16px;
    background-color: #f5f5f5;
    border-radius: 8px;
`;

const Thumbnail = styled.div`
    width: 60px;
    height: 60px;
    background-color: #ddd;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 24px;

    svg {
        width: 32px;
        height: 32px;
    }
`;

const VideoIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
    </svg>
);

const FileDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const TitleInput = styled.input`
    box-sizing: border-box;
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    
    &:disabled {
        background: #f0f0f0;
        color: #666;
    }

    &:focus {
        outline: none;
        border-color: #4CCF50;
    }
`;

const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const FileInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #666;
`;

const Status = styled.div`
    font-size: 12px;
    font-weight: bold;
    color: ${props => {
        switch(props.status) {
            case 'complete': return '#4CCF50';
            case 'error': return '#ff4444';
            default: return '#666';
        }
    }};
`;


const ProgressBar = styled.div`
    width: 100%;
    height: 4px;
    background-color: #ddd;
    border-radius: 2px;
    overflow: hidden;
    
    div {
        height: 100%;
        background-color: ${props => {
            switch(props.status) {
                case 'getting-url': return '#ffd700';
                case 'uploading': return '#4CCF50';
                case 'processing': return '#1e90ff';
                case 'complete': return '#4CCF50';
                case 'error': return '#ff4444';
                default: return '#ddd';
            }
        }};
        width: ${props => props.progress}%;
        transition: width 0.3s ease;
    }
`;

const FileList = ({ 
    files = [], 
    onTitleChange,
    disabled = false 
}) => {
    if (files.length === 0) return null;

    return (
        <Container>
            {files.map((file) => (
                <FileItem key={file.id}>
                    <Thumbnail>
                        <VideoIcon />
                    </Thumbnail>
                    <FileDetails>
                        <TitleInput
                            value={file.title}
                            onChange={(e) => onTitleChange(file.id, e.target.value)}
                            placeholder="Enter video title"
                            disabled={disabled || file.status !== 'waiting'}
                        />
                        <InfoRow>
                            <FileInfo>
                                <span>{file.name}</span>
                                <span>•</span>
                                <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                            </FileInfo>
                            <Status status={file.status}>
                                {file.error || file.status}
                            </Status>
                        </InfoRow>
                        <ProgressBar 
                            status={file.status}
                            progress={file.progress}
                        >
                            <div />
                        </ProgressBar>
                    </FileDetails>
                </FileItem>
            ))}
        </Container>
    );
};

export default FileList;
