import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { Page, Page__Main, Page__Section, Page__Sidebar } from 'app/components/page';
import { TicketsFilterFormContainer } from 'app/components/tickets-filter-form-container';
import { SortingForm, SortingOptions } from 'app/components/sorting-form';
import { LineThrobber } from 'app/components/line-throbber';
import { ServerErrorNotice } from 'app/components/server-error-notice';
import { EmptySearchResultsMessage } from 'app/components/empty-search-results-message';
import { TicketList, TicketList__Item } from 'app/components/ticket-list';
import { TicketCard } from 'app/components/ticket-card';
import { StopOptions } from 'app/components/tickets-filter-form';
import { CircleThrobber } from 'app/components/circle-throbber';
import { Button } from 'app/components/button';

import { Ticket } from 'app/types/ticket';
import { retry } from 'app/helpers/retry';
import {
  transfersFilterUnifyingOption,
  transfersFilterUnifyingOptionId,
} from 'app/constants/transfers-filter-unifying-option';
import { pluralize } from 'app/helpers/pluralize';
import { fetchSearchId, fetchTickets } from 'app/services/api';
import { TicketStorage } from 'app/services/ticket-storage';

const SORTING_OPTIONS = [
  {
    id: 'cheapest',
    label: 'Самый дешёвый',
  },
  {
    id: 'fastest',
    label: 'Самый быстрый',
  },
  {
    id: 'optimal',
    label: 'Оптимальный',
  },
];

type State = {
  displayedTicketsCount: number;
  searchId: string;
  tickets: Ticket[];
  fetchStatus: string;
  selectedStopOptions: StopOptions;
  selectedSortingOptions: SortingOptions;
  isErrorWhileFetching: boolean;
}

const FETCH_STATUSES = {
  initial: '',
  fetching: 'fetching',
  fetchingFinished: 'fetchingFinished',
};

const DISPLAYED_TICKETS_LIST_CHUNK_SIZE = 5;

class Tickets extends React.Component<RouteComponentProps, State> {
  state = {
    displayedTicketsCount: DISPLAYED_TICKETS_LIST_CHUNK_SIZE,
    searchId: '',
    tickets: [],
    fetchStatus: FETCH_STATUSES.initial,
    selectedStopOptions: [],
    selectedSortingOptions: SORTING_OPTIONS.map((option, index) => ({ ...option, isChecked: index === 0 })),
    isErrorWhileFetching: false,
  }

