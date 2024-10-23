import * as dayjs from 'dayjs';

export const dateHelper = {
  date(date?: string | Date): Date {
    return dayjs(date).toDate();
  },

  dateInFuture(
    n: number,
    unite: dayjs.ManipulateType,
    date?: string | Date,
  ): Date {
    return dayjs(date).add(n, unite).toDate();
  },

  isPast(date: Date): boolean {
    return dayjs(date).isBefore(dayjs());
  },

  getDateInPast(n: number, unite: dayjs.ManipulateType): Date {
    return dayjs().subtract(n, unite).toDate();
  },

  getEndOfDate(date: Date, unit: dayjs.UnitType): Date {
    return dayjs(date).endOf(unit).toDate();
  },

  getfirstOfDate(date: Date, unit: dayjs.UnitType): Date {
    return dayjs(date).startOf(unit).toDate();
  },
};
