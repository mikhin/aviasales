import React from 'react';
import Form, {Form__Field, Form__FieldSet, Form__Legend} from "../form";
import CheckboxField from "../checkbox-field";

import stopType from "../../types/stop";

export type stopOptionType = stopType & {
  isChecked: boolean;
}

export type stopOptionsType = Array<stopOptionType>;

type propType = {
  stopOptions: stopOptionsType;
  onStopOptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FilterForm: React.FC<propType> = ({stopOptions, onStopOptionChange}) => {
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

export default FilterForm;
