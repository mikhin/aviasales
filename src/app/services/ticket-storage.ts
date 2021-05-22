import { Ticket } from 'app/types/ticket';
import { SortingOption } from 'app/components/sorting-form';
import { StopOption } from 'app/components/tickets-filter-form';

type CachedDisplayedTicketsStorageEntry = {
  key: string;
  source: Ticket[];
  result: Ticket[];
};

type CachedDisplayedTicketsStorage = CachedDisplayedTicketsStorageEntry[];

export class TicketStorage {
  cachedDisplayedTickets: CachedDisplayedTicketsStorage = [];

  ticketsSortedByPrice: Array<Ticket>[] = [];

  ticketsSortedByDuration: Array<Ticket>[] = [];

  ticketsSortedByOptimality: Array<Ticket>[] = [];

  areTicketsExists = false;

  ticketsStoragesBySortingType: {[key: string]: Array<Ticket>[]} = {
    cheapest: this.ticketsSortedByPrice,
    fastest: this.ticketsSortedByDuration,
    optimal: this.ticketsSortedByOptimality,
  };

  updateStorageWithNewTickets = (tickets: Ticket[]): void => {
    tickets.forEach((ticket) => {
      this.updateTicketsSortedByPrice(ticket);
      this.updateTicketsSortedByDuration(ticket);
    });

    this.updateTicketsSortedByOptimality();

    this.areTicketsExists = true;
  }

  updateTicketsSortedByPrice = (ticket: Ticket): void => {
    const priceAsIndex = ticket.price;

    if (this.ticketsSortedByPrice[priceAsIndex]) {
      this.ticketsSortedByPrice[priceAsIndex].push(ticket);
    } else {
      this.ticketsSortedByPrice[priceAsIndex] = [ticket];
    }
  }

  updateTicketsSortedByDuration = (ticket: Ticket): void => {
    const [
      { duration: forwardDuration },
      { duration: oppositeDuration },
    ] = ticket.segments;

    const durationAsIndex = forwardDuration + oppositeDuration;

    if (this.ticketsSortedByDuration[durationAsIndex]) {
      this.ticketsSortedByDuration[durationAsIndex].push(ticket);
    } else {
      this.ticketsSortedByDuration[durationAsIndex] = [ticket];
    }
  }

  updateTicketsSortedByOptimality = (): void => {
    this.ticketsSortedByOptimality.length = 0;

    const ticketsSortedByPriceFlatted = this.ticketsSortedByPrice.flat();
    const ticketsSortedByDurationFlatted = this.ticketsSortedByDuration.flat();

    ticketsSortedByPriceFlatted.forEach((ticket, priceIndex) => {
      const durationIndex = ticketsSortedByDurationFlatted.findIndex((t) => t === ticket);
      const sumIndex = priceIndex + durationIndex;

      if (this.ticketsSortedByOptimality[sumIndex]) {
        this.ticketsSortedByOptimality[sumIndex].push(ticket);
      } else {
        this.ticketsSortedByOptimality[sumIndex] = [ticket];
      }
    });
  }

  getCachedDisplayedTickets = (filter: StopOption[], sorting: SortingOption[], displayedTicketsCount: number): Ticket[] => {
    const selectedSortingOption = sorting.find((option) => option.isChecked);

    let selectedTicketsStorage: Ticket[];

    if (selectedSortingOption) {
      selectedTicketsStorage = this.ticketsStoragesBySortingType[selectedSortingOption.id].flat();
    } else {
      selectedTicketsStorage = this.ticketsStoragesBySortingType.cheapest.flat();
    }

    const filterKeyPart = filter.filter((option) => option.isChecked).map((option) => option.id).join('');
    const sortingKeyPart = sorting.filter((option) => option.isChecked).map((option) => option.id).join('');
    const cacheKey = `filter:${filterKeyPart}/sorting:${sortingKeyPart}/ticketsCount:${selectedTicketsStorage.length}`;

    const cachedEntry = this.cachedDisplayedTickets.find((entry) => entry.key === cacheKey && entry.source === selectedTicketsStorage);

    if (cachedEntry) {
      return cachedEntry.result;
    }
    const displayedTickets = this.getDisplayedTickets(selectedTicketsStorage.flat(), filter, sorting, displayedTicketsCount);

    this.cachedDisplayedTickets = [...this.cachedDisplayedTickets, {
      key: cacheKey,
      source: selectedTicketsStorage,
      result: displayedTickets,
    }];

    return displayedTickets;
  }

  getDisplayedTickets = (tickets: Ticket[], filter: StopOption[], sorting: SortingOption[], displayedTicketsCount: number): Ticket[] => {
    const stopCountsList = filter
      .filter((option) => option.isChecked)
      .map((option) => option.count);

    return [...tickets]
      .filter((ticket: Ticket) => this.filterTicketsByStops(ticket, stopCountsList))
      .slice(0, displayedTicketsCount);
  }

  filterTicketsByStops = (ticket: Ticket, filter: (number | undefined)[]): boolean => {
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
