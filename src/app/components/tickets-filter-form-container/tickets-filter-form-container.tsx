import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { parse, stringify } from 'query-string';

import TicketsFilterForm, { StopOptions, StopOption } from "app/components/tickets-filter-form";

import queryStringParseFormat from 'app/constants/query-string-parse-format';
import stops from "app/constants/stops";

type Props = RouteComponentProps & {
  onChange: (stopOptions: StopOptions) => void;
}
type State = {
  stopOptions: StopOptions;
}

const UNIFYING_OPTION_ID = 'all';

class TicketsFilterFormContainer extends React.Component<Props, State> {
  state = {
    stopOptions: stops.map((option) => ({ ...option, isChecked: false })),
  }

  componentDidMount(): void {
    this.initializeFilterOnMount();
  }

  initializeFilterOnMount(): void {
    const {
      location: {
        search
      },
    } = this.props;

    const { filter: filterValue } = parse(search, queryStringParseFormat);

    if (!filterValue) {
      this.toggleAllOptions(true, () => {
        this.toggleUnifyingOptionInHistory(true);
        this.liftStateUp();
      });
    } else {
      const queryParams = Array.isArray(filterValue) ? filterValue : [filterValue];

      this.toggleOptions(queryParams, () => {
        this.toggleUnifyingOptionIfNeeded(true);
      });
    }
  }

  areAllOptionsEqual = (isChecked: boolean): boolean => this.state.stopOptions
    .filter((option: StopOption) => option.id !== UNIFYING_OPTION_ID)
    .every((option: StopOption) => option.isChecked === isChecked)

  toggleUnifyingOptionInHistory = (isChecked: boolean): void => {
    const {
      history,
      location: {
        search
      }
    } = this.props;

    const {
      stopOptions
    } = this.state;

    const { filter, ...restQueryParams } = parse(search, queryStringParseFormat);

    if (isChecked) {
      history.push({
        search: stringify({
          filter: stopOptions
            .filter((stop: StopOption) => stop.isChecked && stop.id !== UNIFYING_OPTION_ID)
            .map((stop: StopOption) => stop.id),
          ...restQueryParams
        }, queryStringParseFormat),
      })
    } else {
      history.push({
        search: stringify({ filter: undefined, ...restQueryParams }, queryStringParseFormat)
      })
    }
  }

  toggleOptionInHistory = (id: string, isChecked: boolean): void => {
    const {
      history,
      location: {
        search
      }
    } = this.props;

    const { filter: filterValue = '', ...restQueryParams } = parse(search, queryStringParseFormat);
    const queryParams = Array.isArray(filterValue) ? filterValue : [filterValue];

    const newQueryParams = isChecked
      ? [...(queryParams.includes(id) ? queryParams : [...queryParams as [], id]) as []]
      : queryParams.filter((item) => item !== id);

    history.push({
      search: stringify({ filter: newQueryParams, ...restQueryParams }, queryStringParseFormat),
    })
  }

  toggleUnifyingOptionIfNeeded = (isChecked: boolean): void => {
    if (this.areAllOptionsEqual(isChecked)) {
      this.toggleAllOptions(isChecked, this.liftStateUp);
    } else {
      this.toggleOption(UNIFYING_OPTION_ID, false, this.liftStateUp);
    }
  }

  toggleOption = (id: string, isChecked: boolean, onAfterStateUpdate?: () => void): void => {
    this.setState(({ stopOptions }): State => ({
      stopOptions: stopOptions.map((option: StopOption) => ({
        ...option,
        isChecked: option.id === id ? isChecked : option.isChecked,
      })),
    }), onAfterStateUpdate);
  }

  toggleOptions = (ids: Array<string>, onAfterStateUpdate?: () => void): void => {
    this.setState(({ stopOptions }): State => ({
      stopOptions: stopOptions.map((option: StopOption) => ({
        ...option,
        isChecked: ids.includes(option.id),
      })),
    }), onAfterStateUpdate);
  }

  toggleAllOptions = (isChecked: boolean, onAfterStateUpdate?: () => void): void => {
    this.setState(({ stopOptions }): State => ({
      stopOptions: stopOptions.map((option: StopOption) => ({
        ...option,
        isChecked: isChecked
      })),
    }), onAfterStateUpdate);
  }

  onStopOptionChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, checked } = event.currentTarget;

    if (id === UNIFYING_OPTION_ID) {
      this.toggleAllOptions(checked, () => {
        this.toggleUnifyingOptionInHistory(checked);
        this.liftStateUp();
      });
    } else {
      this.toggleOption(id, checked, () => {
        this.toggleOptionInHistory(id, checked);
        this.toggleUnifyingOptionIfNeeded(checked);
      });
    }
  }

  liftStateUp = (): void => {
    const { stopOptions } = this.state;
    const { onChange } = this.props;

    if (onChange) onChange(stopOptions);
  }

  render(): React.ReactNode {
    const {
      stopOptions
    } = this.state;

    return (
      <TicketsFilterForm
        stopOptions={stopOptions}
        onStopOptionChange={this.onStopOptionChange}
      />
    )
  }
}

export default withRouter(TicketsFilterFormContainer);
