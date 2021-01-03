import React from 'react';
import {BrowserRouter} from 'react-router-dom';

import Tickets from "./app/views/tickets";

import './app/components/document';

const App: React.FC = () => (
  <BrowserRouter>
    <Tickets/>
  </BrowserRouter>
);

export default App;
