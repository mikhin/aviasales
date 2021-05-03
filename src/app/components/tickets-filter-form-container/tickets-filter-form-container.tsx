import React from 'react';

import { TicketsFilterForm, StopOptions, StopOption } from "app/components/tickets-filter-form";
import { transfersFilterUnifyingOptionId } from 'app/constants/transfers-filter-unifying-option';

type Props = {
  onChange: (stopOptions: StopOptions) => void;
  selectedStopOptions: StopOptions;
}

export class TicketsFilterFormContainer extends React.Component<Props> {
  areOptionsEqual = (selectedOptions: StopOptions, isChecked: boolean): boolean => selectedOptions
    .filter((option: StopOption) => option.id !== transfersFilterUnifyingOptionId)
    .every((option: StopOption) => option.isChecked === isChecked)

  toggleOption = (id: string, isChecked: boolean): StopOptions => {
    const {
      selectedStopOptions,
      onChange
    } = this.props;

    let stopOptions: StopOptions;

    stopOptions = selectedStopOptions.map((option: StopOption) => ({
      ...option,
      isChecked: option.id === id ? isChecked : option.isChecked,
    }));

    stopOptions = stopOptions.map((option: StopOption) => ({
      ...option,
      isChecked: option.id === transfersFilterUnifyingOptionId
        ? this.areOptionsEqual(stopOptions, isChecked) ? isChecked : false
        : option.isChecked,
    }));

    if (onChange) {
      onChange(stopOptions);
    }

    return stopOptions;
  }

  toggleAllOptions = (isChecked: boolean): void => {
    const {
      selectedStopOptions,
      onChange
    } = this.props;

    const stopOptions = selectedStopOptions.map((option: StopOption) => ({
      ...option,
      isChecked: isChecked
    }));

    if (onChange) {
      onChange(stopOptions)
    }
  }

  onStopOptionChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, checked } = event.currentTarget;

    if (id === transfersFilterUnifyingOptionId) {
      this.toggleAllOptions(checked);
    } else {
      this.toggleOption(id, checked);
    }
  }

  render(): React.ReactNode {
    const {
      selectedStopOptions
    } = this.props;

    return (
      <TicketsFilterForm
        stopOptions={selectedStopOptions}
        onStopOptionChange={this.onStopOptionChange}
      />
    )
  }
}
