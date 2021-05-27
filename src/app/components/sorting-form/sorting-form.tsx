import React from 'react';
import { SortingOption } from 'app/types/sorting-option';

type Props = {
  onChange: (sortingOptions: SortingOption[]) => void;
  selectedSortingOptions: SortingOption[];
}

export class SortingForm extends React.Component<Props> {
  onSortingOptionChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const {
      selectedSortingOptions,
      onChange,
    } = this.props;

    const { id, checked } = event.currentTarget;

    const sortingOptions = selectedSortingOptions.map((option: SortingOption) => ({
      ...option,
      isChecked: option.id === id ? checked : false,
    }));

    if (onChange) {
      onChange(sortingOptions);
    }
  }

  render(): React.ReactNode {
    const {
      selectedSortingOptions,
    } = this.props;

    return (
      <form className="sorting-form">
        {selectedSortingOptions.map((option: SortingOption) => (
          <div key={option.id} className="sorting-form__option">
            <input
              className="sorting-form__input"
              type="radio"
              id={option.id}
              onChange={this.onSortingOptionChange}
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
    );
  }
}
