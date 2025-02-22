import React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';

import Footer from 'components/Footer';

const Container = styled.div`
    width: 100%;
    background-color: #bfbfbf;
    overflow-x: hidden;
`;

const PolicyContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding-top: 2rem;
    padding-bottom: 2rem;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
    line-height: 1.6;
`;

const Title = styled.h1`
    margin-bottom: 1rem;
    font-size: 2rem;
`;

const SectionTitle = styled.h2`
    margin-top: 2rem;
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
`;

const Paragraph = styled.p`
    margin-bottom: 1rem;
`;

const List = styled.ul`
    margin-bottom: 1rem;
    padding-left: 1.5rem;
    list-style: disc;
`;

const ListItem = styled.li`
    margin-bottom: 0.5rem;
`;

const IconLink = styled(Link)`
    height: 80px;
    width: 80px;
    border-radius: 40px;
    overflow: hidden;
    display: block;
`;

const IconImage = styled.img`
    width: 80px;
    height: 80px;
`;

const PrivacyPolicy = () => {
    return (
        <Container>
            <PolicyContainer>
                <IconLink to='/'>
                    <IconImage src='/logo.png' alt='logo' />
                </IconLink>
                <Title>Privacy Policy</Title>

                <Paragraph>
                    <strong>Our Commitment to You</strong>: At Chimera, we are dedicated to
                    respecting your privacy and safeguarding your personal information. Our goal is
                    to provide a platform that helps you promote your TikTok videos and access
                    analytics data with confidence.
                </Paragraph>

                <Paragraph>
                    - <em>Privacy By Design</em>: From the outset, we integrate privacy and security
                    considerations into every feature.
                    <br />- <em>Transparency</em>: We strive to explain our data practices in clear,
                    concise language.
                    <br />- <em>Security</em>: We employ technical and organizational measures to
                    keep your information secure.
                </Paragraph>

                <Paragraph>
                    If you have any questions or concerns about our practices, feel free to contact
                    us at <a href='mailto:contact@voistory.ai'>contact@voistory.ai</a>.
                </Paragraph>

                <SectionTitle>1. Introduction</SectionTitle>
                <Paragraph>
                    Welcome to Chimera! This Privacy Policy explains how we collect, use, share, and
                    protect the information you provide when using Chimera’s services (“Services”).
                    By accessing or using Chimera, you consent to the data practices described in
                    this Privacy Policy.
                </Paragraph>

                <SectionTitle>2. Information We Collect</SectionTitle>
                <Paragraph>
                    <strong>2.1 Information You Provide to Us</strong>
                </Paragraph>
                <List>
                    <ListItem>
                        <strong>Account Creation</strong>: When you create a Chimera account, we may
                        collect personal information such as your name, email address, and any other
                        information you choose to provide.
                    </ListItem>
                    <ListItem>
                        <strong>Credentials/Access Tokens</strong>: To enable analytics or other
                        features, you may grant Chimera access to your TikTok (or other social
                        media) account(s). We collect and store the access tokens or API credentials
                        necessary to provide these Services.
                    </ListItem>
                </List>

                <Paragraph>
                    <strong>2.2 Information from Third-Party APIs</strong>
                </Paragraph>
                <Paragraph>
                    Chimera connects to TikTok and other social platforms via their official APIs to
                    gather metrics such as views, likes, comments, or demographic information. We do{' '}
                    <strong>not</strong> store copies of your posts, videos, or similar
                    user-generated content on our servers. We only retrieve analytics data made
                    available by these APIs and store it to display aggregated insights to you.
                </Paragraph>

                <Paragraph>
                    <strong>2.3 Usage Data</strong>
                </Paragraph>
                <List>
                    <ListItem>
                        <strong>Device and Log Information</strong>: We automatically collect
                        certain data when you use Chimera, such as IP addresses, device details, and
                        usage statistics (pages visited, links clicked, etc.).
                    </ListItem>
                    <ListItem>
                        <strong>Cookies and Similar Technologies</strong>: Chimera may use cookies
                        or similar technologies to enhance your user experience and gather usage
                        metrics. You may manage cookies through your browser or device settings.
                    </ListItem>
                </List>

                <Paragraph>
                    <strong>2.4 Children’s Data</strong>: Chimera is not intended for individuals
                    under 18 years of age. We do not knowingly collect personal information from
                    children. If you believe we have inadvertently collected such data, please
                    contact us immediately.
                </Paragraph>

                <SectionTitle>3. How We Use Your Information</SectionTitle>
                <Paragraph>We use the information we collect for the following purposes:</Paragraph>
                <List>
                    <ListItem>
                        <strong>Providing and Improving Services</strong>: To create and maintain
                        your account, display analytics data from social platforms, and personalize
                        your experience.
                    </ListItem>
                    <ListItem>
                        <strong>Communication</strong>: To send you account notifications, respond
                        to inquiries, and provide important service-related messages.
                    </ListItem>
                    <ListItem>
                        <strong>Research and Analytics</strong>: To analyze usage trends, measure
                        feature effectiveness, and improve Chimera’s functionality.
                    </ListItem>
                    <ListItem>
                        <strong>Marketing and Advertising</strong>: With your consent, we may send
                        you promotional messages or newsletters about Chimera services. You can opt
                        out at any time.
                    </ListItem>
                    <ListItem>
                        <strong>Legal and Compliance</strong>: To comply with laws, respond to legal
                        requests, or enforce our Terms of Service.
                    </ListItem>
                </List>

                <SectionTitle>4. Sharing Your Information</SectionTitle>
                <Paragraph>
                    We will not sell or rent your personal information to third parties without your
                    consent. However, we may share your data under these circumstances:
                </Paragraph>
                <List>
                    <ListItem>
                        <strong>Service Providers</strong>: We may engage trusted third-party
                        service providers to help operate and improve Chimera. These providers are
                        contractually obligated to protect your information.
                    </ListItem>
                    <ListItem>
                        <strong>Business Transfers</strong>: If Chimera or Enso AI, LLC undergoes a
                        merger or acquisition, user information may be transferred as part of that
                        deal.
                    </ListItem>
                    <ListItem>
                        <strong>Legal Obligations</strong>: We may disclose information to comply
                        with laws, legal processes, or governmental requests, and to protect our
                        rights or the safety of others.
                    </ListItem>
                    <ListItem>
                        <strong>With Your Consent</strong>: We may share information for other
                        purposes if you have given explicit permission.
                    </ListItem>
                </List>

                <SectionTitle>5. Data Retention</SectionTitle>
                <Paragraph>
                    We keep the information we collect for as long as necessary to fulfill the
                    purposes for which it was collected and to comply with legal obligations:
                </Paragraph>
                <List>
                    <ListItem>
                        <strong>Analytics Data</strong>: We store analytics data from TikTok (and
                        similar APIs) to display insights. If you unlink your social media account,
                        we will remove or de-identify your historical analytics data in line with
                        our policies.
                    </ListItem>
                    <ListItem>
                        <strong>Account Data</strong>: If you delete your Chimera account, we will
                        delete or anonymize your personal information, unless required by law to
                        retain it.
                    </ListItem>
                </List>

                <SectionTitle>6. Your Rights and Choices</SectionTitle>
                <Paragraph>
                    Depending on your location and applicable laws, you may have the following
                    rights:
                </Paragraph>
                <List>
                    <ListItem>
                        <strong>Access and Rectification</strong>: Request access to or update
                        personal information we hold about you.
                    </ListItem>
                    <ListItem>
                        <strong>Deletion (Right to Erasure)</strong>: Request that we delete your
                        personal information, subject to certain exceptions.
                    </ListItem>
                    <ListItem>
                        <strong>Data Portability</strong>: Obtain a copy of your data in a
                        machine-readable format.
                    </ListItem>
                    <ListItem>
                        <strong>Consent Withdrawal</strong>: Withdraw any consent given to us at any
                        time.
                    </ListItem>
                    <ListItem>
                        <strong>Objection or Restriction</strong>: Object to or restrict certain
                        data processing activities.
                    </ListItem>
                </List>
                <Paragraph>
                    To exercise these rights, please contact us at{' '}
                    <a href='mailto:contact@voistory.ai'>contact@voistory.ai</a>. We will respond in
                    accordance with applicable data protection laws.
                </Paragraph>

                <SectionTitle>7. Security Measures</SectionTitle>
                <Paragraph>
                    We employ administrative, technical, and physical safeguards to protect your
                    information:
                </Paragraph>
                <List>
                    <ListItem>
                        <strong>Data Encryption</strong>: Where feasible, data is encrypted in
                        transit (e.g., via SSL/TLS).
                    </ListItem>
                    <ListItem>
                        <strong>Secure Storage</strong>: We store user credentials, API tokens, and
                        analytics data in secure environments.
                    </ListItem>
                    <ListItem>
                        <strong>Incident Response</strong>: In the event of a data breach, we will
                        notify you promptly and take all necessary actions to mitigate potential
                        harm.
                    </ListItem>
                </List>

                <SectionTitle>8. Third-Party Links and Services</SectionTitle>
                <Paragraph>
                    Chimera may include links to third-party websites or services. This Privacy
                    Policy does not apply to those external sites, and we are not responsible for
                    their content or privacy practices. We recommend reviewing the privacy policies
                    of any third-party services you interact with.
                </Paragraph>

                <SectionTitle>9. International Transfers</SectionTitle>
                <Paragraph>
                    If you access Chimera from outside the United States, please note that your
                    information may be transferred to and stored on servers within the United States
                    or other jurisdictions. By using Chimera, you consent to such data transfers,
                    and we will take steps to ensure your data is protected in accordance with this
                    Privacy Policy and applicable data protection laws.
                </Paragraph>

                <SectionTitle>10. Changes to This Privacy Policy</SectionTitle>
                <Paragraph>
                    We reserve the right to modify or update this Privacy Policy at any time. If we
                    make material changes, we will notify you via Chimera’s interface or other
                    suitable means, and update the “Last Updated” date at the top of the policy.
                    Your continued use of Chimera after any changes indicates your acceptance of the
                    revised policy.
                </Paragraph>

                <SectionTitle>11. Contact Us</SectionTitle>
                <Paragraph>
                    If you have questions, concerns, or requests related to this Privacy Policy or
                    our handling of your personal information, please contact us at:{' '}
                    <a href='mailto:contact@voistory.ai'>contact@voistory.ai</a>.
                </Paragraph>
            </PolicyContainer>
            <Footer background_color='#333' font_color='#fff' max_width='800px' />
        </Container>
    );
};

export default PrivacyPolicy;
