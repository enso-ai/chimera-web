import styled from 'styled-components';
import { Theme } from "constants";

import { PiWarningCircleFill } from "react-icons/pi";

const Card = styled.div`
    border: 1px solid ${Theme.PRIMARY};
    background: ${Theme.PRIMARY_LIGHT};

    border-radius: 8px;
    padding: 16px;
    width: 100%;

    display: flex;
    flex-direction: row;
`
const IconContainer = styled.div`
    padding-right:8px;
`

const MessageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
`

const Message = styled.div`
    font-size: 14px;
    color: #333;
    text-align: center;
    line-height: 1.2;
`

export default function CommercialContentWarning({ brandedContentEnabled, yourBrandEnabled}) {
    let type = '';

    if (brandedContentEnabled) {
        type = "Paid Partnership"
    } else if (yourBrandEnabled) {
        type = "Promotional Content"
    }

    return (
        <Card>
            <IconContainer>
                <PiWarningCircleFill size={16} color={ Theme.PRIMARY } />
            </IconContainer>
            <MessageContainer>
                <Message>Your photo/video will be labeled as "{ type }".</Message>
                <Message>This cannot be changed once your video is posted.</Message>
            </MessageContainer>
        </Card>
    )
}