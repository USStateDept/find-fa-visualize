import React, { Component, PropTypes } from "react";

class CountrySelect extends Component {
  render() {
    const {} = this.props;

    return (
      <div>
        <div className="viz-column">
          {/*<CountryMenu selectCty={this.selectCty.bind(this)} {...this.props} /> */
          }
          Country Menu
        </div>
      </div>
    );
  }
}

CountrySelect.PropTypes = {
  setup: PropTypes.object.isRequired
};

export default CountrySelect;
