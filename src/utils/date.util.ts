export function formatDateToOracle(dateStr: string): string {
    // Parse input date string (DD/MM/YYYY HH:mm:ss)
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hours, minutes, seconds] = timePart ? timePart.split(':') : ['00', '00', '00'];

    // Validate date components
    if (!day || !month || !year || !hours || !minutes || !seconds) {
        throw new Error('Invalid date format. Expected format: DD/MM/YYYY HH:mm:ss');
    }

    // Format to Oracle date format (YYYYMMDDHHmmss)
    return `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}${hours.padStart(2, '0')}${minutes.padStart(2, '0')}${seconds.padStart(2, '0')}`;
}

export function parseInputDate(dateStr: string): Date {
    // Parse input date string (DD/MM/YYYY HH:mm:ss)
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hours, minutes, seconds] = timePart ? timePart.split(':') : ['00', '00', '00'];

    // Validate date components
    if (!day || !month || !year || !hours || !minutes || !seconds) {
        throw new Error('Invalid date format. Expected format: DD/MM/YYYY HH:mm:ss');
    }

    // Create Date object (month is 0-based in JavaScript)
    return new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds)
    );
} 