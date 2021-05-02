import React from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {parse, stringify} from "query-string";

import SortingForm, {SortingOptions, SortingOption} from "app/components/sorting-form";

import queryStringParseFormat from 'app/constants/query-string-parse-format';
import sortingOptions from "app/constants/sorting";

type Props = RouteComponentProps & {
  onChange: (sortingOptions: SortingOptions) => void;
}

type State = {
  sortingOptions: SortingOptions;
}

class SortingFormContainer extends React.Component<Props, State> {
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

    const {sorting: sortingValue} = parse(search, queryStringParseFormat);
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

    const {...queryParams} = parse(search, queryStringParseFormat);

    history.push({
      search: stringify({...queryParams, sorting: id}, queryStringParseFormat),
    })
  }

  toggleOption = (id: string, isChecked: boolean): void => {
    this.setState(({sortingOptions}): State => ({
      sortingOptions: sortingOptions.map((option: SortingOption) => ({
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
