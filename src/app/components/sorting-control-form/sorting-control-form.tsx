import React from 'react';

type propType = {
  onChange: () => void;
}

const SortingControlForm: React.FC<propType> = ({ onChange }) => {
  return (
    <form className="sorting-control-form">
      <input
        className="sorting-control-form__input"
        type="radio"
        id="cheapestFirst"
        name="ticketSorting"
        value="cheapestFirst"
        onChange={onChange}
      />
      <label
        className="sorting-control-form__label"
        htmlFor="cheapestFirst"
      >
        Самый дешевый
      </label>
      <input
        className="sorting-control-form__input"
        type="radio"
        id="fastestFirst"
        name="ticketSorting"
        value="fastestFirst"
        onChange={onChange}
      />
      <label
        className="sorting-control-form__label"
        htmlFor="fastestFirst"
      >
        Самый быстрый
      </label>
    </form>
  );
}

export default SortingControlForm;
