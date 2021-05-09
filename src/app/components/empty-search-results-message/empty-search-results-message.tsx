import React from 'react';

export const EmptySearchResultsMessage: React.FC = () => (
  <div className="empty-search-results-message">
    <p className="empty-search-results-message__explanation">
      Мы нашли рейсы, но ни один не соответствует заданным фильтрам.
    </p>
  </div>
);
