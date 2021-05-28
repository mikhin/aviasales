import React from 'react';

import { Page, Page__Main, Page__Section, Page__Sidebar } from 'app/components/page';
import { TicketsFilterFormContainer } from 'app/components/tickets-filter-form-container';
import { SortingForm } from 'app/components/sorting-form';
import { LineThrobber } from 'app/components/line-throbber';
import { ServerErrorNotice } from 'app/components/server-error-notice';
import { EmptySearchResultsMessage } from 'app/components/empty-search-results-message';
import { TicketList, TicketList__Item } from 'app/components/ticket-list';
import { TicketCard } from 'app/components/ticket-card';
import { CircleThrobber } from 'app/components/circle-throbber';
import { Button } from 'app/components/button';

import { Ticket } from 'app/types/ticket';
import { retry } from 'app/helpers/retry';
import {
  transfersFilterUnifyingOption,
  transfersFilterUnifyingOptionId,
  withoutTransfersOptionLabel,
} from 'app/constants/transfers-filter-options';
import { sortingOptions } from 'app/constants/sorting-options';
import { pluralize } from 'app/helpers/pluralize';
import { fetchSearchId, fetchTickets } from 'app/services/api';
import { TicketStorage } from 'app/services/ticket-storage';
import { StopOption } from 'app/types/stop-option';
import { SortingOption } from 'app/types/sorting-option';

type State = {
  displayedTicketsCount: number;
  searchId: string;
  tickets: Ticket[];
  fetchStatus: string;
  selectedStopOptions: StopOption[];
  selectedSortingOptions: SortingOption[];
  isErrorWhileFetching: boolean;
  hiddenTicketsCount: number;
}

const FETCH_STATUSES = {
  initial: '',
  fetching: 'fetching',
  fetchingFinished: 'fetchingFinished',
};

const DISPLAYED_TICKETS_LIST_CHUNK_SIZE = 5;

class Tickets extends React.Component<{}, State> {
  state = {
    displayedTicketsCount: DISPLAYED_TICKETS_LIST_CHUNK_SIZE,
    searchId: '',
    tickets: [],
    fetchStatus: FETCH_STATUSES.initial,
    selectedStopOptions: [],
    selectedSortingOptions: sortingOptions.map((option, index) => ({ ...option, isChecked: index === 0 })),
    isErrorWhileFetching: false,
    hiddenTicketsCount: 0,
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

        const { displayedTickets, hiddenTicketsCount } = this.ticketStorage.getCachedDisplayedTickets(selectedStopOptions, selectedSortingOptions, displayedTicketsCount);

        this.setState({
          isErrorWhileFetching: !this.ticketStorage.areTicketsExists,
          fetchStatus: FETCH_STATUSES.fetchingFinished,
          tickets: displayedTickets,
          hiddenTicketsCount,
        });
      }
    }
  }

  onFilterChange = (filter: StopOption[]): void => {
    const {
      selectedSortingOptions,
    } = this.state;

    this.setState({
      selectedStopOptions: filter,
    });

    if (filter) {
      const { displayedTickets, hiddenTicketsCount } = this.ticketStorage.getCachedDisplayedTickets(filter, selectedSortingOptions, DISPLAYED_TICKETS_LIST_CHUNK_SIZE);

      this.setState({
        displayedTicketsCount: DISPLAYED_TICKETS_LIST_CHUNK_SIZE,
        tickets: displayedTickets,
        hiddenTicketsCount,
      });
    }
  };

  onSortingChange = (sorting: SortingOption[]): void => {
    const {
      selectedStopOptions,
    } = this.state;

    this.setState({
      selectedSortingOptions: sorting,
    });

    if (sorting) {
      const { displayedTickets, hiddenTicketsCount } = this.ticketStorage.getCachedDisplayedTickets(selectedStopOptions, sorting, DISPLAYED_TICKETS_LIST_CHUNK_SIZE);

      this.setState({
        displayedTicketsCount: DISPLAYED_TICKETS_LIST_CHUNK_SIZE,
        tickets: displayedTickets,
        hiddenTicketsCount,
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
        const label = count === 0 ? withoutTransfersOptionLabel : `${count} ${pluralize(count, 'пересадка', 'пересадки', 'пересадок')}`;

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

      const { displayedTickets, hiddenTicketsCount } = this.ticketStorage.getCachedDisplayedTickets(selectedStopOptions, selectedSortingOptions, displayedTicketsCount);

      this.setState({
        fetchStatus: FETCH_STATUSES.fetching,
        tickets: displayedTickets,
        hiddenTicketsCount,
      });
    } else {
      this.ticketStorage.updateStorageWithNewTickets(tickets);
    }

    if (isRequestFinished) {
      const { displayedTickets, hiddenTicketsCount } = this.ticketStorage.getCachedDisplayedTickets(selectedStopOptions, selectedSortingOptions, displayedTicketsCount);

      this.setState({
        fetchStatus: FETCH_STATUSES.fetchingFinished,
        tickets: displayedTickets,
        hiddenTicketsCount,
      });
    } else {
      await this.getTickets();
    }
  }

  increaseCountOfDisplayedTickets = (): void => {
    const { selectedStopOptions, selectedSortingOptions } = this.state;

    this.setState((prevState) => {
      const displayedTicketsCountNewValue = prevState.displayedTicketsCount + DISPLAYED_TICKETS_LIST_CHUNK_SIZE;

      const { displayedTickets, hiddenTicketsCount } = this.ticketStorage.getCachedDisplayedTickets(selectedStopOptions, selectedSortingOptions, displayedTicketsCountNewValue);

      return {
        displayedTicketsCount: displayedTicketsCountNewValue,
        tickets: displayedTickets,
        hiddenTicketsCount,
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
      hiddenTicketsCount,
    } = this.state;

    const areTicketsCanBeDisplayed = tickets.length > 0;

    const isHiddenTicketsAvailable = hiddenTicketsCount > 0;

    const showMoreButtonCount = ((hiddenTicketsCount > 0
      && hiddenTicketsCount < DISPLAYED_TICKETS_LIST_CHUNK_SIZE)
      && hiddenTicketsCount)
      || DISPLAYED_TICKETS_LIST_CHUNK_SIZE;

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
                  <TicketList__Item key={`${ticket.id}`}>
                    <TicketCard
                      id={ticket.id}
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

          {areTicketsCanBeDisplayed && isHiddenTicketsAvailable && (
            <Page__Section>
              <Button
                onClick={this.increaseCountOfDisplayedTickets}
                theme="standard"
                size="l"
                wide
              >
                Показать ещё {showMoreButtonCount} {pluralize(showMoreButtonCount, 'билет', 'билета', 'билетов')}!
              </Button>
            </Page__Section>
          )}
        </Page__Main>
      </Page>
    );
  }
}

export default Tickets;
