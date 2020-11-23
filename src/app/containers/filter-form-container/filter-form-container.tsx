import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { parse, ParseOptions, stringify } from 'query-string';

import FilterForm, { stopOptionsType, stopOptionType } from "../../components/filter-form";

import stops from "../../constants/stops";

type propType = RouteComponentProps & {
  onChange: (stopOptions: stopOptionsType) => void;
}
type stateType = {
  stopOptions: stopOptionsType;
}

const UNIFYING_OPTION_ID = 'all';
const PARSE_QUERY_FORMAT: ParseOptions = { arrayFormat: 'comma' };

class FilterFormContainer extends React.Component<propType, stateType> {
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

    const { filter: filterValue } = parse(search, PARSE_QUERY_FORMAT);

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
    .filter((option: stopOptionType) => option.id !== UNIFYING_OPTION_ID)
    .every((option: stopOptionType) => option.isChecked === isChecked)

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

    const { filter, ...restQueryParams } = parse(search, PARSE_QUERY_FORMAT);

    if (isChecked) {
      history.push({
        search: stringify({
          filter: stopOptions
            .filter((stop: stopOptionType) => stop.isChecked && stop.id !== UNIFYING_OPTION_ID)
            .map((stop: stopOptionType) => stop.id),
          ...restQueryParams
        }, PARSE_QUERY_FORMAT),
      })
    } else {
      history.push({
        search: stringify({ filter: undefined, ...restQueryParams }, PARSE_QUERY_FORMAT)
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

    const { filter: filterValue = '', ...restQueryParams } = parse(search, PARSE_QUERY_FORMAT);
    const queryParams = Array.isArray(filterValue) ? filterValue : [filterValue];

    const newQueryParams = isChecked
      ? [...(queryParams.includes(id) ? queryParams : [...queryParams as [], id]) as []]
      : queryParams.filter((item) => item !== id);

    history.push({
      search: stringify({ filter: newQueryParams, ...restQueryParams }, PARSE_QUERY_FORMAT),
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
    this.setState(({ stopOptions }): stateType => ({
      stopOptions: stopOptions.map((option: stopOptionType) => ({
        ...option,
        isChecked: option.id === id ? isChecked : option.isChecked,
      })),
    }), onAfterStateUpdate);
  }

  toggleOptions = (ids: Array<string>, onAfterStateUpdate?: () => void): void => {
    this.setState(({ stopOptions }): stateType => ({
      stopOptions: stopOptions.map((option: stopOptionType) => ({
        ...option,
        isChecked: ids.includes(option.id),
      })),
    }), onAfterStateUpdate);
  }

  toggleAllOptions = (isChecked: boolean, onAfterStateUpdate?: () => void): void => {
    this.setState(({ stopOptions }): stateType => ({
      stopOptions: stopOptions.map((option: stopOptionType) => ({
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
      <FilterForm
        stopOptions={stopOptions}
        onStopOptionChange={this.onStopOptionChange}
      />
    )
  }
}

export default withRouter(FilterFormContainer);
