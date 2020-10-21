import React from 'react';
import {BrowserRouter} from 'react-router-dom';

import TicketPage from './app/views/ticket-page';

import './app/components/document';


const App: React.FC = () => (
  <BrowserRouter>
    <TicketPage/>
  </BrowserRouter>
);

export default App;
