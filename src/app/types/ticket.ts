import { Segment } from 'app/types/segment';

export type Ticket = {
  id: string;
  price: number;
  carrier: string;
  segments: Segment[];
};
