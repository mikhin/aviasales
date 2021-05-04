import React from 'react';
import { Button } from 'app/components/button';

type Props = {
  onReloadPage: () => void;
}

export const ServerErrorNotice: React.FC<Props> = ({ onReloadPage }) => {
  return (
    <div className="server-error-notice">
      <p className="server-error-notice__explanation">
        Произошла ошибка, приносим извинения. Попробуйте обновить страницу
      </p>
      <Button
        onClick={onReloadPage}
        mods={{
          theme: 'ghost',
          size: 'm',
        }}
      >
        Обновить страницу
      </Button>
    </div>
  );
};
