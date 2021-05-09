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

export const SortingForm: React.FC<Props> = React.memo(({ sortingOptions, onSortingOptionChange }) => (
  <form className="sorting-form">
    {sortingOptions.map((option: SortingOption) => (
      <div key={option.id} className="sorting-form__option">
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
      </div>
    ))}
  </form>
));
