import Segment from "./segment";

type Ticket = {
  price: number;
  carrier: string;
  segments: Array<Segment>;
};

export default Ticket;
