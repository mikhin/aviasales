import React from 'react';

import { SortingForm, SortingOptions, SortingOption } from 'app/components/sorting-form';

type Props = {
  onChange: (sortingOptions: SortingOptions) => void;
  selectedSortingOptions: SortingOptions;
}

export class SortingFormContainer extends React.Component<Props> {
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
      <SortingForm
        sortingOptions={selectedSortingOptions}
        onSortingOptionChange={this.onSortingOptionChange}
      />
    );
  }
}
