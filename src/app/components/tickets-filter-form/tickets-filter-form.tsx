import React from 'react';
import Form, {Form__Field, Form__FieldSet, Form__Legend} from "../form";
import CheckboxField from "../checkbox-field";

import AirTransfer from "../../types/air-transfer";

export type StopOption = AirTransfer & {
  isChecked: boolean;
}

export type StopOptions = Array<StopOption>;

type Props = {
  stopOptions: StopOptions;
  onStopOptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TicketsFilterForm: React.FC<Props> = ({stopOptions, onStopOptionChange}) => {
  return (
    <Form>
      <Form__FieldSet>
        <Form__Legend>
          Количество пересадок
        </Form__Legend>

        {stopOptions.map((option) => (
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
  );
}

export default TicketsFilterForm;
