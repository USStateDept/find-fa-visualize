import React, { PropTypes, Component } from "react";

const YearSelect = ({ listYears, selectYear }) => (
  <div>
    <h3>Select Year(s):</h3>
    <div className="Chart__banner-tool Chart__chart-dropdown">
      <select onChange={selectYear.bind(this)}>
        <option value="null">Select Year</option>
        {listYears.map((y, i) => <option key={i} value={y}>{y}</option>)}
      </select>
    </div>
  </div>
);

class ChartSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listYears: props.listYears,
      startYear: props.startYear
    };
  }

  render() {
    const {
      chartType,
      startYear,
      listYears,
      selectYear
    } = this.props;

    return (
      <div className="viz-chart-settings">

        <YearSelect
          globalChangeYear={this.props._onChangeYear}
          listYears={listYears}
          startYear={startYear}
          selectYear={selectYear}
        />

      </div>
    );
  }
}

export default ChartSettings;
