import React from 'react';

type Props = {
  id: string;
  label: string;
  isChecked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CheckboxField: React.FC<Props> = React.memo(({ id, label, isChecked, onChange }) => (
  <div className="checkbox-field">
    <input
      className="checkbox-field__input"
      type="checkbox"
      id={id}
      checked={isChecked}
      onChange={onChange}
    />
    <label className="checkbox-field__label" htmlFor={id}>
      {label}
    </label>
  </div>
));
