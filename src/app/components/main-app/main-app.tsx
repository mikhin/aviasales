import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import 'app/components/document';
import { AppLayout } from 'app/components/app-layout';

import Tickets from 'app/views/tickets';

export const MainApp: React.FC = () => (
  <AppLayout>
    <BrowserRouter>
      <Route exact path="/" component={Tickets}/>
    </BrowserRouter>
  </AppLayout>
);
