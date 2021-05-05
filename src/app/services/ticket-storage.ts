import { Ticket } from 'app/types/ticket';
import { SortingOptions } from 'app/components/sorting-form';
import { StopOptions } from 'app/components/tickets-filter-form';

type CachedDisplayedTicketsStorageEntry = {
  key: string;
  source: Array<Ticket>;
  result: Array<Ticket>;
};

type CachedDisplayedTicketsStorage = Array<CachedDisplayedTicketsStorageEntry>;

export class TicketStorage {
  cachedDisplayedTickets: CachedDisplayedTicketsStorage = [];
  rawTickets: Array<Ticket> = [];

  getSortingFunction = (sorting: SortingOptions): (a: Ticket, b: Ticket) => number => {
    const cheapestOption = sorting.find((option) => option.id === 'cheapest');

    if (cheapestOption && cheapestOption.isChecked) {
      return this.sortTicketsByPrice;
    }

    return this.sortTicketsByDuration;
  }

  sortTicketsByPrice = (a: Ticket, b: Ticket): number => a.price - b.price;

  sortTicketsByDuration = (a: Ticket, b: Ticket): number => {
    const [
      { duration: forwardDuration1 },
      { duration: oppositeDuration1 },
    ] = a.segments;

    const [
      { duration: forwardDuration2 },
      { duration: oppositeDuration2 },
    ] = b.segments;

    return (forwardDuration1 + oppositeDuration1) - (forwardDuration2 + oppositeDuration2);
  }

  getCachedDisplayedTickets = (tickets: Array<Ticket>, filter: StopOptions, sorting: SortingOptions, displayedTicketsCount: number): Array<Ticket> => {
    const filterKeyPart = filter.filter((option) => option.isChecked).map((option) => option.id).join('');
    const sortingKeyPart = sorting.filter((option) => option.isChecked).map((option) => option.id).join('');
    const cacheKey = `${filterKeyPart}/${sortingKeyPart}`;

    const cachedEntry = this.cachedDisplayedTickets.find((entry) => entry.key === cacheKey && entry.source === tickets);

    if (cachedEntry) {
      return cachedEntry.result;
    } else {
      const displayedTickets = this.getDisplayedTickets(tickets, filter, sorting, displayedTicketsCount);

      this.cachedDisplayedTickets = [...this.cachedDisplayedTickets, {
        key: cacheKey,
        source: tickets,
        result: displayedTickets,
      }]

      return displayedTickets;
    }
  }

  getDisplayedTickets = (tickets: Array<Ticket>, filter: StopOptions, sorting: SortingOptions, displayedTicketsCount: number): Array<Ticket> => {
    const sortingFunction = this.getSortingFunction(sorting);
    const stopCountsList = filter
      .filter((option) => option.isChecked)
      .map((option) => option.count)

    return [...tickets]
      .sort(sortingFunction)
      .filter((ticket: Ticket) => {
        return this.filterTicketsByStops(ticket, stopCountsList);
      })
      .slice(0, displayedTicketsCount);
  }

  filterTicketsByStops = (ticket: Ticket, filter: Array<(number | undefined)>): boolean => {
    if (filter.length > 0) {
      const [
        { stops: forwardStops },
        { stops: oppositeStops },
      ] = ticket.segments;

      return filter.includes(forwardStops.length) && filter.includes(oppositeStops.length);
    }

    return false;
  }
}
