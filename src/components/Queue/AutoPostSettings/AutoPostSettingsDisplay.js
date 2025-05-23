import styled from 'styled-components';
import { FaBell, FaBellSlash } from 'react-icons/fa6';
import { convertUtcToPst } from 'utils/time';

import Switch from 'components/Switch';

const WidgetContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
`;

const ClickableArea = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 8px;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #bfbfbf;
    }
`;

const FrequencyText = styled.span`
    font-size: 16px;
    white-space: nowrap;
    color: ${(props) => (props.disabled ? '#adb5bd' : '#495057')};
    transition: color 0.3s ease;
`;

const IconPlaceholder = styled.span`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    min-width: 20px;
    text-align: center;
    color: ${(props) => (props.disabled ? '#adb5bd' : props.$alertEnabled ? '#ffc107' : '#6c757d')};
    transition: color 0.3s ease;
`;

const Separator = styled.span`
    border-left: 1px solid #dee2e6;
    height: 20px;
    margin-left: 10px;
`;

export default function PostSettingDisplay({ settings, onToggle, onOpenSettings }) {
    if (!settings) {
        return <></>; // Return empty fragment if no settings
    }

    const { schedule_enabled, post_amount, post_interval, post_time, alert_enabled } = settings;
    console.log('post_time', post_time);

    const vidText = post_amount === 1 ? 'vid' : 'vids';
    const dayText = post_interval === 1 ? 'day' : 'days';
    let frequencyText = `${post_amount} ${vidText} / ${post_interval} ${dayText}`;

    // Add the post time if schedule is enabled and time is set
    if (post_time) {
        const pstTime = convertUtcToPst(post_time);
        console.log('localized pstTime', pstTime);
        if (pstTime) {
            // Basic AM/PM formatting for display
            const [hour, minute] = pstTime.split(':');
            const hourNum = parseInt(hour, 10);
            const ampm = hourNum >= 12 ? 'PM' : 'AM';
            const displayHour = hourNum % 12 === 0 ? 12 : hourNum % 12; // Convert 0/12 to 12
            const formattedTime = `${displayHour}:${minute} ${ampm} PST`;
            frequencyText += ` at ${formattedTime}`;
        }
    }

    return (
        <WidgetContainer>
            <Switch
                id='autoPostEnabled'
                toggled={schedule_enabled}
                onChange={onToggle}
                activeColor='#4CAF50' // Green
                inactiveColor='#dc3545' // Red
            />
            <Separator />
            <ClickableArea title='Click to edit settings' onClick={onOpenSettings}>
                <FrequencyText disabled={!schedule_enabled}>{frequencyText}</FrequencyText>
                {alert_enabled ? (
                    <IconPlaceholder
                        $alertEnabled
                        disabled={!schedule_enabled}
                        title='Alerts Enabled'
                    >
                        <FaBell />
                    </IconPlaceholder>
                ) : (
                    <IconPlaceholder
                        $alertEnabled={false}
                        disabled={!schedule_enabled}
                        title='Alerts Disabled'
                    >
                        <FaBellSlash size={16} />
                    </IconPlaceholder>
                )}
            </ClickableArea>
        </WidgetContainer>
    );
}
