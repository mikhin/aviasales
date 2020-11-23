const ticketsStub = require('./data/tickets');

function setTicketsStub(interceptedRequest) {
  return interceptedRequest.respond({
    status: 200,
    contentType: 'text/plain',
    body: JSON.stringify(ticketsStub),
  });
}

module.exports = setTicketsStub;
