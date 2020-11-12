import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import Page, { Page__Main, Page__Section, Page__Sidebar } from '../../components/page';
import Filter from '../../components/filter';
import FilterFormContainer from '../../containers/filter-form-container';
import { stopOptionsType } from "../../components/filter-form";
import SortingFormContainer from '../../containers/sorting-form-container';
import { sortingOptionsType } from "../../components/sorting-form";
import TicketList, { TicketList__Item } from '../../components/ticket-list';
import TicketCardContainer from "../../containers/ticket-card-container";
import Throbber from "../../components/throbber";
import ServiceErrorNotice from "../../components/server-error-notice";

import Ticket from '../../types/ticket';
import retry from "../../helpers/retry";

const DISPLAYED_TICKETS_COUNT = 5;

type propType = RouteComponentProps;

type stateType = {
  searchId: string | null;
  tickets: Array<Ticket>;
  fetchStatus: string | null;
  stopOptions: stopOptionsType;
  sortingOptions: sortingOptionsType;
  isErrorWhileFetching: boolean;
}

const fetchStatuses = {
  initial: null,
  fetching: 'fetching',
  fetchingFinished: 'fetchingFinished',
}

class Tickets extends React.Component<propType, stateType> {
  state = {
    searchId: null,
    tickets: [],
    fetchStatus: fetchStatuses.initial,
    stopOptions: [],
    sortingOptions: [],
    isErrorWhileFetching: false,
  }

  rawTickets: Array<Ticket> = [];

  componentDidMount(): void {
    this.initializeSearchIdFetching();
  }

  componentDidUpdate(): void {
    this.initializeTicketsFetching();
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
    const { searchId, tickets, isErrorWhileFetching } = this.state;

    if (searchId && tickets.length === 0 && !isErrorWhileFetching) {
      try {
        await retry(this.fetchTickets, 3, 1000);
      } catch (error) {
        this.setState({
          isErrorWhileFetching: true,
          fetchStatus: fetchStatuses.fetchingFinished,
        })
      }
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

  filterTicketsByStops = (ticket: Ticket, filter: Array<number | undefined>): boolean => {
    if (filter.length > 0) {
      const [
        { stops: forwardStops },
        { stops: oppositeStops },
      ] = ticket.segments;

      return filter.includes(forwardStops.length) && filter.includes(oppositeStops.length);
    }

    return true;
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
        tickets: this.getDisplayedTickets(this.rawTickets, filter, sortingOptions),
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
        tickets: this.getDisplayedTickets(this.rawTickets, stopOptions, sorting),
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
    const { tickets, searchId, stopOptions, sortingOptions } = this.state;

    try {
      const response = await fetch(`/tickets?searchId=${searchId}`);

      const { tickets: fetchedTickets, stop } = await response.json();

      if (tickets.length === 0 && this.rawTickets.length === 0) {
        this.setState({
          fetchStatus: fetchStatuses.fetching,
          tickets: this.getDisplayedTickets(fetchedTickets, stopOptions, sortingOptions),
        });
      }

      this.rawTickets = [...this.rawTickets, ...fetchedTickets];

      if (stop) {
        this.setState({
          fetchStatus: fetchStatuses.fetchingFinished,
          tickets: this.getDisplayedTickets(this.rawTickets, stopOptions, sortingOptions),
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
      <Page>
        <Page__Sidebar>
          <Filter>
            <FilterFormContainer
              onChange={this.onFilterChange}
            />
          </Filter>
        </Page__Sidebar>

        <Page__Main>
          <Page__Section>
            <SortingFormContainer
              onChange={this.onSortingChange}
            />
          </Page__Section>


          {fetchStatus === fetchStatuses.fetching && (
            <Page__Section>
              <Throbber caption="Загрузка билетов"/>
            </Page__Section>
          )}

          {isErrorWhileFetching && tickets.length === 0 && (
            <Page__Section>
              <ServiceErrorNotice
                onReloadPage={this.reloadPage}
              />
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
