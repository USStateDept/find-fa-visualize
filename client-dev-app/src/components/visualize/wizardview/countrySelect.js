import React, { Component, PropTypes } from "react";

class CountrySelect extends Component {
  render() {
    const {} = this.props;

    return (
      <div>
        <h1>Country View</h1>
      </div>
    );
  }
}

CountrySelect.PropTypes = {
  setup: PropTypes.object.isRequired
};

export default CountrySelect;
