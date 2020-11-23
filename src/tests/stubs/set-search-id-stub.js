const searchIdStub = require('./data/search-id');

function setSearchIdStub(interceptedRequest) {
  return interceptedRequest.respond({
    status: 200,
    contentType: 'text/plain',
    body: JSON.stringify(searchIdStub),
  });
}

module.exports = setSearchIdStub;
