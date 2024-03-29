import { format } from 'date-fns';

/**
 * The html datetime local input requires this specific format
 */
export function convertToDateTimeLocalFormat(date: Date | string = new Date()) {
    return format(date, "yyyy-MM-dd'T'HH:mm");
}

export function formatDateForDisplay(date: Date | string) {
    return format(date, 'yyyy-MM-dd HH:mm');
}
