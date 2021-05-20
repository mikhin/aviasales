import React from 'react';
import { Button } from 'app/components/button';

type Props = {
  onRetry: () => void;
}

export const ServerErrorNotice: React.FC<Props> = ({ onRetry }) => (
  <div className="server-error-notice">
    <p className="server-error-notice__explanation">
      Произошла ошибка, приносим извинения. Попробуйте повторить запрос.
    </p>
    <Button
      onClick={onRetry}
      theme="ghost"
      size="m"
    >
      Повторить запрос
    </Button>
  </div>
);
