import { Segment } from 'app/types/segment';

export type Ticket = {
  price: number;
  carrier: string;
  segments: Array<Segment>;
};
