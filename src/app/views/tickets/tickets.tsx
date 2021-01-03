import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import TicketsPageLayout from "../../components/tickets-page-layout";
import { stopOptionsType } from "../../components/filter-form";
import { sortingOptionsType } from "../../components/sorting-form";

import Ticket from '../../types/ticket';
import retry from "../../helpers/retry";

const DISPLAYED_TICKETS_COUNT = 5;

type stateType = {
  searchId: string;
  tickets: Array<Ticket>;
  fetchStatus: string;
  stopOptions: stopOptionsType;
  sortingOptions: sortingOptionsType;
  isErrorWhileFetching: boolean;
}

type cachedDisplayedTicketsStorageEntry = {
  key: string;
  source: Array<Ticket>;
  result: Array<Ticket>;
};

type cachedDisplayedTicketsStorage = Array<cachedDisplayedTicketsStorageEntry>;

const fetchStatuses = {
  initial: '',
  fetching: 'fetching',
  fetchingFinished: 'fetchingFinished',
}

class Tickets extends React.Component<RouteComponentProps, stateType> {
  state = {
    searchId: '',
    tickets: [],
    fetchStatus: fetchStatuses.initial,
    stopOptions: [],
    sortingOptions: [],
    isErrorWhileFetching: false,
  }

  private cachedDisplayedTickets: cachedDisplayedTicketsStorage = [];
  private rawTickets: Array<Ticket> = [];

  async componentDidMount(): Promise<void> {
    await this.initializeSearchIdFetching();
    await this.initializeTicketsFetching();
  }

  initializeSearchIdFetching = async (): Promise<void> => {
    try {
      await retry(this.fetchSearchId, 3, 1000);
    } catch (error) {
      this.setState({
        isErrorWhileFetching: true,
        fetchStatus: fetchStatuses.fetchingFinished,
      })
    }
  }

  initializeTicketsFetching = async (): Promise<void> => {
    const { searchId, isErrorWhileFetching } = this.state
    if (searchId && !isErrorWhileFetching) {
      try {
        await retry(this.fetchTickets, 3, 1000);
      } catch (error) {
        this.setState({
          isErrorWhileFetching: this.rawTickets.length === 0,
          fetchStatus: fetchStatuses.fetchingFinished,
        })
      }
    }
  }

  getCachedDisplayedTickets = (tickets: Array<Ticket>, filter: stopOptionsType, sorting: sortingOptionsType): Array<Ticket> => {
    const filterKeyPart = filter.filter((option) => option.isChecked).map((option) => option.id).join('');
    const sortingKeyPart = sorting.filter((option) => option.isChecked).map((option) => option.id).join('');
    const cacheKey = `${filterKeyPart}/${sortingKeyPart}`;

    const cachedEntry = this.cachedDisplayedTickets.find((entry) => entry.key === cacheKey && entry.source === tickets);

    if (cachedEntry) {
      return cachedEntry.result;
    } else {
      const displayedTickets = this.getDisplayedTickets(tickets, filter, sorting);

      this.cachedDisplayedTickets = [...this.cachedDisplayedTickets, {
        key: cacheKey,
        source: tickets,
        result: displayedTickets,
      }]

      return displayedTickets;
    }
  }

  getDisplayedTickets = (tickets: Array<Ticket>, filter: stopOptionsType, sorting: sortingOptionsType): Array<Ticket> => {
    const sortingFunction = this.getSortingFunction(sorting);
    const stopCountsList = filter
      .filter((option) => option.isChecked)
      .map((option) => option.count)

    return [...tickets]
      .sort(sortingFunction)
      .filter((ticket: Ticket) => {
        return this.filterTicketsByStops(ticket, stopCountsList);
      })
      .slice(0, DISPLAYED_TICKETS_COUNT);
  }

  getSortingFunction = (sorting: sortingOptionsType): (a: Ticket, b: Ticket) => number => {
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

  onFilterChange = (filter: stopOptionsType): void => {
    const {
      sortingOptions
    } = this.state

    this.setState({
      stopOptions: filter,
    })

    if (filter) {
      this.setState({
        tickets: this.getCachedDisplayedTickets(this.rawTickets, filter, sortingOptions),
      })
    }
  };

  onSortingChange = (sorting: sortingOptionsType): void => {
    const {
      stopOptions
    } = this.state

    this.setState({
      sortingOptions: sorting,
    })

    if (sorting) {
      this.setState({
        tickets: this.getCachedDisplayedTickets(this.rawTickets, stopOptions, sorting),
      })
    }
  };

  fetchSearchId = async (): Promise<void> => {
    this.setState({
      fetchStatus: fetchStatuses.fetching
    });

    try {
      const response = await fetch('/search');

      const { searchId } = await response.json();

      this.setState({
        searchId,
      })
    } catch (error) {
      throw error;
    }
  }

  fetchTickets = async (): Promise<void> => {
    const { searchId, stopOptions, sortingOptions } = this.state;

    try {
      const response = await fetch(`/tickets?searchId=${searchId}`);

      const { tickets: fetchedTickets, stop } = await response.json();

      if (this.rawTickets.length === 0) {
        this.setState({
          fetchStatus: fetchStatuses.fetching,
          tickets: this.getCachedDisplayedTickets(fetchedTickets, stopOptions, sortingOptions),
        });
      }

      this.rawTickets = [...this.rawTickets, ...fetchedTickets];

      if (stop) {
        this.setState({
          fetchStatus: fetchStatuses.fetchingFinished,
          tickets: this.getCachedDisplayedTickets(this.rawTickets, stopOptions, sortingOptions),
        });
      } else {
        await this.fetchTickets();
      }
    } catch (error) {
      throw error;
    }
  }

  reloadPage = (): void => {
    window.location.reload();
  }

  render(): React.ReactNode {
    const {
      fetchStatus,
      tickets,
      isErrorWhileFetching
    } = this.state

    return (
      <TicketsPageLayout
        displayableTickets={tickets}
        canTicketsBeDisplayed={this.rawTickets.length > 0}
        fetchStatus={fetchStatus}
        isErrorWhileFetching={isErrorWhileFetching}
        onFilterChange={this.onFilterChange}
        onSortingChange={this.onSortingChange}
        onReloadPage={this.reloadPage}
      />
    );
  }
}

export default withRouter(Tickets);
