export class DateUtilities {
  public parseTimestampMonthYear(timestamp: number) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth();
    return { year, month };
  }

  public getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getTime();
  }

  public getLastDayofMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getTime();
  }

  public getFirstDayofYear(year: number) {
    return new Date(year, 0, 1).getTime();
  }

  public getLastDayofYear(year: number) {
    return new Date(year, 11, 31).getTime();
  }
}
