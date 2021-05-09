import React from 'react';
import { Form, Form__Field, Form__FieldSet, Form__Legend } from 'app/components/form';
import { CheckboxField } from 'app/components/checkbox-field';
import { CircleThrobber } from 'app/components/circle-throbber';

import { AirTransfer } from 'app/types/air-transfer';

export type StopOption = AirTransfer & {
  isChecked: boolean;
}

export type StopOptions = Array<StopOption>;

type Props = {
  stopOptions: StopOptions;
  onStopOptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TicketsFilterForm: React.FC<Props> = React.memo(({ stopOptions, onStopOptionChange }) => (
  <Form mix="tickets-filter-form">
    <Form__FieldSet>
      <Form__Legend>
        Количество пересадок
      </Form__Legend>

      {stopOptions.length === 0 ? (
        <div className="tickets-filter-form__circle-throbber">
          <CircleThrobber caption="Загрузка вариантов фильтра пересадок"/>
        </div>
      ) : stopOptions.map((option) => (
        <Form__Field key={option.id}>
          <CheckboxField
            id={option.id}
            label={option.label}
            isChecked={option.isChecked}
            onChange={onStopOptionChange}
          />
        </Form__Field>
      ))}
    </Form__FieldSet>
  </Form>
));
