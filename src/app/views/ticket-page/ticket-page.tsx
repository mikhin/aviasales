import React from 'react';

import Page from '../../components/page';
import TicketPageLayout, {
  TicketPageLayout__Filter,
  TicketPageLayout__SortingControl,
  TicketPageLayout__TicketList,
} from '../../components/ticket-page-layout';
import Filter from '../../components/filter';
import TicketList, {TicketList__Item} from '../../components/ticket-list';
import TicketCard from '../../components/ticket-card';
import FilterFormContainer from '../../components/filter-form-container';
import SortingFormContainer from '../../components/sorting-form-container';

class TicketPage extends React.Component {
  onFilterChange = (): void => console.log();

  onSortingChange = (): void => console.log();

  render(): React.ReactNode {
    return (
      <Page>
        <TicketPageLayout>
          <TicketPageLayout__Filter>
            <Filter>
              <FilterFormContainer
                onChange={this.onFilterChange}
              />
            </Filter>
          </TicketPageLayout__Filter>
          <TicketPageLayout__SortingControl>
            <SortingFormContainer
              onChange={this.onSortingChange}
            />
          </TicketPageLayout__SortingControl>
          <TicketPageLayout__TicketList>
            <TicketList>
              <TicketList__Item>
                <TicketCard/>
              </TicketList__Item>
              <TicketList__Item>
                <TicketCard/>
              </TicketList__Item>
              <TicketList__Item>
                <TicketCard/>
              </TicketList__Item>
              <TicketList__Item>
                <TicketCard/>
              </TicketList__Item>
              <TicketList__Item>
                <TicketCard/>
              </TicketList__Item>
            </TicketList>
          </TicketPageLayout__TicketList>
        </TicketPageLayout>
      </Page>
    );
  }
}

export default TicketPage;
