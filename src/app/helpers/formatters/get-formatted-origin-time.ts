import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import { timeZone } from 'app/constants/time-zone';
import format from 'date-fns/format';

export const getFormattedOriginTime = (datetime: string): string => {
  const date = utcToZonedTime(datetime, timeZone);
  return format(date, 'HH:mm');
};
