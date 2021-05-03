import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { Page, Page__Main, Page__Section, Page__Sidebar } from 'app/components/page';
import { TicketsFilterFormContainer } from 'app/components/tickets-filter-form-container';
import { SortingFormContainer } from 'app/components/sorting-form-container';
import { LineThrobber } from 'app/components/line-throbber';
import { ServerErrorNotice } from 'app/components/server-error-notice';
import { EmptySearchResultsMessage } from 'app/components/empty-search-results-message';
import { TicketList, TicketList__Item } from 'app/components/ticket-list';
import { TicketCardContainer } from 'app/components/ticket-card-container';
import { StopOptions } from "app/components/tickets-filter-form";
import { SortingOptions } from "app/components/sorting-form";

import { Ticket } from 'app/types/ticket';
import { retry } from "app/helpers/retry";
import {
  transfersFilterUnifyingOption,
  transfersFilterUnifyingOptionId
} from 'app/constants/transfers-filter-unifying-option';
import { pluralize } from 'app/helpers/pluralize';
import { fetchSearchId, fetchTickets } from 'app/api';

const SORTING_OPTIONS = [
  {
    id: 'cheapest',
    label: 'Самый дешёвый',
  },
  {
    id: 'fastest',
    label: 'Самый быстрый',
  },
];
const DISPLAYED_TICKETS_COUNT = 5;

type State = {
  searchId: string;
  tickets: Array<Ticket>;
  fetchStatus: string;
  selectedStopOptions: StopOptions;
  selectedSortingOptions: SortingOptions;
  isErrorWhileFetching: boolean;
}

type CachedDisplayedTicketsStorageEntry = {
  key: string;
  source: Array<Ticket>;
  result: Array<Ticket>;
};

type CachedDisplayedTicketsStorage = Array<CachedDisplayedTicketsStorageEntry>;

const fetchStatuses = {
  initial: '',
  fetching: 'fetching',
  fetchingFinished: 'fetchingFinished',
}

class Tickets extends React.Component<RouteComponentProps, State> {
  state = {
    searchId: '',
    tickets: [],
    fetchStatus: fetchStatuses.initial,
    selectedStopOptions: [],
    selectedSortingOptions: SORTING_OPTIONS.map((option, index) => ({ ...option, isChecked: index === 0 })),
    isErrorWhileFetching: false,
  }

  private cachedDisplayedTickets: CachedDisplayedTicketsStorage = [];
  private rawTickets: Array<Ticket> = [];

  async componentDidMount(): Promise<void> {
    await this.initializeSearchIdFetching();
    await this.initializeTicketsFetching();
  }