  ticketStorage = new TicketStorage();

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
        fetchStatus: FETCH_STATUSES.fetchingFinished,
      });
    }
  }

  initializeTicketsFetching = async (): Promise<void> => {
    const { searchId, isErrorWhileFetching } = this.state;
    if (searchId && !isErrorWhileFetching) {
      try {
        await retry(this.getTickets, 3, 1000);
      } catch (error) {
        const { selectedStopOptions, selectedSortingOptions, displayedTicketsCount } = this.state;

        this.setState({
          isErrorWhileFetching: !this.ticketStorage.areTicketsExists,
          fetchStatus: FETCH_STATUSES.fetchingFinished,
          tickets: this.ticketStorage.getCachedDisplayedTickets(selectedStopOptions, selectedSortingOptions, displayedTicketsCount),
        });
      }
    }
  }

  onFilterChange = (filter: StopOptions): void => {
    const {
      selectedSortingOptions,
    } = this.state;

    this.setState({
      selectedStopOptions: filter,
    });

    if (filter) {
      this.setState({
        displayedTicketsCount: DISPLAYED_TICKETS_LIST_CHUNK_SIZE,
        tickets: this.ticketStorage.getCachedDisplayedTickets(filter, selectedSortingOptions, DISPLAYED_TICKETS_LIST_CHUNK_SIZE),
      });
    }
  };

  onSortingChange = (sorting: SortingOptions): void => {
    const {
      selectedStopOptions,
    } = this.state;

    this.setState({
      selectedSortingOptions: sorting,
    });

    if (sorting) {
      this.setState({
        displayedTicketsCount: DISPLAYED_TICKETS_LIST_CHUNK_SIZE,
        tickets: this.ticketStorage.getCachedDisplayedTickets(selectedStopOptions, sorting, DISPLAYED_TICKETS_LIST_CHUNK_SIZE),
      });
    }
  };

  setStopVariants = (tickets: Ticket[]): void => {
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
      };
    });
  }

  getSearchId = async (): Promise<void> => {
    this.setState({
      fetchStatus: FETCH_STATUSES.fetching,
    });

    const searchId = await fetchSearchId();

    this.setState({
      searchId,
    });
  }

  getTickets = async (): Promise<void> => {
    const { searchId, displayedTicketsCount } = this.state;

    const [tickets, isRequestFinished] = await fetchTickets(searchId);

    this.setStopVariants(tickets);

    const { selectedSortingOptions, selectedStopOptions } = this.state;

    if (!this.ticketStorage.areTicketsExists) {
      this.ticketStorage.updateStorageWithNewTickets(tickets);

      this.setState({
        fetchStatus: FETCH_STATUSES.fetching,
        tickets: this.ticketStorage.getCachedDisplayedTickets(selectedStopOptions, selectedSortingOptions, displayedTicketsCount),
      });
    } else {
      this.ticketStorage.updateStorageWithNewTickets(tickets);
    }

    if (isRequestFinished) {
      this.setState({
        fetchStatus: FETCH_STATUSES.fetchingFinished,
        tickets: this.ticketStorage.getCachedDisplayedTickets(selectedStopOptions, selectedSortingOptions, displayedTicketsCount),
      });
    } else {
      await this.getTickets();
    }
  }

  increaseCountOfDisplayedTickets = (): void => {
    const { selectedStopOptions, selectedSortingOptions } = this.state;

    this.setState((prevState) => {
      const displayedTicketsCountNewValue = prevState.displayedTicketsCount + DISPLAYED_TICKETS_LIST_CHUNK_SIZE;

      return {
        displayedTicketsCount: displayedTicketsCountNewValue,
        tickets: this.ticketStorage.getCachedDisplayedTickets(selectedStopOptions, selectedSortingOptions, displayedTicketsCountNewValue),
      };
    });
  }

  initializeFetching = async (): Promise<void> => {
    await this.initializeSearchIdFetching();
    await this.initializeTicketsFetching();
  }

  render(): React.ReactNode {
    const {
      fetchStatus,
      tickets,
      isErrorWhileFetching,
      selectedStopOptions,
      selectedSortingOptions,
    } = this.state;

    const areTicketsCanBeDisplayed = tickets.length > 0;
    const areStopOptionsUnavailable = !this.ticketStorage.areTicketsExists
      && fetchStatus === FETCH_STATUSES.fetching;
    const isServerError = isErrorWhileFetching && !areTicketsCanBeDisplayed;
    const areSearchResultsEmpty = !isErrorWhileFetching
      && tickets.length === 0
      && this.ticketStorage.areTicketsExists;
    const areTicketsLoading = areTicketsCanBeDisplayed
      && fetchStatus === FETCH_STATUSES.fetching
      && !isErrorWhileFetching;

    return (
      <Page>
        <Page__Sidebar>
          {areStopOptionsUnavailable ? (
            <div>
              <CircleThrobber caption="Загрузка вариантов фильтра пересадок"/>
            </div>
          ) : (
            <TicketsFilterFormContainer
              selectedStopOptions={selectedStopOptions}
              onChange={this.onFilterChange}
            />
          )}
        </Page__Sidebar>

        <Page__Main>
          <Page__Section>
            <SortingForm
              selectedSortingOptions={selectedSortingOptions}
              onChange={this.onSortingChange}
            />
          </Page__Section>

          {isServerError && (
            <Page__Section>
              <ServerErrorNotice
                onRetry={this.initializeFetching}
              />
            </Page__Section>
          )}

          {areSearchResultsEmpty && (
            <Page__Section>
              <EmptySearchResultsMessage/>
            </Page__Section>
          )}

          {areTicketsLoading && (
            <Page__Section>
              <LineThrobber caption="Загрузка билетов"/>
            </Page__Section>
          )}

          {areTicketsCanBeDisplayed && (
            <Page__Section>
              <TicketList>
                {tickets.map((ticket: Ticket) => (
                  <TicketList__Item key={`${ticket.carrier}/${ticket.price}`}>
                    <TicketCard
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

          {areTicketsCanBeDisplayed && (
            <Page__Section>
              <Button
                mods={{
                  theme: 'standard',
                  size: 'l',
                  wide: true,
                }}
                onClick={this.increaseCountOfDisplayedTickets}
              >
                Показать ещё 5 билетов!
              </Button>
            </Page__Section>
          )}
        </Page__Main>
      </Page>
    );
  }
}

export default withRouter(Tickets);
