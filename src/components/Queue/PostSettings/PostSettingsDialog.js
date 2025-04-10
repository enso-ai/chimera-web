import { Fragment } from 'react';
import { styled } from 'styled-components';

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


export default function PostSettingDisplay({ channel, onClose }) {
    return (
            <Fragment>
            <Overlay onClick={ onClose } />
                <MenuContainer>
                    <div> test</div>
                </MenuContainer>
            </Fragment>
    )
}