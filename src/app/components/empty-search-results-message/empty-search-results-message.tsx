import React from 'react';

const EmptySearchResultsMessage: React.FC = () => {
  return (
    <div className="empty-search-results-message">
      <p className="empty-search-results-message__explanation">
        Мы нашли рейсы, но ни один не соответствует заданным фильтрам.
      </p>
    </div>
  );
};

export default EmptySearchResultsMessage;
