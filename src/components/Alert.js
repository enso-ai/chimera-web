import React from "react";
import styled, { css } from "styled-components";
import {
    FaCheckCircle, FaInfoCircle, FaTimesCircle, FaExclamationTriangle
} from "react-icons/fa";
import {
    useAlerts, ALERT_SUCCESS, ALERT_INFO, ALERT_WARNING, ALERT_ERROR
} from "hocs/alert";

// Styled Alert container
const AlertContainer = styled.div`
    padding: 12px 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 8px;
    // min-width: 300px;
    // max-width: 100vw;

    // Base styles
    ${(props) => {
        const styles = {
            success: css`
                background-color: rgba(46, 204, 113, 0.6);
                color: rgba(0, 0, 0, 0.7);
            `,
            info: css`
                background-color: rgba(52, 152, 219, 0.6);
                color: rgba(0, 0, 0, 0.7);
            `,
            warning: css`
                background-color: rgba(241, 196, 15, 0.6);
                color: rgba(0, 0, 0, 0.7);
            `,
            error: css`
                background-color: rgba(231, 76, 60, 0.6);
                color: rgba(0, 0, 0, 0.7);
            `,
        };
        return styles[props.severity] || styles.success; // Default to success
    }}
`;

// Icon wrapper for consistent spacing
const IconWrapper = styled.span`
    margin-right: 8px;
    display: flex;
    align-items: center;

    gap: 8px;
`;

// Alert component that selects the appropriate icon based on severity
const Alert = ({ severity = ALERT_WARNING, children, ...props }) => {
    // Determine which icon to use
    const getIcon = () => {
        switch (severity) {
            case ALERT_SUCCESS:
                return <FaCheckCircle size={18} />;
            case ALERT_INFO:
                return <FaInfoCircle size={18}/>;
            case ALERT_WARNING:
                return <FaExclamationTriangle size={18}/>;
            case ALERT_ERROR:
                return <FaTimesCircle size={18}/>;
            default:
                return <FaExclamationTriangle size={18}/>;
        }
    };

    return (
        <AlertContainer severity={severity} {...props}>
            <IconWrapper>{getIcon()}</IconWrapper>
            {children}
        </AlertContainer>
    );
};

const AlertListContainer = styled.div`
    position: fixed;
    top: 80px;
    min-width: 100vw;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    z-index: 1000;
    max-width: 300px;
`;

export const AlertList = () => {
    const { alerts } = useAlerts();

    return (
        <AlertListContainer>
            {alerts.map((alert) => (
                <Alert key={alert.id} severity={alert.severity}>
                    {alert.message}
                </Alert>
            ))}
        </AlertListContainer>
    )
}

export default Alert;