  initializeSearchIdFetching = async (): Promise<void> => {
    try {
      await retry(this.getSearchId, 3, 1000);
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
        await retry(this.getTickets, 3, 1000);
      } catch (error) {
        this.setState({
          isErrorWhileFetching: this.rawTickets.length === 0,
          fetchStatus: fetchStatuses.fetchingFinished,
        })
      }
    }
  }

  getCachedDisplayedTickets = (tickets: Array<Ticket>, filter: StopOptions, sorting: SortingOptions): Array<Ticket> => {
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

  getDisplayedTickets = (tickets: Array<Ticket>, filter: StopOptions, sorting: SortingOptions): Array<Ticket> => {
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

  onFilterChange = (filter: StopOptions): void => {
    const {
      selectedSortingOptions
    } = this.state

    this.setState({
      selectedStopOptions: filter,
    })

    if (filter) {
      this.setState({
        tickets: this.getCachedDisplayedTickets(this.rawTickets, filter, selectedSortingOptions),
      })
    }
  };

  onSortingChange = (sorting: SortingOptions): void => {
    const {
      selectedStopOptions
    } = this.state

    this.setState({
      selectedSortingOptions: sorting,
    })

    if (sorting) {
      this.setState({
        tickets: this.getCachedDisplayedTickets(this.rawTickets, selectedStopOptions, sorting),
      })
    }
  };

  setStopVariants = (tickets: Array<Ticket>): void => {
    const stopVariantsCounts = tickets
      .map((ticket): Array<number> => {
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

    this.setState((prevState) => {
      const defaultUnifyingOption = {
        ...transfersFilterUnifyingOption,
        isChecked: true,
      };

      const unifyingOption = prevState
          .selectedStopOptions
          .find((option) => option.id === transfersFilterUnifyingOptionId)
        || defaultUnifyingOption;

      const newStopVariants = stopVariantsList.map((count) => {
        const id = `stops-${count}`;
        const label = count === 0 ? 'Без пересадок' : `${count} ${pluralize(count, 'пересадка', 'пересадки', 'пересадок')}`;

        const existingOption = prevState.selectedStopOptions.find((option) => option.id === id);
        const newOption = {
          id,
          label,
          count,
          isChecked: true,
        };

        return existingOption || newOption;
      });

      return {
        selectedStopOptions: [unifyingOption, ...newStopVariants],
      }
    });
  }

  getSearchId = async (): Promise<void> => {
    this.setState({
      fetchStatus: fetchStatuses.fetching
    });

    const searchId = await fetchSearchId();

    this.setState({
      searchId,
    })
  }

  getTickets = async (): Promise<void> => {
    const { searchId } = this.state;

    const [tickets, isRequestFinished] = await fetchTickets(searchId);

    const { selectedSortingOptions } = this.state;

    this.setStopVariants(tickets);

    const { selectedStopOptions } = this.state;

    if (this.rawTickets.length === 0) {
      this.setState({
        fetchStatus: fetchStatuses.fetching,
        tickets: this.getCachedDisplayedTickets(tickets, selectedStopOptions, selectedSortingOptions),
      });
    }

    this.rawTickets = [...this.rawTickets, ...tickets];

    if (isRequestFinished) {
      this.setState({
        fetchStatus: fetchStatuses.fetchingFinished,
        tickets: this.getCachedDisplayedTickets(this.rawTickets, selectedStopOptions, selectedSortingOptions),
      });
    } else {
      await this.getTickets();
    }
  }

  reloadPage = (): void => {
    window.location.reload();
  }

  render(): React.ReactNode {
    const {
      fetchStatus,
      tickets,
      isErrorWhileFetching,
      selectedStopOptions,
      selectedSortingOptions,
    } = this.state;

    return (
      <Page>
        <Page__Sidebar>
          <TicketsFilterFormContainer
            selectedStopOptions={selectedStopOptions}
            onChange={this.onFilterChange}
          />
        </Page__Sidebar>

        <Page__Main>
          <Page__Section>
            <SortingFormContainer
              selectedSortingOptions={selectedSortingOptions}
              onChange={this.onSortingChange}
            />
          </Page__Section>

          {isErrorWhileFetching && tickets.length === 0 && (
            <Page__Section>
              <ServerErrorNotice
                onReloadPage={this.reloadPage}
              />
            </Page__Section>
          )}

          {!isErrorWhileFetching
          && tickets.length === 0
          && this.rawTickets.length > 0
          && (
            <Page__Section>
              <EmptySearchResultsMessage/>
            </Page__Section>
          )}

          {tickets.length > 0 && (
            <Page__Section>
              {fetchStatus === fetchStatuses.fetching && !isErrorWhileFetching && (
                <LineThrobber caption="Загрузка билетов"/>
              )}

              <TicketList>
                {tickets.map((ticket: Ticket) => (
                  <TicketList__Item key={`${ticket.carrier}/${ticket.price}`}>
                    <TicketCardContainer
                      price={ticket.price}
                      carrier={ticket.carrier}
                      segments={ticket.segments}
                      stopOptions={selectedStopOptions}
                    />
                  </TicketList__Item>
                ))}
              </TicketList>
            </Page__Section>
          )}
        </Page__Main>
      </Page>
    );
  }
}

export default withRouter(Tickets);
