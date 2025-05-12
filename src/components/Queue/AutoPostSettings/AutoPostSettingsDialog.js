import { useState, useCallback, useEffect } from 'react';
import { styled } from 'styled-components';
import { ConfirmButton, CancelButton } from 'components/Button';
import Modal from 'components/Modal';
import Switch from 'components/Switch';
import { convertUtcToPst, convertPstToUtc, roundTimeUpToNearest10Minutes } from 'utils/time';

const MenuContainer = styled.div`
    padding: 24px 40px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* Adjusted rows to accommodate new time input and helper text */
    grid-template-rows: auto auto auto auto auto;
    gap: 15px; /* Slightly reduced gap */
    align-items: center;
    width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    background-color: #fff;
    border-radius: 12px;
`;

const ModalTitle = styled.h2`
    font-size: 1.5em;
    font-weight: bold;
    color: #333;
    margin: 0 0 10px 0;
    text-align: center;
    grid-column: 1 / -1;
`;

const Section = styled.div`
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* Adjusted rows for schedule section */
    grid-template-rows: auto auto auto auto auto;
    gap: 10px;

    border-top: 1px solid #eee;
    padding-top: 10px;
`;

const SectionTitle = styled.h3`
    font-size: 1.1em;
    font-weight: 600;
    color: #495057;
    margin: 0;
    justify-self: start;
    align-self: center;
`;

const SwitchContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

const FormLabel = styled.label`
    color: #495057;
    color: #495057;
    justify-self: start;
    align-self: center; /* Align vertically */
    line-height: 1.5; /* Ensure text aligns well with input */
`;

const FormInput = styled.input`
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1em;
    max-width: 200px;
    justify-self: end;

    &:disabled {
        background-color: #f8f9fa;
        cursor: not-allowed;
        border-color: #e9ecef;
        color: #adb5bd;
    }
`;

// Container for HH:MM inputs
const TimeInputContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    justify-self: end; /* Align the container to the right */
`;

const TimeInput = styled(FormInput)`
    max-width: 60px; /* Smaller width for HH/MM */
    text-align: center;
    /* Remove spinner arrows for number input */
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;

const TimeSeparator = styled.span`
    font-size: 1.2em;
    font-weight: bold;
    color: #495057;
`;

const ButtonsWrapper = styled.div`
    display: flex;
    justify-content: space-around;
    gap: 10px;
    grid-column: 1 / -1;
    padding-top: 15px;
    border-top: 1px solid #eee;
`;

const ErrorMessage = styled.div`
    color: red;
    font-size: 0.9em;
    min-height: 1.2em;
    text-align: center;
    grid-column: 1 / -1;
`;

const DisabledLabel = styled(FormLabel)`
    color: #adb5bd;
`;

const HelperText = styled.p`
    font-size: 0.8em;
    color: #6c757d;
    margin: -5px 0 5px 0; /* Adjust spacing */
    grid-column: 2 / 3; /* Align under the input */
    justify-self: end;
`;

