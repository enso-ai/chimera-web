import styled from 'styled-components';

import { Button } from 'components/Button';

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    background-color: Gransparent;
`

const Card = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid #ccc;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    background: white;
    border-radius: 16px;
    padding: 30px;
    width: 300px;
    height: 200px;
    z-index: 1001;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`

const Title = styled.p`
    width: 100%;
    font-size: 18px;
    color: #333;
    text-align: center;
    font-weight: 800;
    line-height: 1;
    margin-top: 0;
    padding-bottom: 0px;
    margin-bottom: 0px;
`

const Message = styled.div`
    font-size: 16px;
    color: #333;
    font-weight: 600;
    text-align: center;
    margin: 0;
    line-height: 1.2;
    margin-bottom: 20px;
`

const Type = styled.div`
    font-size: 16px;
    color: #333;
    font-weight: 800;
    text-align: center;
    margin: 0;
    line-height: 1;
`

export default function CommercialContentWarning({ onClose, brandedContentEnabled, yourBrandEnabled}) {
    let type = '';

    if (brandedContentEnabled) {
        type = "Paid Partnership"
    } else if (yourBrandEnabled) {
        type = "Promotional Content"
    }

    return (
        <Overlay onClick={onClose} >
            <Card>
                <Title> Content Setting Changed</Title>
                <div>
                    <Message>Your photo/video will be labeled as </Message>
                    <Type>{type}</Type>
                </div>
                <Button onClick={onClose} variant="primary" size="large">
                    OK
                </Button>
            </Card>
        </Overlay>
    )
}