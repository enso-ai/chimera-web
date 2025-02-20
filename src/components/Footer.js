import styled from 'styled-components';
import { Link } from 'react-router';

const FooterContainer = styled.div`
    width: 100vw;
    height: 50px;
    podition: fixed;
    bottom: 0;
    left: 0;
    z-index: 100;

    background-color: #f0f0f0;
    box-sizing: border-box;
    padding: 20px;
    color: white;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    gap: 20px;
`;

const LegalDocLink = styled(Link)`
    font-size: 14px;
    color: #5f5f5f;
`

export default function Footer() {
    return (
        <FooterContainer>
            <LegalDocLink
                to={'/terms-of-service'}
            >Terms of Service</LegalDocLink>
            <LegalDocLink
                to={'/privacy-policy'}
            >Privacy Policy</LegalDocLink>
        </FooterContainer>
    )
}