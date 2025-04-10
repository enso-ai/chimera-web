import { Fragment, useState, useCallback } from 'react';
import { styled } from 'styled-components';
import Switch from './Switch';

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
    gap: 20px;
    max-height: 90vh;
    overflow-y: auto; /* Enable scroll if content overflows */
`;

const ModalTitle = styled.h2`
    font-size: 1.5em;
    font-weight: bold;
    color: #333;
    margin: 0 0 10px 0;
    text-align: center;
`;

const Section = styled.div`
    border-top: 1px solid #eee;
    padding-top: 20px;
`;

const SectionTitle = styled.h3`
    font-size: 1.1em;
    font-weight: 600;
    color: #495057;
    margin-bottom: 15px;
`;

const FormRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    gap: 10px;
`;

const FormLabel = styled.label`
    color: #495057;
    flex-basis: 60%;
`;

const FormInput = styled.input`
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1em;
    flex-grow: 1;
    max-width: 100px;

    &:disabled {
        background-color: #f8f9fa;
        cursor: not-allowed;
        border-color: #e9ecef;
        color: #adb5bd;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 10px;
    border-top: 1px solid #eee;
    padding-top: 20px;
`;

const Button = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1em;
    font-weight: 500;
    transition: background-color 0.2s ease;
`;

const SaveButton = styled(Button)`
    background-color: #ffc107;
    color: #333;

    &:hover {
        background-color: #e0a800;
    }
`;

const CancelButton = styled(Button)`
    background-color: #f8f9fa;
    color: #495057;
    border: 1px solid #dee2e6;

    &:hover {
        background-color: #e9ecef;
    }
`;

const ErrorMessage = styled.div`
    color: red;
    font-size: 0.9em;
    min-height: 1.2em;
    text-align: center;
    margin-top: 10px;
`;

const StyledSwitch = styled(Switch)`
  margin-left: auto;
`;

const DisabledLabel = styled(FormLabel)`
    color: #adb5bd;
`;

export default function PostSettingDisplay({ settings, onClose, onSave }) {
    const [error, setError] = useState(null);

    const {
        schedule_enabled,
        post_amount,
        post_interval,
        alert_enabled,
        alert_trigger_threshold = 5, // Default value
        alert_email_destination,
    } = settings || {};

    const [formData, setFormData] = useState({
        schedule_enabled: schedule_enabled ?? false,
        post_amount: post_amount ?? '',
        post_interval: post_interval ?? '',
        alert_enabled: alert_enabled ?? false,
        alert_trigger_threshold: alert_trigger_threshold ?? 5,
        alert_email_destination: alert_email_destination ?? '',
    });

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }, []);

    const validateForm = useCallback(() => {
        const { alert_enabled, alert_email_destination, post_amount, post_interval, alert_trigger_threshold } = formData;
        if (alert_enabled) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!alert_email_destination || !emailRegex.test(alert_email_destination)) {
                setError('Please enter a valid email address.');
                return false;
            }
        }

        if (!post_amount || parseInt(post_amount) < 1) {
            setError('Post amount must be at least 1.');
            return false;
        }

        if (!post_interval || parseInt(post_interval) < 1) {
            setError('Post interval must be at least 1.');
            return false;
        }

         if (alert_enabled && (!alert_trigger_threshold || parseInt(alert_trigger_threshold) < 1)) {
            setError('Alert trigger threshold must be at least 1.');
            return false;
        }

        setError(null);
        return true;
    }, [formData]);

    const handleSave = useCallback(() => {
        if (validateForm()) {
            onSave(formData);
        }
    }, [formData, onSave, validateForm]);

    const isAlertEnabled = formData.alert_enabled;

    return (
        <Fragment>
            <Overlay onClick={onClose} />
            <MenuContainer>
                <ModalTitle>Posting Schedule Settings</ModalTitle>

                <Section>
                    <SectionTitle>Posting Rules</SectionTitle>
                    <FormRow>
                        <FormLabel htmlFor="post_amount">Number of posts per interval:</FormLabel>
                        <FormInput
                            type="number"
                            id="post_amount"
                            name="post_amount"
                            value={formData.post_amount}
                            onChange={handleChange}
                            min="1"
                        />
                    </FormRow>
                    <FormRow>
                        <FormLabel htmlFor="post_interval">Time between posts (minutes):</FormLabel>
                        <FormInput
                            type="number"
                            id="post_interval"
                            name="post_interval"
                            value={formData.post_interval}
                            onChange={handleChange}
                            min="1"
                        />
                    </FormRow>
                    <FormRow>
                        <FormLabel htmlFor="schedule_enabled">Enable automatic posting:</FormLabel>
                        <StyledSwitch
                            id="schedule_enabled"
                            toggled={formData.schedule_enabled}
                            onChange={e => handleChange({ target: { name: 'schedule_enabled', value: e.target.checked, type: 'checkbox' } })}
                        />
                    </FormRow>
                </Section>

                <Section>
                    <SectionTitle>Alert Rules</SectionTitle>
                    <FormRow>
                        <FormLabel htmlFor="alert_enabled">Enable failure alerts:</FormLabel>
                        <StyledSwitch
                            id="alert_enabled"
                            toggled={formData.alert_enabled}
                            onChange={e => handleChange({ target: { name: 'alert_enabled', value: e.target.checked, type: 'checkbox' } })}
                        />
                    </FormRow>
                    <FormRow>
                        <DisabledLabel htmlFor="alert_email" className={isAlertEnabled ? '' : 'disabled'}>Send alerts to email:</DisabledLabel>
                        <FormInput
                            type="email"
                            id="alert_email"
                            name="alert_email_destination"
                            value={formData.alert_email_destination}
                            onChange={handleChange}
                            disabled={!isAlertEnabled}
                        />
                    </FormRow>
                    <FormRow>
                        <DisabledLabel htmlFor="alert_threshold" className={isAlertEnabled ? '' : 'disabled'}>Alert after consecutive failures:</DisabledLabel>
                        <FormInput
                            type="number"
                            id="alert_threshold"
                            name="alert_trigger_threshold"
                            value={formData.alert_trigger_threshold}
                            onChange={handleChange}
                            min="1"
                            disabled={!isAlertEnabled}
                        />
                    </FormRow>
                </Section>

                <ErrorMessage>{error}</ErrorMessage>

                <ButtonContainer>
                    <CancelButton onClick={onClose}>Cancel</CancelButton>
                    <SaveButton onClick={handleSave}>Save</SaveButton>
                </ButtonContainer>
            </MenuContainer>
        </Fragment>
    );
}
