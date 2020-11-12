import React from 'react';

type propType = {
  onReloadPage: () => void;
}

const ServerErrorNotice: React.FC<propType> = ({ onReloadPage }) => {
  return (
    <div className="server-error-notice">
      <p className="server-error-notice__explanation">
        Произошла ошибка, приносим извинения. Попробуйте обновить страницу
      </p>
      <button
        type="button"
        onClick={onReloadPage}
        className="server-error-notice__action"
      >
        Обновить страницу
      </button>
    </div>
  );
};

export default ServerErrorNotice;