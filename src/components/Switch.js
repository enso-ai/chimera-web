import styled from 'styled-components';

const SwitchContainer = styled.div`
    width: fit-content;
`;

const SwitchLabel = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
    width: 45px;
    height: 20px;
    border-radius: 20px;
    border: 2px solid gray;
    position: relative;
    transition: background-color 0.2s, opacity 0.2s;
    background-color: ${(props) =>
        props.$disabled
            ? '#ccc' // Disabled color
            : props.$toggled
            ? props.$activeColor
            : props.$inactiveColor};
    opacity: ${(props) => (props.$disabled ? 0.6 : 1)};
`;

const SwitchButton = styled.span`
    position: absolute;
    top: 2px;
    left: ${(props) => (props.$toggled ? 'calc(100% - 18px)' : '2px')};
    width: 16px;
    height: 16px;
    border-radius: 8px;
    transition: left 0.2s ease-in-out, background-color 0.2s;
    background: ${(props) => (props.$disabled ? '#eee' : '#fff')};
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);


    ${SwitchLabel}:active & {
        width: ${(props) => (props.$disabled ? '16px' : '15px')}; // Prevent active shrink when disabled
    }
`;

export default function Switch({ toggled, onChange, activeColor, inactiveColor, disabled = false }) {
    const handleClick = () => {
        if (!disabled) {
            onChange(!toggled);
        }
    };

    return (
        <SwitchContainer>
            <SwitchLabel
                className='switch-label'
                onClick={handleClick}
                $toggled={toggled}
                $activeColor={activeColor}
                $inactiveColor={inactiveColor}
                $disabled={disabled}
            >
                <SwitchButton className='switch-button' $toggled={toggled} $disabled={disabled} />
            </SwitchLabel>
        </SwitchContainer>
    );
}
