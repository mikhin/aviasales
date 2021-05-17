import React from 'react';

import { TicketsFilterForm, StopOption } from 'app/components/tickets-filter-form';
import { transfersFilterUnifyingOptionId } from 'app/constants/transfers-filter-unifying-option';

type Props = {
  onChange: (stopOptions: StopOption[]) => void;
  selectedStopOptions: StopOption[];
}

export class TicketsFilterFormContainer extends React.Component<Props> {
  areOptionsEqual = (selectedOptions: StopOption[], isChecked: boolean): boolean => selectedOptions
    .filter((option: StopOption) => option.id !== transfersFilterUnifyingOptionId)
    .every((option: StopOption) => option.isChecked === isChecked)

  toggleOption = (id: string, isChecked: boolean): StopOption[] => {
    const {
      selectedStopOptions,
      onChange,
    } = this.props;

    let stopOptions: StopOption[];

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
      onChange,
    } = this.props;

    const stopOptions = selectedStopOptions.map((option: StopOption) => ({
      ...option,
      isChecked,
    }));

    if (onChange) {
      onChange(stopOptions);
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
      selectedStopOptions,
    } = this.props;

    return (
      <TicketsFilterForm
        stopOptions={selectedStopOptions}
        onStopOptionChange={this.onStopOptionChange}
      />
    );
  }
}
