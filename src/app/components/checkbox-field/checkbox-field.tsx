import React from 'react';

type Props = {
  id: string;
  label: string;
  isChecked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxField: React.FC<Props> = ({id, label, isChecked, onChange}) => {
  return (
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
  );
}

export default CheckboxField;
