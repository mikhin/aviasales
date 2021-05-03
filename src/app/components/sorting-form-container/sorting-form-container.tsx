import React from 'react';

import { SortingForm, SortingOptions, SortingOption} from "app/components/sorting-form";

type Props = {
  onChange: (sortingOptions: SortingOptions) => void;
  selectedSortingOptions: SortingOptions;
}

export class SortingFormContainer extends React.Component<Props> {
  toggleOption = (id: string, isChecked: boolean): void => {
    const {
      selectedSortingOptions,
      onChange
    } = this.props;

    const sortingOptions = selectedSortingOptions.map((option: SortingOption) => ({
      ...option,
      isChecked: option.id === id ? isChecked : false,
    }));

    if (onChange) {
      onChange(sortingOptions)
    }
  }

  onSortingOptionChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, checked } = event.currentTarget;

    this.toggleOption(id, checked);
  }

  render(): React.ReactNode {
    const {
      selectedSortingOptions
    } = this.props;

    return (
      <SortingForm
        sortingOptions={selectedSortingOptions}
        onSortingOptionChange={this.onSortingOptionChange}
      />
    );
  }
}
