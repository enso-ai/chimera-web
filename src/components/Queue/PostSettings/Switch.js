import React from 'react';
import styled from 'styled-components';

const SwitchInput = styled.input`
    height: 0;
    width: 0;
    visibility: hidden;
`;

const SwitchLabel = styled.label`
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    width: 35px;
    height: 16px;
    border-radius: 10px;
    border: 2px solid gray;
    position: relative;
    transition: background-color 0.2s;
    background-color: ${(props) => (props.$toggled ? props.$activeColor : props.$inactiveColor)};
`;

const SwitchButton = styled.span`
    content: '';
    position: absolute;
    top: 1.5px;
    left: 1px;
    width: 14px;
    height: 14px;
    border-radius: 10px;
    transition: 0.2s;
    background: #fff;
    box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);

    ${SwitchInput}:checked + ${SwitchLabel} & {
        left: calc(100% - 15px);
        transform: translateX(0%);
    }

    ${SwitchLabel}:active & {
        width: 20px;
    }
`;

const Switch = ({ id, toggled, onChange, activeColor = '#4CAF50', inactiveColor = '#ccc' }) => {
    return (
        <>
            <SwitchInput
                className='switch-checkbox'
                id={id}
                type='checkbox'
                checked={toggled}
                onChange={onChange}
            />
            <SwitchLabel className='switch-label' htmlFor={id} $toggled={toggled} $activeColor={activeColor} $inactiveColor={inactiveColor}>
                <SwitchButton className='switch-button' />
            </SwitchLabel>
        </>
    );
};

export default Switch;
