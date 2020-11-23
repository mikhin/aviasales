import React from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {parse, ParseOptions, stringify} from "query-string";

import SortingForm, {sortingOptionsType, sortingOptionType} from "../../components/sorting-form";

import sortingOptions from "../../constants/sorting";

type propType = RouteComponentProps & {
  onChange: (sortingOptions: sortingOptionsType) => void;
}

type stateType = {
  sortingOptions: sortingOptionsType;
}

const PARSE_QUERY_FORMAT: ParseOptions = {arrayFormat: 'comma'};

class SortingFormContainer extends React.Component<propType, stateType> {
  state = {
    sortingOptions: sortingOptions.map((option, index) => ({...option, isChecked: index === 0})),
  }

  componentDidMount(): void {
    this.initializeSortingOnMount();
  }

  initializeSortingOnMount(): void {
    const {
      location: {
        search
      },
    } = this.props;

    const {
      sortingOptions
    } = this.state;

    const {sorting: sortingValue} = parse(search, PARSE_QUERY_FORMAT);
    const queryParams = Array.isArray(sortingValue) ? sortingValue[0] : sortingValue;

    if (!!queryParams) {
      this.toggleOption(queryParams, true);
    } else {
      this.toggleOptionInHistory(sortingOptions[0].id);
      this.liftStateUp();
    }
  }

  toggleOptionInHistory = (id: string): void => {
    const {
      history,
      location: {
        search
      }
    } = this.props;

    const {...queryParams} = parse(search, PARSE_QUERY_FORMAT);

    history.push({
      search: stringify({...queryParams, sorting: id}, PARSE_QUERY_FORMAT),
    })
  }

  toggleOption = (id: string, isChecked: boolean): void => {
    this.setState(({sortingOptions}): stateType => ({
      sortingOptions: sortingOptions.map((option: sortingOptionType) => ({
        ...option,
        isChecked: option.id === id ? isChecked : false,
      })),
    }), this.liftStateUp);
  }

  liftStateUp = (): void => {
    const {
      onChange,
    } = this.props;

    const {
      sortingOptions
    } = this.state;

    if (onChange) onChange(sortingOptions);
  }

  onSortingOptionChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, checked } = event.currentTarget;

    this.toggleOption(id, checked);
    this.toggleOptionInHistory(id);
  }

  render(): React.ReactNode {
    const {
      sortingOptions
    } = this.state;

    return (
      <SortingForm
        sortingOptions={sortingOptions}
        onSortingOptionChange={this.onSortingOptionChange}
      />
    );
  }
}

export default withRouter(SortingFormContainer);