export default function AutoPostSettingDialog({ settings, onClose, onSave }) {
    const [error, setError] = useState(null);
    // Initialize state from settings prop
    const [scheduleEnabled, setScheduleEnabled] = useState(settings?.schedule_enabled ?? false);
    const [postAmount, setPostAmount] = useState(settings?.post_amount?.toString() ?? '1');
    const [postInterval, setPostInterval] = useState(settings?.post_interval?.toString() ?? '1');
    // Initialize separate hour and minute states
    const initialPstTime = convertUtcToPst(settings?.post_time) ?? '09:00';
    const [initialHour, initialMinute] = initialPstTime.split(':');
    const [postHour, setPostHour] = useState(initialHour);
    const [postMinute, setPostMinute] = useState(initialMinute);
    const [alertEnabled, setAlertEnabled] = useState(settings?.alert_enabled ?? false);
    const [alertTriggerThreshold, setAlertTriggerThreshold] = useState(
        settings?.alert_trigger_threshold ?? 5
    );
    const [alertEmailDestination, setAlertEmailDestination] = useState(
        settings?.alert_email_destination ?? ''
    );

    // Effect to update state if settings prop changes externally
    useEffect(() => {
        setScheduleEnabled(settings?.schedule_enabled ?? false);
        setPostAmount(settings?.post_amount?.toString() ?? '1');
        setPostInterval(settings?.post_interval?.toString() ?? '1');
        // Update hour/minute state when settings change
        const pstTime = convertUtcToPst(settings?.post_time) ?? '09:00';
        const [hour, minute] = pstTime.split(':');
        setPostHour(hour);
        setPostMinute(minute);
        setAlertEnabled(settings?.alert_enabled ?? false);
        setAlertTriggerThreshold(settings?.alert_trigger_threshold ?? 5);
        setAlertEmailDestination(settings?.alert_email_destination ?? '');
    }, [settings]);

    const validateForm = useCallback(() => {
        setError(null); // Reset error on each validation

        if (scheduleEnabled) {
            if (!postAmount || parseInt(postAmount, 10) < 1) {
                setError('Post amount must be at least 1.');
                return false;
            }
            if (!postInterval || parseInt(postInterval, 10) < 1) {
                setError('Post interval must be at least 1 day.');
                return false;
            }
            // Validate hour and minute inputs
            const hourNum = parseInt(postHour, 10);
            const minuteNum = parseInt(postMinute, 10);
            if (isNaN(hourNum) || hourNum < 0 || hourNum > 23) {
                setError('Please enter a valid hour (00-23).');
                return false;
            }
            if (isNaN(minuteNum) || minuteNum < 0 || minuteNum > 59) {
                setError('Please enter valid minutes (00-59).');
                return false;
            }
        }

        if (alertEnabled) {
            if (!alertTriggerThreshold || parseInt(alertTriggerThreshold, 10) < 1) {
                setError('Alert trigger threshold must be at least 1.');
                return false;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!alertEmailDestination || !emailRegex.test(alertEmailDestination)) {
                setError('Please enter a valid email address for alerts.');
                return false;
            }
        }

        return true; // Validation passed
    }, [
        scheduleEnabled,
        postAmount,
        postInterval,
        postHour,
        postMinute,
        alertEnabled,
        alertTriggerThreshold,
        alertEmailDestination,
    ]);

    const handleSave = useCallback(() => {
        if (validateForm()) {
            let finalPostTimeUtc = null;
            if (scheduleEnabled) {
                // Combine hour and minute, ensuring leading zeros
                const formattedHour = String(postHour).padStart(2, '0');
                const formattedMinute = String(postMinute).padStart(2, '0');
                const combinedPstTime = `${formattedHour}:${formattedMinute}`;

                const roundedPst = roundTimeUpToNearest10Minutes(combinedPstTime);
                if (roundedPst) {
                    finalPostTimeUtc = convertPstToUtc(roundedPst);
                } else {
                    // This case should ideally be prevented by validateForm
                    setError('Invalid time entered.');
                    return;
                }
            }

            const payload = {
                schedule_enabled: scheduleEnabled,
                // Only include schedule details if enabled
                ...(scheduleEnabled && {
                    post_amount: parseInt(postAmount, 10),
                    post_interval: parseInt(postInterval, 10),
                    post_time: finalPostTimeUtc, // Send UTC time, or null/undefined if not applicable
                }),
                // Always include alert details
                alert_enabled: alertEnabled,
                alert_trigger_threshold: parseInt(alertTriggerThreshold, 10),
                alert_email_destination: alertEmailDestination,
            };

            // Clean up payload: remove post_time if it's null and schedule is off
            // The API might handle null, but let's be explicit if schedule is off
            if (!scheduleEnabled) {
                delete payload.post_amount;
                delete payload.post_interval;
                delete payload.post_time;
            } else if (payload.post_time === null) {
                // If schedule is on but time conversion failed (shouldn't happen with validation)
                // or if we decide null shouldn't be sent, handle here.
                // For now, we send null if schedule is on but time is invalid/empty after rounding/conversion.
                // Let's refine: only send post_time if it's a valid UTC string.
                if (!finalPostTimeUtc) {
                    delete payload.post_time; // Don't send invalid time
                }
            }

            onSave(payload);
        }
    }, [
        validateForm,
        scheduleEnabled,
        postAmount,
        postInterval,
        postHour,
        postMinute,
        alertEnabled,
        alertTriggerThreshold,
        alertEmailDestination,
        onSave,
    ]);

    const PostingRules = (
        <Section>
            <SectionTitle>Schedule Posting</SectionTitle>
            <SwitchContainer>
                <Switch
                    toggled={scheduleEnabled}
                    activeColor='#4CAF50'
                    inactiveColor='#adb5bd'
                    onChange={setScheduleEnabled}
                />
            </SwitchContainer>

            {/* Post Amount */}
            <DisabledLabel htmlFor='post_amount' className={scheduleEnabled ? '' : 'disabled'}>
                Number of posts per interval:
            </DisabledLabel>
            <FormInput
                id='post_amount'
                type='number'
                name='post_amount'
                value={postAmount}
                onChange={(e) => setPostAmount(e.target.value)}
                min='1'
                disabled={!scheduleEnabled}
            />

            {/* Post Interval */}
            <DisabledLabel htmlFor='post_interval' className={scheduleEnabled ? '' : 'disabled'}>
                Time between posts (days):
            </DisabledLabel>
            <FormInput
                id='post_interval'
                type='number'
                name='post_interval'
                value={postInterval}
                onChange={(e) => setPostInterval(e.target.value)}
                min='1'
                disabled={!scheduleEnabled}
            />

            {/* Post Time HH:MM */}
            <DisabledLabel htmlFor='post_hour' className={scheduleEnabled ? '' : 'disabled'}>
                Time to post:
            </DisabledLabel>
            <TimeInputContainer>
                <TimeInput
                    id='post_hour'
                    type='number'
                    name='post_hour'
                    value={postHour}
                    onChange={(e) => setPostHour(e.target.value)}
                    placeholder='HH'
                    min='0'
                    max='23'
                    disabled={!scheduleEnabled}
                />
                <TimeSeparator>:</TimeSeparator>
                <TimeInput
                    id='post_minute'
                    type='number'
                    name='post_minute'
                    value={postMinute}
                    onChange={(e) => setPostMinute(e.target.value)}
                    placeholder='MM'
                    min='0'
                    max='59'
                    disabled={!scheduleEnabled}
                />
            </TimeInputContainer>
            {scheduleEnabled && (
                <HelperText>
                    Note: Time will be rounded up to the nearest 10 minutes upon saving.
                </HelperText>
            )}
        </Section>
    );

    const AlertRules = (
        <Section>
            <SectionTitle>Alert Rules</SectionTitle>
            <SwitchContainer>
                <Switch
                    toggled={alertEnabled}
                    activeColor='#4CAF50'
                    inactiveColor='#adb5bd'
                    onChange={setAlertEnabled}
                />
            </SwitchContainer>
            <DisabledLabel htmlFor='alert_email' className={alertEnabled ? '' : 'disabled'}>
                Send alerts to email:
            </DisabledLabel>
            <FormInput
                type='email'
                name='alert_email_destination'
                value={alertEmailDestination}
                onChange={(e) => setAlertEmailDestination(e.target.value)}
                disabled={!alertEnabled}
            />
            <DisabledLabel htmlFor='alert_threshold' className={alertEnabled ? '' : 'disabled'}>
                Alert after consecutive failures:
            </DisabledLabel>
            <FormInput
                type='number'
                name='alert_trigger_threshold'
                value={alertTriggerThreshold}
                onChange={(e) => setAlertTriggerThreshold(e.target.value)}
                min='1'
                disabled={!alertEnabled}
            />
        </Section>
    );

    return (
        <Modal onClose={onClose}>
            <MenuContainer>
                <ModalTitle>Schedule Settings</ModalTitle>
                {PostingRules}
                {AlertRules}
                <ErrorMessage>{error}</ErrorMessage>
                <ButtonsWrapper>
                    <CancelButton onClick={onClose}>Cancel</CancelButton>
                    <ConfirmButton onClick={handleSave}>Save</ConfirmButton>
                </ButtonsWrapper>
            </MenuContainer>
        </Modal>
    );
}
