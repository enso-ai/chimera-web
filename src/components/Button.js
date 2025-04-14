import { styled } from 'styled-components';

export const Button = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1em;
    font-weight: 500;
    transition: background-color 0.2s ease;
`;

export const ConfirmButton = styled(Button)`
    background-color: #ffc107;
    color: #333;

    &:hover {
        background-color: #e0a800;
    }
`;

export const CancelButton = styled(Button)`
    background-color: #f8f9fa;
    color: #495057;
    border: 1px solid #dee2e6;

    &:hover {
        background-color: #e9ecef;
    }
`;