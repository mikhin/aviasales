import React from 'react';

import Page from '../../components/page';
import TicketPageLayout, {
  TicketPageLayout__Filter,
  TicketPageLayout__SortingControl,
  TicketPageLayout__TicketList,
} from '../../components/ticket-page-layout';
import Filter from '../../components/filter';
import TicketList, { TicketList__Item } from '../../components/ticket-list';
import TicketCard from '../../components/ticket-card';
import TicketFilterForm from '../../components/ticket-filter-form';
import SortingControlForm from '../../components/sorting-control-form';

const stopOptions = [
  {
    id: 'all',
    label: 'Все',
  },
  {
    id: 'without-stops',
    label: 'Без пересадок',
  },
  {
    id: '1-stop',
    label: '1 пересадка',
  },
  {
    id: '2-stops',
    label: '2 пересадки',
  },
  {
    id: '3-stops',
    label: '3 пересадки',
  },
];

class TicketPage extends React.Component<any, any> {
  render() {
    return (
      <Page>
        <TicketPageLayout>
          <TicketPageLayout__Filter>
            <Filter>
              <TicketFilterForm
                stopOptions={stopOptions}
              />
            </Filter>
          </TicketPageLayout__Filter>
          <TicketPageLayout__SortingControl>
            <SortingControlForm
              onChange={console.log}
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
