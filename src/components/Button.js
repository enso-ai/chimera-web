import { styled } from 'styled-components';
import { ButtonColors } from '../constants'; // Import color constants

// Helper function to determine text color based on background
const getTextColor = (bgColor) => {
    // Simple check for light backgrounds (adjust threshold as needed)
    // For more robust solution, consider a library like 'color'
    if (
        bgColor === ButtonColors.WARNING ||
        bgColor === ButtonColors.DISABLED
    ) {
        return '#333'; // Dark text for light backgrounds
    }
    return 'white'; // White text for dark backgrounds
};

// Helper function to lighten/darken colors for hover effect
// Basic implementation, consider a library for more precision if needed
const shadeColor = (color, percent) => {
    // Handle potential invalid color input gracefully
    if (!color || typeof color !== 'string' || color.length < 6) {
        console.warn(`Invalid color passed to shadeColor: ${color}`);
        return color || '#000000'; // Return original or black if invalid
    }

    try {
        let R = parseInt(color.substring(1, 3), 16);
        let G = parseInt(color.substring(3, 5), 16);
        let B = parseInt(color.substring(5, 7), 16);

        R = parseInt((R * (100 + percent)) / 100);
        G = parseInt((G * (100 + percent)) / 100);
        B = parseInt((B * (100 + percent)) / 100);

        R = R < 255 ? R : 255;
        G = G < 255 ? G : 255;
        B = B < 255 ? B : 255;

        R = Math.round(R);
        G = Math.round(G);
        B = Math.round(B);

        const RR = R.toString(16).length === 1 ? '0' + R.toString(16) : R.toString(16);
        const GG = G.toString(16).length === 1 ? '0' + G.toString(16) : G.toString(16);
        const BB = B.toString(16).length === 1 ? '0' + B.toString(16) : B.toString(16);

        return '#' + RR + GG + BB;
    } catch (error) {
        console.error(`Error shading color ${color}:`, error);
        return color; // Return original color on error
    }
};

// Internal styled component - receives computed styles as props
const StyledButton = styled.button`
    padding: 10px 20px;
    border-radius: 6px;
    font-size: ${props=> props.fontSize || '1em'};
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease, filter 0.2s ease;
    min-width: 100px;

    background-color: ${(props) => props.bgColor};
    color: ${(props) => props.textColor};
    border: 1px solid ${(props) => props.borderColor};

    &:hover:not(:disabled) {
        background-color: ${(props) => props.hoverBgColor};
        border-color: ${(props) => props.hoverBorderColor};
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px ${(props) => props.focusColor}40; // Use focusColor prop
    }

    &:disabled {
        /* FILTER APPROACH: Keep original color but apply grayscale filter */
        filter: grayscale(40%) brightness(0.95);
        cursor: not-allowed;
        opacity: 0.7;
    }
`;

// Functional Button component - computes styles and passes them to StyledButton
export const Button = ({
    variant = 'primary',
    color, // Direct background color override
    textColor, // Direct text color override
    borderColor, // Direct border color override
    disabled,
    children,
    ...props // Pass any other standard button props (like onClick, type, etc.)
}) => {
    // --- Style Computation ---

    // 1. Set default values (based on 'primary' variant initially)
    let baseBgColor = ButtonColors.PRIMARY;
    let baseHoverBgColor = shadeColor(ButtonColors.PRIMARY, +25);
    let baseTextColor = 'white';
    let baseBorderColor = 'transparent'; // Primary has no visible border
    let baseHoverBorderColor = 'transparent';

    // 2. Apply variant styling (overrides defaults)
    switch (variant) {
        case 'secondary':
            baseBgColor = ButtonColors.SECONDARY;
            baseHoverBgColor = shadeColor(ButtonColors.SECONDARY, -5);
            baseTextColor = '#333'; // Dark text for light gray
            baseBorderColor = '#ddd'; // Visible border for secondary
            baseHoverBorderColor = '#ccc';
            break;
        case 'warning':
            baseBgColor = ButtonColors.WARNING;
            baseHoverBgColor = shadeColor(ButtonColors.WARNING, -10);
            baseTextColor = '#333'; // Dark text for yellow
            // Border color defaults to transparent
            break;
        case 'danger':
            baseBgColor = ButtonColors.DANGER;
            baseHoverBgColor = shadeColor(ButtonColors.DANGER, -10);
            // Text color defaults to white
            // Border color defaults to transparent
            break;
        case 'positive':
            baseBgColor = ButtonColors.POSITIVE;
            baseHoverBgColor = shadeColor(ButtonColors.POSITIVE, -10);
            // Text color defaults to white
            // Border color defaults to transparent
            break;
        case 'negative':
            baseBgColor = ButtonColors.NEGATIVE;
            baseHoverBgColor = shadeColor(ButtonColors.NEGATIVE, -10);
            // Text color defaults to white
            // Border color defaults to transparent
            break;
        // Add more variants if needed
    }

    // 3. Apply direct color overrides (if provided)
    // When 'color' (background) is provided, reset others to primary defaults unless also overridden
    let finalBgColor = baseBgColor;
    let finalHoverBgColor = baseHoverBgColor;
    let finalTextColor = baseTextColor;
    let finalBorderColor = baseBorderColor;
    let finalHoverBorderColor = baseHoverBorderColor;

    if (color) {
        finalBgColor = color;
        finalHoverBgColor = shadeColor(color, +25);
        // Reset others to primary defaults when background color is overridden
        finalTextColor = getTextColor(color); // Determine text color based on the new background
        finalBorderColor = 'transparent'; // Reset border to primary default
        finalHoverBorderColor = 'transparent'; // Reset hover border to primary default
    }

    // Allow explicit overrides for text and border color *after* the main background override logic
    if (textColor) {
        finalTextColor = textColor;
    }
    if (borderColor) {
        finalBorderColor = borderColor;
        // If border is explicitly set, maybe hover border should match? Or stay transparent?
        // Let's keep hover border based on variant/primary default unless explicitly set.
        // finalHoverBorderColor = borderColor; // Optional: make hover border match explicit border
    }

    // 4. Calculate focus color based on the final background color
    const focusColor = shadeColor(finalBgColor, -30);

    // --- Rendering ---
    return (
        <StyledButton
            bgColor={finalBgColor}
            hoverBgColor={finalHoverBgColor}
            textColor={finalTextColor}
            borderColor={finalBorderColor}
            hoverBorderColor={finalHoverBorderColor} // Use the computed hover border color
            focusColor={focusColor}
            disabled={disabled}
            {...props} // Spread remaining props onto the button element
        >
            {children}
        </StyledButton>
    );
};

// convenience exports using the new functional component structure
export const ConfirmButton = (props) => <Button variant='positive' {...props} />;

export const CancelButton = (props) => <Button variant='negative' {...props} />;
