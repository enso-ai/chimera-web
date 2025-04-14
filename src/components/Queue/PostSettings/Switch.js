import styled from 'styled-components';

const SwitchContainer = styled.div`
    width: fit-content;
`;

const SwitchLabel = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    width: 45px;
    height: 20px;
    border-radius: 20px;
    border: 2px solid gray;
    position: relative;
    transition: background-color 0.2s;
    background-color: ${(props) => (props.$toggled ? props.$activeColor : props.$inactiveColor)};
`;

const SwitchButton = styled.span`
    position: absolute;
    top: 2px;
    left: ${(props) => (props.$toggled ? 'calc(100% - 18px)' : '2px')};
    width: 16px;
    height: 16px;
    border-radius: 8px;
    transition: left 0.2s ease-in-out;
    background: #fff;

    ${SwitchLabel}:active & {
        width: 15px;
    }
`;

export default function Switch({ toggled, onChange, activeColor, inactiveColor }) {
    return (
        <SwitchContainer>
            <SwitchLabel
                className='switch-label'
                onClick={() => onChange(!toggled)}
                $toggled={toggled}
                $activeColor={activeColor}
                $inactiveColor={inactiveColor}
            >
                <SwitchButton className='switch-button' $toggled={toggled} />
            </SwitchLabel>
        </SwitchContainer>
    );
}
