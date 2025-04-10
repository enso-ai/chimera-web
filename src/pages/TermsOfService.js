import React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';

import Footer from 'components/Footer';

const Container = styled.div`
    width: 100%;
    background-color: #bfbfbf;
    overflow-x: hidden;
`;

const TermsContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding-top: 2rem;
    padding-bottom: 2rem;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
    line-height: 1.6;
`;

const SectionTitle = styled.h2`
    margin-top: 2rem;
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
`;

const Paragraph = styled.p`
    margin-bottom: 1rem;
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

const TermsOfService = () => {
    return (
        <Container>
            <TermsContainer>
                <IconLink to='/'>
                    <IconImage src='/logo.png' alt='logo' />
                </IconLink>
                <h1>Terms of Service</h1>

                <SectionTitle>1. Acceptance of Terms</SectionTitle>
                <Paragraph>
                    Welcome to Chimera! These Terms of Service (“Terms”) constitute a legal
                    agreement between you (“you,” “user”) and <strong>Enso AI, LLC</strong>
                    (“we,” “us,” or “our”). By accessing or using Chimera, you agree to be bound by
                    these Terms. If you do not agree to these Terms, please refrain from using the
                    service.
                </Paragraph>

                <SectionTitle>2. Eligibility</SectionTitle>
                <Paragraph>
                    <strong>Age Requirement:</strong> You must be at least 18 years old to use
                    Chimera.
                </Paragraph>
                <Paragraph>
                    <strong>Legal Capacity:</strong> By accessing or using Chimera, you represent
                    and warrant that you meet the age requirement and have the legal capacity to
                    enter into these Terms.
                </Paragraph>

                <SectionTitle>3. Use of Chimera</SectionTitle>
                <Paragraph>
                    Chimera is designed to help users promote their TikTok videos and provide
                    analytics data across different TikTok or other social media accounts. By using
                    Chimera, you agree to:
                </Paragraph>
                <ul>
                    <li>
                        <strong>Proper Use</strong>: Use Chimera in compliance with all applicable
                        laws, regulations, and platform-specific rules (e.g., TikTok community
                        guidelines). Refrain from any activity that may be harmful, illegal, or
                        abusive.
                    </li>
                    <li>
                        <strong>Account Setup and Accuracy of Information</strong>: Provide
                        accurate, current, and complete information when creating an account or
                        linking your social media accounts to Chimera. You are responsible for
                        maintaining the confidentiality of your login credentials and any API tokens
                        or keys related to third-party social platforms.
                    </li>
                    <li>
                        <strong>Prohibited Activities</strong>: You agree not to upload, post, or
                        otherwise transmit any content that is unlawful, fraudulent, defamatory, or
                        invasive of another’s privacy. You agree not to engage in any act that
                        disrupts or impairs the functionality of Chimera.
                    </li>
                    <li>
                        <strong>TikTok Compliance</strong>: You acknowledge that Chimera is{' '}
                        <strong>not</strong> affiliated with TikTok or any other social media
                        platform. You agree to abide by TikTok’s (and any other relevant platform’s)
                        terms of service and guidelines.
                    </li>
                    <li>
                        <strong>Reporting Inappropriate Behavior</strong>: If you encounter any user
                        or content on Chimera that violates these Terms, please report it using the
                        in-service reporting mechanism (if available) or contact us at{' '}
                        <a href='mailto:contact@voistory.ai'>contact@voistory.ai</a>.
                    </li>
                </ul>

                <SectionTitle>4. Content and Intellectual Property</SectionTitle>
                <Paragraph>
                    <strong>Your Content</strong>: You retain ownership of any content you create or
                    share through Chimera. By posting or sharing content, you grant Enso AI, LLC a
                    non-exclusive, royalty-free, worldwide license to use, reproduce, modify, adapt,
                    publish, and display that content solely for the purpose of operating and
                    improving Chimera.
                </Paragraph>
                <Paragraph>
                    <strong>Prohibited Content</strong>: You must not post or share any content that
                    is unlawful, infringing, obscene, or violates the rights of others. We reserve
                    the right to remove or disable access to any content that violates these Terms
                    or our policies.
                </Paragraph>
                <Paragraph>
                    <strong>Intellectual Property Rights</strong>: All software, technology,
                    designs, logos, and other materials provided by Enso AI, LLC (“Chimera
                    Materials”) remain the exclusive property of Enso AI, LLC or its licensors.
                    Except for the limited license granted to you to use Chimera, no right, title,
                    or interest in our intellectual property is transferred to you.
                </Paragraph>
                <Paragraph>
                    <strong>Infringing Content</strong>: If you believe any content on Chimera
                    infringes your intellectual property rights, please notify us at{' '}
                    <a href='mailto:contact@voistory.ai'>contact@voistory.ai</a> with the necessary
                    details to assist in a prompt investigation.
                </Paragraph>

                <SectionTitle>5. Payments and Subscriptions</SectionTitle>
                <Paragraph>
                    <strong>Paid Features</strong>: Chimera may offer certain paid features or
                    subscriptions. By purchasing these features, you agree to pay the specified fees
                    and abide by any additional terms presented at the time of purchase.
                </Paragraph>
                <Paragraph>
                    <strong>Subscription Terms</strong>: The duration, pricing, and automatic
                    renewal terms of subscriptions will be clearly stated before purchase. You may
                    cancel your subscription at any time; however, refunds may be subject to our
                    refund policy and applicable laws.
                </Paragraph>
                <Paragraph>
                    <strong>Refunds</strong>: We may provide refunds in specific cases as outlined
                    in our refund policy. Any refunds are granted at our discretion and in
                    accordance with applicable law.
                </Paragraph>

                <SectionTitle>6. Disclaimers and Limitations of Liability</SectionTitle>
                <Paragraph>
                    <strong>Use at Your Own Risk</strong>: You acknowledge and agree that your use
                    of Chimera is at your own risk. We do not guarantee the accuracy, reliability,
                    or availability of Chimera or its features.
                </Paragraph>
                <Paragraph>
                    <strong>No Warranty</strong>: Chimera is provided “as is,” without warranties of
                    any kind, whether express or implied, including, but not limited to, implied
                    warranties of merchantability, fitness for a particular purpose, or
                    non-infringement.
                </Paragraph>
                <Paragraph>
                    <strong>Limitation of Liability</strong>: In no event shall Enso AI, LLC be
                    liable for any direct, indirect, incidental, special, consequential, or
                    exemplary damages arising out of or related to your use of Chimera or these
                    Terms. Where liability cannot be excluded under applicable law, our total
                    liability shall not exceed the amount you paid to use Chimera in the 12 months
                    preceding the incident giving rise to liability (or, if no fees were paid, a
                    nominal amount).
                </Paragraph>

                <SectionTitle>7. Indemnification</SectionTitle>
                <Paragraph>
                    You agree to indemnify and hold Enso AI, LLC (including its directors,
                    employees, and agents) harmless from any claims, damages, liabilities, and
                    expenses (including reasonable attorneys’ fees) arising out of or in connection
                    with your use of Chimera, your violation of these Terms, or your infringement of
                    any third-party rights.
                </Paragraph>

                <SectionTitle>8. Ads and Third-Party Content</SectionTitle>
                <Paragraph>
                    <strong>Advertisements</strong>: Chimera may display advertisements or links to
                    third-party websites. We do not endorse or guarantee the accuracy or quality of
                    these ads or external sites.
                </Paragraph>
                <Paragraph>
                    <strong>Third-Party Interactions</strong>: Any interactions or transactions
                    between you and advertisers or third parties found on or through Chimera are
                    solely between you and such third parties. Enso AI, LLC will not be liable for
                    any loss or damage incurred as a result of such dealings.
                </Paragraph>

                <SectionTitle>9. Governing Law and Dispute Resolution</SectionTitle>
                <Paragraph>
                    These Terms shall be governed by and construed in accordance with the laws of{' '}
                    <strong>Delaware</strong>, without regard to its conflict of law provisions. Any
                    disputes arising out of or relating to these Terms or Chimera shall be resolved
                    exclusively in the courts located in <strong>Delaware</strong>.
                </Paragraph>

                <SectionTitle>10. Termination</SectionTitle>
                <Paragraph>
                    <strong>Voluntary Termination</strong>: You may terminate your use of Chimera at
                    any time by deleting your account or discontinuing use of the service.
                </Paragraph>
                <Paragraph>
                    <strong>Termination by Enso AI, LLC</strong>: We reserve the right to suspend or
                    terminate your access to Chimera if we believe you have violated these Terms or
                    engaged in conduct that harms Chimera or other users.
                </Paragraph>

                <SectionTitle>11. Changes to the Terms of Service</SectionTitle>
                <Paragraph>
                    We may modify or update these Terms from time to time. We will notify you of any
                    material changes by posting the updated Terms on Chimera or through other
                    appropriate communication channels. Your continued use of Chimera after the
                    effective date of the revised Terms constitutes your acceptance of the changes.
                </Paragraph>

                <SectionTitle>12. Contact Us</SectionTitle>
                <Paragraph>
                    If you have any questions, concerns, or requests regarding these Terms of
                    Service, please contact us at:{' '}
                    <a href='mailto:contact@voistory.ai'>contact@voistory.ai</a>.
                </Paragraph>

                <Paragraph style={{ fontStyle: 'italic', marginTop: '2rem' }}>
                    <strong>Disclaimer:</strong> This template is for informational purposes and
                    does not constitute legal advice. Always consult an attorney familiar with your
                    jurisdiction’s laws and the specifics of your business to ensure full legal
                    compliance.
                </Paragraph>
            </TermsContainer>
            <Footer background_color='#333' font_color='#fff' />
        </Container>
    );
};

export default TermsOfService;
