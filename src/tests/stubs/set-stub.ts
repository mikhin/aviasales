import { Request } from 'puppeteer';

export const setStub = (request: Request, stubData: unknown): void => {
  request.respond({
    status: 200,
    contentType: 'text/plain',
    body: JSON.stringify(stubData),
  });
};
