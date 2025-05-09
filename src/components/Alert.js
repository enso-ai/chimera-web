import React from "react";
import styled, { css } from "styled-components";
import {
    FaCheckCircle, FaInfoCircle, FaTimesCircle, FaExclamationTriangle
} from "react-icons/fa";

// Styled Alert container
const AlertContainer = styled.div`
    padding: 12px 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 8px;

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
`;

// Alert component that selects the appropriate icon based on severity
const Alert = ({ severity = "success", children, ...props }) => {
    // Determine which icon to use
    const getIcon = () => {
        switch (severity) {
            case "success":
                return <FaCheckCircle size={18} />;
            case "info":
                return <FaInfoCircle size={18}/>;
            case "warning":
                return <FaExclamationTriangle size={18}/>;
            case "error":
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

export default Alert;
