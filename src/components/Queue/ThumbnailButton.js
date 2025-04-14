import { styled } from 'styled-components';
import { FiPlay } from 'react-icons/fi';

const ButtonWrapper = styled.button`
    width: 90px;
    height: 120px;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    display: block;
    line-height: 0;
    border-radius: 4px;
    overflow: hidden;
    position: relative;

    &:focus {
        outline: 2px solid #4CCF50;
        outline-offset: 2px;
    }
`;

const ThumbnailImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
`;

const PlayIconOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;

    ${ButtonWrapper}:hover & {
        opacity: 1;
    }
`;

const PlayIcon = styled(FiPlay)`
    color: white;
    width: 32px;
    height: 32px;
`;

export default function ThumbnailButton({ src, alt, onClick }) {
    return (
        <ButtonWrapper onClick={onClick}>
            <ThumbnailImage src={src} alt={alt} />
            <PlayIconOverlay>
                <PlayIcon />
            </PlayIconOverlay>
        </ButtonWrapper>
    );
}
