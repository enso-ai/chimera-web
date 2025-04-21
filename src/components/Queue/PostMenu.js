import { useState, useEffect, useCallback, useRef } from 'react';
import { styled } from 'styled-components';
import { getSignedUrl, processAsset } from 'services/backend';
import { useQueue } from 'hocs/queue'; // Import the context hook
import FileDropZone from './FileDropZone';
import FileList from './FileList';
import { ConfirmButton, CancelButton } from 'components/Button'; // Import the refactored Button

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
`;

const MenuContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    width: 500px;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 16px;
    max-height: 90vh;
`;

const Header = styled.div`
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
`;

const Title = styled.h2`
    margin: 0;
    font-size: 24px;
    color: #333;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 32px;
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    opacity: ${(props) => (props.disabled ? 0.5 : 1)};
    color: #666;

    &:hover {
        color: #333;
    }
`;

const ButtonRow = styled.div`
    display: flex;
    justify-content: space-around;
    margin-top: 8px;
`;

const generateFileKey = (file) => {
    const identifier = {
        name: file.name,
        size: file.size,
        lastModified: file.lastModified,
        type: file.type,
    };
    return JSON.stringify(identifier);
};

const PostMenu = ({ channel, onClose, onSuccess }) => {
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [jobDone, setJobDone] = useState(false);
    const fileMapRef = useRef(new Map());
    const { refreshQueue } = useQueue(channel?.id); // Get refresh function from context

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isUploading) {
                e.preventDefault();
                e.returnValue =
                    'Files are still uploading. If you leave, uploads will be cancelled.';
                return e.returnValue;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            fileMapRef.current.clear();
        };
    }, [isUploading]);

    const updateFileStatus = useCallback((fileId, updates) => {
        setFiles((current) =>
            current.map((file) => (file.id === fileId ? { ...file, ...updates } : file))
        );
    }, []);

    const handleFilesSelected = (newFiles) => {
        const validFiles = newFiles
            .map((file) => {
                const fileKey = generateFileKey(file);
                if (fileMapRef.current.has(fileKey)) {
                    return null;
                }

                const fileItem = {
                    id: Math.random().toString(36).substr(2, 9),
                    file,
                    name: file.name,
                    size: file.size,
                    title: file.name.replace(/\.[^/.]+$/, ''), // Default title from filename
                    status: 'waiting',
                    progress: 0,
                    error: null,
                };

                fileMapRef.current.set(fileKey, fileItem);
                return fileItem;
            })
            .filter(Boolean);

        setFiles((current) => [...current, ...validFiles]);
    };

    const handleTitleChange = (fileId, newTitle) => {
        updateFileStatus(fileId, { title: newTitle });
    };

    const uploadFile = async (fileItem) => {
        try {
            // Get signed URL
            updateFileStatus(fileItem.id, { status: 'getting-url', progress: 0 });
            const { signed_url, object_key } = await getSignedUrl(channel.id, fileItem.title);

            // Upload to S3
            updateFileStatus(fileItem.id, { status: 'uploading', progress: 0 });
            const xhr = new XMLHttpRequest();

            await new Promise((resolve, reject) => {
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const progress = Math.round((event.loaded / event.total) * 100);
                        updateFileStatus(fileItem.id, { progress });
                    }
                };

                xhr.onload = () => {
                    if (xhr.status === 200) {
                        resolve();
                    } else {
                        reject(new Error(`Upload failed with status ${xhr.status}`));
                    }
                };

                xhr.onerror = () => reject(new Error('Upload failed'));

                xhr.open('PUT', signed_url);
                xhr.setRequestHeader('Content-Type', 'application/octet-stream');
                xhr.send(fileItem.file);
            });

            // Process asset
            updateFileStatus(fileItem.id, { status: 'processing', progress: 50 });
            try {
                const processResponse = await processAsset(object_key);

                // Update with the actual returned status if it exists
                if (processResponse.status) {
                    updateFileStatus(fileItem.id, {
                        status: processResponse.status,
                        progress: 100,
                    });
                }
                // No need to call onSuccess or refreshQueue here,
                // the polling mechanism in queue.js will handle status updates.
            } catch (processError) {
                // Specific handling for 404 errors (file not found on S3)
                if (processError.code === 404) {
                    console.error(
                        'Processing failed (404): File not found on S3 for key:',
                        object_key
                    );
                    updateFileStatus(fileItem.id, {
                        status: 'error',
                        error: 'File not available on storage server. Upload failed.',
                        progress: 0, // Reset progress as the core issue is upload-related
                    });
                } else {
                    // For other processing errors, show the error but keep progress at 50
                    console.error('Error processing asset:', processError);
                    updateFileStatus(fileItem.id, {
                        status: 'error',
                        error: processError.message || 'Processing failed',
                        progress: 50, // Keep progress to indicate upload succeeded
                    });
                }
            }
        } catch (error) {
            // Outer catch for S3 upload errors etc.
            console.error('Error during upload process:', error);
            updateFileStatus(fileItem.id, {
                status: 'error',
                error: error.message || 'Upload failed',
                progress: 0,
            });
        }
    };

    const processNextInQueue = async () => {
        // Get next waiting file
        const nextFile = files.find((f) => f.status === 'waiting');

        if (!nextFile) {
            // Check if all files are processed (complete or error)
            const allProcessed = files.every(
                (f) => f.status === 'complete' || f.status === 'error'
            );
            if (allProcessed && files.length > 0) {
                // All uploads finished, trigger refresh for the channel
                if (channel?.id) {
                    refreshQueue(); // Refresh the queue via context hook
                }
                setJobDone(true); // Mark job as done
                onSuccess(); // Call the original success handler from Queue.js
            }
            return;
        }

        // Check concurrency limits
        const gettingUrlCount = files.filter((f) => f.status === 'getting-url').length;
        const uploadingCount = files.filter((f) => f.status === 'uploading').length;
        const processingCount = files.filter((f) => f.status === 'processing').length;

        if (gettingUrlCount >= 1 || uploadingCount >= 1 || processingCount >= 2) {
            return;
        }

        // Start upload
        uploadFile(nextFile);
    };

    useEffect(() => {
        if (isUploading) {
            processNextInQueue();
        }
    }, [files, isUploading]);

    const startUploads = () => {
        setIsUploading(true);
    };

    const canStartUpload =
        files.length > 0 &&
        files.every((f) => f.title.trim() && (f.status === 'waiting' || f.status === 'error'));

    return (
        <>
            <Overlay onClick={isUploading ? undefined : onClose} />
            <MenuContainer>
                <Header>
                    <Title>Post to {channel.display_name}</Title>
                    <CloseButton onClick={isUploading ? undefined : onClose} disabled={isUploading}>
                        ×
                    </CloseButton>
                </Header>

                {!isUploading && (
                    <FileDropZone
                        onFilesSelected={handleFilesSelected}
                        disabled={isUploading}
                        maxFiles={10}
                        hasFiles={files.length > 0}
                    />
                )}

                <FileList files={files} onTitleChange={handleTitleChange} disabled={isUploading} />

                {jobDone ? (
                    <ButtonRow>
                        <ConfirmButton
                            onClick={() => {
                                setJobDone(false);
                                setFiles([]);
                                onClose();
                            }}
                        >
                            Close
                        </ConfirmButton>
                    </ButtonRow>
                ) : (
                    <ButtonRow>
                        <CancelButton onClick={onClose} disabled={isUploading}>
                            Cancel
                        </CancelButton>
                        <ConfirmButton
                            primary
                            onClick={startUploads}
                            disabled={isUploading || !canStartUpload}
                        >
                            {isUploading ? 'Uploading...' : 'Schedule'}
                        </ConfirmButton>
                    </ButtonRow>
                )}
            </MenuContainer>
        </>
    );
};

export default PostMenu;
