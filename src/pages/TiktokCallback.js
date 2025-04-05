import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { verifyTiktokToken } from '../services/backend';


export default function TiktokCallback() {
    const [displayText, setDisplayText] = useState('Verifying...');
    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const code = query.get('code');
        const state = query.get('state');

        const csrfState = localStorage.getItem('csrfState');
        if (csrfState !== state) {
            console.error('CSRF state mismatch');
            setDisplayText('CSRF state mismatch, please try again');
            return;
        }

        if (!code) {
            console.error('No code found');
            setDisplayText('no code can be found in url, please try again');
            return;
        }

        verifyTiktokToken(code).then((data) => {
            console.log("print data", data);
            // Navigate to channels tab with refresh parameter
            navigate('/app/channels?refresh=true');
        }).catch(error => {
            // Add basic error handling for the verification call
            console.error("Error verifying TikTok token:", error);
            setDisplayText(`Error verifying token: ${error.message || 'Unknown error'}`);
        });


    }, [navigate]);

    return (
        <div>
            <button onClick={() => window.location.href = '/'}>Go back</button>
            <h1>{displayText}</h1>
        </div>
    );
}
