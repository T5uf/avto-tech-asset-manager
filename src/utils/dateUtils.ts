
import { format, addDays, subDays, subWeeks, subMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { ru } from "date-fns/locale";

export type DateRange = {
  from: Date;
  to?: Date; // Changed to optional to match react-day-picker's DateRange
};

export const formatDate = (date: Date, formatString = "dd.MM.yyyy") => {
  return format(date, formatString, { locale: ru });
};

export const formatDatetime = (date: Date, formatString = "dd.MM.yyyy HH:mm") => {
  return format(date, formatString, { locale: ru });
};

export const getDateRangeText = (range: DateRange | undefined): string => {
  if (!range) return "Выберите период";
  if (!range.from) return "Выберите начальную дату";
  if (!range.to) return "Выберите конечную дату";
  
  return `${formatDate(range.from)} - ${formatDate(range.to)}`;
};

export const getPresetRanges = () => {
  const today = new Date();
  
  return {
    today: {
      from: today,
      to: today,
    },
    yesterday: {
      from: subDays(today, 1),
      to: subDays(today, 1),
    },
    lastWeek: {
      from: startOfWeek(subWeeks(today, 1), { locale: ru }),
      to: endOfWeek(subWeeks(today, 1), { locale: ru }),
    },
    last7Days: {
      from: subDays(today, 6),
      to: today,
    },
    last30Days: {
      from: subDays(today, 29),
      to: today,
    },
    thisMonth: {
      from: startOfMonth(today),
      to: endOfMonth(today),
    },
    lastMonth: {
      from: startOfMonth(subMonths(today, 1)),
      to: endOfMonth(subMonths(today, 1)),
    },
  };
};
