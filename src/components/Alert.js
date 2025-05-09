import styled, { css } from "styled-components";

// Styled Alert component
const Alert = styled.div`
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
                color: rgba(0, 0, 0, 0.8);
                &:before {
                    content: "✔";
                    margin-right: 8px;
                }
            `,
            info: css`
                background-color: rgba(52, 152, 219, 0.6);
                color: rgba(0, 0, 0, 0.8);
                &:before {
                    content: "ⓘ";
                    margin-right: 8px;
                }
            `,
            warning: css`
                background-color: rgba(241, 196, 15, 0.6);
                color: rgba(0, 0, 0, 0.8);
                &:before {
                    content: "⚠";
                    margin-right: 8px;
                }
            `,
            error: css`
                background-color: rgba(231, 76, 60, 0.6);
                color: rgba(0, 0, 0, 0.8);
                &:before {
                    content: "✖";
                    margin-right: 8px;
                }
            `,
        };
        return styles[props.severity] || styles.success; // Default to success
    }}
`;

export default Alert;
