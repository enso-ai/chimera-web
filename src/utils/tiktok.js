// util function related to tiktok
import { CLIENT_KEY, REDIRECT_PATH } from 'constants';

export const redirectToTiktokSignin = (withPosting = false) => {
    const csrfState = Math.random().toString(36).substring(2); // Generate CSRF state
    const scope = 'user.info.basic,user.info.stats,user.info.profile,video.list'; // scope without posting
    if (withPosting) {
        scope = 'user.info.basic,user.info.stats,user.info.profile,video.list,video.publish'; // scope with posting
    }

    // Store csrfState in localStorage.  This is client-side storage, but it's
    // temporary and only for this initial redirect.  A more robust approach
    // would involve a quick server-side set/get for the state.
    localStorage.setItem('csrfState', csrfState);

    let url = 'https://www.tiktok.com/v2/auth/authorize/';
    // Template literals for cleaner string construction and encode all components
    url += `?client_key=${encodeURIComponent(CLIENT_KEY)}`;
    url += `&scope=${encodeURIComponent(scope)}`; // Default scope, encoded
    url += '&response_type=code';
    // URL-encode the redirect URI!
    const redirectURL = window.location.origin + REDIRECT_PATH;
    url += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
    url += `&state=${encodeURIComponent(csrfState)}`; // Encode state

    window.location.href = url;
};
