// const BASE_URL = 'https://tiktok-backend.v01s.com/api/';
const BASE_URL = 'http://127.0.0.1:8000/api/';

export const verifyTiktokToken = async (code) => {
    const data = {
        code: code,
    };

    const response = await fetch(BASE_URL + 'channels/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const json = await response.json();
    return json;
};

export const listChannels = async () => {
    // todo pull a list of token
    const params = new URLSearchParams({
        page_no: 1,
        page_size: 20,
    });

    const url = BASE_URL + 'channels/?' + params.toString();
    console.log('show url: ', url);
    const response = await fetch(url, { method: 'GET', mode: 'cors' });

    const json = await response.json();
    return json;
};

export const downloadChannels = async () => {
    // return file blob
    const response = await fetch(BASE_URL + 'channels/export', {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Failed to download file');
    }

    // Create a downloadable link
    const blob = await response.blob();
    return blob;
};

export const uploadChannels = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(BASE_URL + 'channels/import', {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Failed to upload file');
    }

    return data;
};
