import { Request } from 'puppeteer';

function setStub(request: Request, stubData: unknown): void {
  request.respond({
    status: 200,
    contentType: 'text/plain',
    body: JSON.stringify(stubData),
  });
}

export default setStub;
