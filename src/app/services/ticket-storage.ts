import { Ticket } from 'app/types/ticket';
import { StopOption } from 'app/types/stop-option';
import { SortingOption } from 'app/types/sorting-option';
import {
  transfersFilterUnifyingOption,
  transfersFilterUnifyingOptionId,
  withoutTransfersOptionLabel,
} from 'app/constants/transfers-filter-options';
import { pluralize } from 'app/helpers/pluralize';

type CachedDisplayedTicketsStorageEntry = {
  key: string;
  source: Ticket[][];
  result: Ticket[];
  hiddenTicketsCount: number;
};

type CachedDisplayedTicketsStorage = CachedDisplayedTicketsStorageEntry[];

export class TicketStorage {
  cachedDisplayedTickets: CachedDisplayedTicketsStorage = [];

  ticketsSortedByPrice: Ticket[][] = [];

  ticketsSortedByDuration: Ticket[][] = [];

  ticketsSortedByOptimality: Ticket[][] = [];

  selectedStopOptions: StopOption[] = [];

  areTicketsExists = false;

  ticketsStoragesBySortingType: {[key: string]: Array<Ticket>[]} = {
    cheapest: this.ticketsSortedByPrice,
    fastest: this.ticketsSortedByDuration,
    optimal: this.ticketsSortedByOptimality,
  };

  updateStorageWithNewTickets = (tickets: Ticket[]): void => {
    tickets.forEach((ticket) => {
      // Сознательно мутируем объект вместо создания нового,
      // чтобы положить в оба хранилища именно один и тот же объект,
      // т.к. в дальнейшем, при сортировке по оптимальности,
      // будет происходить сравнение объектов по ссылке
      ticket.id = `${ticket.carrier}/${ticket.price}/${ticket.segments[0].duration}/${ticket.segments[1].duration}`;

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

  getCachedDisplayedTickets = (filter: StopOption[], sorting: SortingOption[], displayedTicketsCount: number): { displayedTickets: Ticket[]; hiddenTicketsCount: number } => {
    const selectedSortingOption = sorting.find((option) => option.isChecked);

    let selectedTicketsStorage: Ticket[][];

    if (selectedSortingOption) {
      selectedTicketsStorage = this.ticketsStoragesBySortingType[selectedSortingOption.id];
    } else {
      selectedTicketsStorage = this.ticketsStoragesBySortingType.cheapest;
    }

    const filterKeyPart = filter.filter((option) => option.isChecked).map((option) => option.id).join('');
    const sortingKeyPart = sorting.filter((option) => option.isChecked).map((option) => option.id).join('');
    const cacheKey = `filter:${filterKeyPart}/sorting:${sortingKeyPart}/ticketsCount:${selectedTicketsStorage.length}/displayedTicketsCount:${displayedTicketsCount}`;

    const cachedEntry = this.cachedDisplayedTickets.find((entry) => entry.key === cacheKey && entry.source === selectedTicketsStorage);

    if (cachedEntry) {
      return { displayedTickets: cachedEntry.result, hiddenTicketsCount: cachedEntry.hiddenTicketsCount };
    }

    const {
      displayedTickets,
      hiddenTicketsCount,
    } = this.getDisplayedTickets(selectedTicketsStorage.flat(), filter, displayedTicketsCount);

    this.cachedDisplayedTickets = [...this.cachedDisplayedTickets, {
      key: cacheKey,
      source: selectedTicketsStorage.slice(),
      result: displayedTickets,
      hiddenTicketsCount,
    }];

    return { displayedTickets, hiddenTicketsCount };
  }

  getStopOptions = (prevState: StopOption[], tickets: Ticket[]): StopOption[] => {
    const stopVariantsCounts = tickets
      .map((ticket): number[] => {
        const [
          { stops: forwardStops },
          { stops: oppositeStops },
        ] = ticket.segments;

        return [forwardStops.length, oppositeStops.length];
      })
      .flat();

    const stopVariantsList = Array
      .from(new Set(stopVariantsCounts))
      .sort();

    const defaultUnifyingOption = {
      ...transfersFilterUnifyingOption,
      isChecked: true,
    };

    const unifyingOption = prevState
      .find((option) => option.id === transfersFilterUnifyingOptionId)
      || defaultUnifyingOption;

    const newStopVariants = stopVariantsList.map((count) => {
      const id = `stops-${count}`;
      const label = count === 0 ? withoutTransfersOptionLabel : `${count} ${pluralize(count, 'пересадка', 'пересадки', 'пересадок')}`;

      const existingOption = prevState.find((option) => option.id === id);
      const newOption = {
        id,
        label,
        count,
        isChecked: true,
      };

      return existingOption || newOption;
    });

    this.selectedStopOptions = [unifyingOption, ...newStopVariants];

    return this.selectedStopOptions;
  }

  getDisplayedTickets = (tickets: Ticket[], filter: StopOption[], displayedTicketsCount: number): { displayedTickets: Ticket[]; hiddenTicketsCount: number } => {
    const stopCountsList = filter
      .filter((option) => option.isChecked)
      .map((option) => option.count);

    const displayedTickets = tickets
      .filter((ticket: Ticket) => this.filterTicketsByStops(ticket, stopCountsList))
      .slice(0, displayedTicketsCount);

    return {
      displayedTickets,
      hiddenTicketsCount: tickets.length - displayedTickets.length,
    };
  }

  getIncreasedSizeTicketList = (filter: StopOption[], displayedTicketsCount: number): { displayedTickets: Ticket[]; hiddenTicketsCount: number } => {
    const lastCachedEntry = this.cachedDisplayedTickets.slice(-1)[0];
    const { source } = lastCachedEntry;

    const {
      displayedTickets,
      hiddenTicketsCount,
    } = this.getDisplayedTickets(source.flat(), filter, displayedTicketsCount);

    return { displayedTickets, hiddenTicketsCount };
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
