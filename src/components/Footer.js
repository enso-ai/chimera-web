import styled from 'styled-components';
import { Link } from 'react-router';

const FooterContainer = styled.div`
    width: 100%;
    height: 50px;
    podition: fixed;
    bottom: 0;
    left: 0;
    z-index: 100;

    background-color: ${(props) => props.bg_color};
    box-sizing: border-box;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const TextContainer = styled.div`
    max-width: ${(props) => props.max_width};
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 20px;
`;

const LegalDocLink = styled(Link)`
    font-size: 14px;
    color: ${(props) => props.font_color};
`;

export default function Footer({
    background_color = '#f0f0f0',
    font_color = '#5f5f5f',
    max_width = 'calc(100% - 40px)',
}) {
    return (
        <FooterContainer bg_color={background_color}>
            <TextContainer max_width={max_width}>
                <LegalDocLink to={'/terms-of-service'} font_color={font_color}>
                    Terms of Service
                </LegalDocLink>
                <LegalDocLink to={'/privacy-policy'} font_color={font_color}>
                    Privacy Policy
                </LegalDocLink>
            </TextContainer>
        </FooterContainer>
    );
}