import { Request } from 'puppeteer';
import searchIdStub from './data/search-id';

function setSearchIdStub(interceptedRequest: Request): void {
  interceptedRequest.respond({
    status: 200,
    contentType: 'text/plain',
    body: JSON.stringify(searchIdStub),
  });
}

export default setSearchIdStub;
