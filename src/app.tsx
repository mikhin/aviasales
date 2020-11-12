import React from 'react';
import {BrowserRouter} from 'react-router-dom';

import TicketsPageContainer from "./app/containers/tickets-page-container";

import './app/components/document';

const App: React.FC = () => (
  <BrowserRouter>
    <TicketsPageContainer/>
  </BrowserRouter>
);

export default App;
