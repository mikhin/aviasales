import React from 'react';

type Props = {
  onReloadPage: () => void;
}

export const ServerErrorNotice: React.FC<Props> = ({ onReloadPage }) => {
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
