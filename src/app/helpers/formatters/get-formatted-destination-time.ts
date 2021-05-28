import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import { timeZone } from 'app/constants/time-zone';
import format from 'date-fns/format';

const ONE_MINUTE_MILLISECONDS = 60000;

export const getFormattedDestinationTime = (datetime: string, duration: number): string => {
  const originDate = utcToZonedTime(datetime, timeZone);

  const destinationDate = new Date(originDate.getTime() + duration * ONE_MINUTE_MILLISECONDS);
  return format(destinationDate, 'HH:mm');
};
