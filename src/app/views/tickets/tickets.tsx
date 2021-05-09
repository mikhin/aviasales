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
  searchId: string;
  tickets: Array<Ticket>;
  fetchStatus: string;
  selectedStopOptions: StopOptions;
  selectedSortingOptions: SortingOptions;
  isErrorWhileFetching: boolean;
}

const fetchStatuses = {
  initial: '',
  fetching: 'fetching',
  fetchingFinished: 'fetchingFinished',
}

class Tickets extends React.Component<RouteComponentProps, State> {
  state = {
    displayedTicketsCount: 5,
    searchId: '',
    tickets: [],
    fetchStatus: fetchStatuses.initial,
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
          isErrorWhileFetching: !this.ticketStorage.areTicketsExists,
          fetchStatus: fetchStatuses.fetchingFinished,
        })
      }
    }
  }

  onFilterChange = (filter: StopOptions): void => {
    const {
      selectedSortingOptions,
      displayedTicketsCount
    } = this.state

    this.setState({
      selectedStopOptions: filter,
    })

    if (filter) {
      this.setState({
        tickets: this.ticketStorage.getCachedDisplayedTickets(filter, selectedSortingOptions, displayedTicketsCount),
      })
    }
  };

  onSortingChange = (sorting: SortingOptions): void => {
    const {
      selectedStopOptions,
      displayedTicketsCount
    } = this.state

    this.setState({
      selectedSortingOptions: sorting,
    })

    if (sorting) {
      this.setState({
        tickets: this.ticketStorage.getCachedDisplayedTickets(selectedStopOptions, sorting, displayedTicketsCount),
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
    const { searchId, displayedTicketsCount } = this.state;

    const [tickets, isRequestFinished] = await fetchTickets(searchId);

    const { selectedSortingOptions } = this.state;

    this.setStopVariants(tickets);

    const { selectedStopOptions } = this.state;

    if (!this.ticketStorage.areTicketsExists) {
      this.ticketStorage.updateStorageWithNewTickets(tickets);

      this.setState({
        fetchStatus: fetchStatuses.fetching,
        tickets: this.ticketStorage.getCachedDisplayedTickets(selectedStopOptions, selectedSortingOptions, displayedTicketsCount),
      });
    } else {
      this.ticketStorage.updateStorageWithNewTickets(tickets);
    }

    if (isRequestFinished) {
      this.setState({
        fetchStatus: fetchStatuses.fetchingFinished,
        tickets: this.ticketStorage.getCachedDisplayedTickets(selectedStopOptions, selectedSortingOptions, displayedTicketsCount),
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
          && this.ticketStorage.areTicketsExists
          && (
            <Page__Section>
              <EmptySearchResultsMessage/>
            </Page__Section>
          )}

          {tickets.length > 0 && fetchStatus === fetchStatuses.fetching && !isErrorWhileFetching && (
            <Page__Section>
              <LineThrobber caption="Загрузка билетов"/>
            </Page__Section>
          )}

          {tickets.length > 0 && (
            <Page__Section>
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
