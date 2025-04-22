import { useState } from 'react';
import { styled } from 'styled-components';

const Container = styled.div`
    width: 100%;
    box-sizing: border-box;
    min-height: ${props => props.hasFiles ? '100px' : '200px'};
    border: 2px dashed #ddd;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    gap: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: ${props => props.isDragActive ? 'rgba(76, 207, 80, 0.1)' : 'transparent'};
    border-color: ${props => props.isDragActive ? '#4CCF50' : '#ddd'};
`;

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES = [
    'video/mp4',
    'video/quicktime',
    'video/webm'
];
const ALLOWED_EXTENSIONS = ['.mp4', '.mov', '.webm'];

const FileDropZone = ({ 
    onFilesSelected, 
    disabled = false,
    maxFiles = 10,
    hasFiles = false
}) => {
    const [isDragActive, setIsDragActive] = useState(false);

    const validateFile = (file) => {
        if (!ALLOWED_TYPES.includes(file.type) && 
            !ALLOWED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext))) {
            return 'Invalid file type. Please select a valid video file (.mp4, .mov, .webm)';
        }
        if (file.size > MAX_FILE_SIZE) {
            return 'File size exceeds 100MB limit';
        }
        return null;
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
            setIsDragActive(true);
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const handleFiles = (newFiles) => {
        if (disabled) return;

        const fileArray = Array.from(newFiles);
        const validFiles = fileArray
            .slice(0, maxFiles)
            .filter(file => !validateFile(file));

        if (validFiles.length > 0) {
            onFilesSelected(validFiles);
        }

        // Show errors for invalid files
        const invalidFiles = fileArray.filter(file => validateFile(file));
        if (invalidFiles.length > 0) {
            const errors = invalidFiles.map(file => {
                const error = validateFile(file);
                return `${file.name}: ${error}`;
            });
            alert(errors.join('\n'));
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        
        if (!disabled) {
            const droppedFiles = e.dataTransfer.files;
            handleFiles(droppedFiles);
        }
    };

    const handleFileSelect = (e) => {
        const selectedFiles = e.target.files;
        if (selectedFiles) {
            handleFiles(selectedFiles);
        }
    };

    return (
        <Container
            onDragEnter={handleDragEnter}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            isDragActive={isDragActive}
            hasFiles={hasFiles}
            onClick={() => !disabled && document.getElementById('file-input').click()}
        >
            <input
                id="file-input"
                type="file"
                accept=".mp4,.mov,.webm"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                multiple
                disabled={disabled}
            />
            <div>Drag and drop video files here, or click to select</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
                Maximum {maxFiles} files, 100MB each
            </div>
        </Container>
    );
};

export default FileDropZone;
