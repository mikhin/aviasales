import { withoutTransfersOptionLabel } from 'app/constants/transfers-filter-options';
import { StopOption } from 'app/types/stop-option';

export const getFormattedAirTransfersCount = (stopOptions: StopOption[], segmentStops: string[]): string => {
  const option = stopOptions.find((stop) => stop.count === segmentStops.length);

  if (option) {
    return option.label;
  }
  return withoutTransfersOptionLabel;
};
