import React from 'react';

import 'app/components/document';
import { AppLayout } from 'app/components/app-layout';

import Tickets from 'app/views/tickets';

export const MainApp: React.FC = () => (
  <AppLayout>
    <Tickets/>
  </AppLayout>
);
