import { styled } from 'styled-components';
import { FiX } from 'react-icons/fi';

import Modal from 'components/Modal';

const ModalContainer = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    width: 600px;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    background: #f0f0f0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    z-index: 1;

    &:hover {
        background: #e0e0e0;
    }
`;

const VideoPlayer = styled.video`
    display: block;
    max-height: 80vh;
    border-radius: 8px;
    width: 100%;
`;

export default function PlayerModal({ playingAsset, onClose }) {
    return (
        <Modal onClose={onClose}>
            <ModalContainer>
                <CloseButton onClick={onClose}>
                    <FiX size={20} />
                </CloseButton>
                {playingAsset?.video_url ? (
                    <VideoPlayer controls src={playingAsset.video_url}>
                        Your browser does not support the video tag.
                    </VideoPlayer>
                ) : (
                    <p>Video URL not available</p>
                )}
            </ModalContainer>
        </Modal>
    );
}
