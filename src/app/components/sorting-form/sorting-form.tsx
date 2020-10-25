import React from 'react';

import stopType from "../../types/business/stop";

export type sortingOptionType = stopType & {
  isChecked: boolean;
}

export type sortingOptionsType = Array<sortingOptionType>;

type propType = {
  sortingOptions: sortingOptionsType;
  onSortingOptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SortingForm: React.FC<propType> = ({sortingOptions, onSortingOptionChange}) => {
  return (
    <form className="sorting-form">
      {sortingOptions.map((option: sortingOptionType) => (
        <React.Fragment key={option.id}>
          <input
            className="sorting-form__input"
            type="radio"
            id={option.id}
            onChange={onSortingOptionChange}
            checked={option.isChecked}
          />
          <label
            className="sorting-form__label"
            htmlFor={option.id}
          >
            {option.label}
          </label>
        </React.Fragment>
      ))}
    </form>
  );
}

export default SortingForm;
