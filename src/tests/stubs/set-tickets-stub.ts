import { Request } from 'puppeteer';
import ticketsStub from './data/tickets';

function setTicketsStub(interceptedRequest: Request): void {
  interceptedRequest.respond({
    status: 200,
    contentType: 'text/plain',
    body: JSON.stringify(ticketsStub),
  });
}

export default setTicketsStub;
