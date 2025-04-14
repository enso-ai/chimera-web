import Modal from 'components/Modal';

export default function PlayerModal({ playingAsset, onClose }) {
    return (
        <Modal onClose={onClose}>
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    position: 'relative',
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    width: '600px',
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        width: '32px',
                        height: '32px',
                        border: 'none',
                        borderRadius: '50%',
                        background: '#f0f0f0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        zIndex: 1,
                    }}
                >
                    &times;
                </button>
                {playingAsset?.video_url ? (
                    <video
                        controls
                        width='100%'
                        src={playingAsset.video_url}
                        style={{
                            display: 'block',
                            maxHeight: '80vh',
                            borderRadius: '8px',
                        }}
                    >
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <p>Video URL not available</p>
                )}
            </div>
        </Modal>
    );
}
