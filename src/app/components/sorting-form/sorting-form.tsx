import React from 'react';

export type SortingOption = {
  id: string;
  label: string;
  isChecked: boolean;
}

export type SortingOptions = Array<SortingOption>;

type Props = {
  sortingOptions: SortingOptions;
  onSortingOptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SortingForm: React.FC<Props> = ({sortingOptions, onSortingOptionChange}) => {
  return (
    <form className="sorting-form">
      {sortingOptions.map((option: SortingOption) => (
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
