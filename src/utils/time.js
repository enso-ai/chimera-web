/**
 * Converts a time string in HH:MM:SS format from UTC to PST (America/Los_Angeles).
 * Handles potential date changes due to timezone offset.
 * Returns time in HH:MM format for UI display/input.
 *
 * @param {string} utcTimeString - Time string in HH:MM:SS format (UTC).
 * @returns {string|null} - Time string in HH:MM format (PST), or null if input is invalid.
 */
export function convertUtcToPst(utcTimeString) {
    // Accept HH:MM:SS or HH:MM for flexibility, but expect HH:MM:SS from API
    if (!utcTimeString || !/^\d{2}:\d{2}(:\d{2})?$/.test(utcTimeString)) {
        console.warn('Invalid UTC time string format received:', utcTimeString);
        return null;
    }

    // Extract hours and minutes, ignore seconds for conversion logic based on HH:MM
    const [hoursUtc, minutesUtc] = utcTimeString.split(':').map(Number);

    // Create a date object set to today in UTC, with the given time
    const now = new Date();
    const dateInUtc = new Date(
        Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            hoursUtc,
            minutesUtc,
            0,
            0
        )
    );

    // Format the date object into PST time using Intl.DateTimeFormat
    try {
        const pstFormatter = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // Use 24-hour format
            timeZone: 'America/Los_Angeles',
        });
        // The formatter might return '24:MM', convert it to '00:MM'
        const formattedPst = pstFormatter.format(dateInUtc);
        return formattedPst.replace(/^24/, '00');
    } catch (error) {
        console.error('Error converting UTC to PST:', error);
        return null; // Timezone likely invalid or other Intl error
    }
}

/**
 * Converts a time string in HH:MM format from PST (America/Los_Angeles) to UTC HH:MM:SS format.
 * Handles potential date changes due to timezone offset.
 * Assumes seconds should be '00' when converting from HH:MM.
 *
 * @param {string} pstTimeString - Time string in HH:MM format (PST).
 * @returns {string|null} - Time string in HH:MM:SS format (UTC), or null if input is invalid.
 */
export function convertPstToUtc(pstTimeString) {
    if (!pstTimeString || !/^\d{2}:\d{2}$/.test(pstTimeString)) {
        console.warn('Invalid PST time string format received:', pstTimeString);
        return null;
    }

    const [hoursPst, minutesPst] = pstTimeString.split(':').map(Number);

    // Create a date object representing today in PST
    // We need a reference date in PST to correctly convert the time part to UTC
    const now = new Date(); // Local time
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    const day = now.getDate();

    // Construct a date string that JS Date constructor understands as local (PST assumed)
    // Format: YYYY-MM-DDTHH:mm:ss
    // Need to pad month and day
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const localDateString = `${year}-${monthStr}-${dayStr}T${pstTimeString}:00`;

    try {
        const dateInPst = new Date(localDateString);

        // Check if the date construction was valid
        if (isNaN(dateInPst.getTime())) {
            console.error('Invalid date constructed for PST time:', localDateString);
            return null;
        }

        // Get UTC hours, minutes, and seconds (seconds will be 0 based on input)
        const hoursUtc = String(dateInPst.getUTCHours()).padStart(2, '0');
        const minutesUtc = String(dateInPst.getUTCMinutes()).padStart(2, '0');
        // Return in HH:MM:SS format as expected by the API
        return `${hoursUtc}:${minutesUtc}:00`;
    } catch (error) {
        console.error('Error converting PST to UTC:', error);
        return null;
    }
}


/**
 * Rounds a time string in HH:MM format up to the nearest 10 minutes.
 * Still operates on HH:MM as this is the format used by the time input.
 *
 * @param {string} timeString - Time string in HH:MM format.
 * @returns {string|null} - Rounded time string in HH:MM format, or null if input is invalid.
 */
export function roundTimeUpToNearest10Minutes(timeString) {
    if (!timeString || !/^\d{2}:\d{2}$/.test(timeString)) {
         console.warn('Invalid time string format for rounding:', timeString);
        return null;
    }

    let [hours, minutes] = timeString.split(':').map(Number);

    if (minutes % 10 !== 0) {
        const minutesToAdd = 10 - (minutes % 10);
        minutes += minutesToAdd;

        if (minutes >= 60) {
            hours += 1;
            minutes -= 60;
            if (hours >= 24) {
                hours = 0; // Rollover day, reset hours to 00
            }
        }
    }

    const roundedHours = String(hours).padStart(2, '0');
    const roundedMinutes = String(minutes).padStart(2, '0');

    return `${roundedHours}:${roundedMinutes}`;
}
