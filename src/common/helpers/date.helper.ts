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

  timeDifferenceInHours(startDate: Date, endDate: Date): number {
    return dayjs(endDate).diff(dayjs(startDate), 'hour');
  },

  divideDateRangeInHalf(
    startDate: Date,
    endDate: Date,
  ): { startDate1: Date; endDate1: Date; startDate2: Date; endDate2: Date } {
    const diffInMs = dayjs(endDate).diff(dayjs(startDate), 'millisecond');
    const halfDiffInMs = diffInMs / 2;
    const endDate1 = dayjs(startDate).add(halfDiffInMs, 'millisecond').toDate();
    const startDate2 = endDate1;
    return {
      startDate1: dayjs(startDate).toDate(),
      endDate1: endDate1,
      startDate2: startDate2,
      endDate2: dayjs(endDate).toDate(),
    };
  },
};
