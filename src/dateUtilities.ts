export function parseTimestampMonthYear(timestamp: number) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth();
    return { year, month };
}
export function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getTime();
}
export function getLastDayofMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getTime();
}
