import React, { PropTypes, Component } from "react";

const YearSelect = ({ listYears, selectYear, label, year }) => (
  <div>
    <div className="Chart__banner-tool Chart__chart-dropdown">
      <label>{label}</label>
      <select onChange={selectYear.bind(this)}>
        <option value="null">Select Year</option>
        {listYears.map((y, i) => <option key={i} value={y}>{y}</option>)}
      </select>
    </div>
  </div>
);

class YearRangeSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listYears: props.listYears,
      startYear: props.startYear,
      endYear: props.endYear,
      selectStartYear: props.selectStartYear,
      selectEndYear: props.selectEndYear,
      calculateYearRange: props.calculateYearRange,
      startLabel: "First Year of Range: ",
      endLabel: "Last Year of Range: "
    };
  }

  render() {
    const {
      chartType,
      startYear,
      endYear,
      listYears,
      selectStartYear,
      selectEndYear,
      calculateYearRange,
      startLabel,
      endLabel
    } = this.props;

    return (
      <div className="viz-chart-settings">
        
        <YearSelect
          globalChangeYear={this.props._onChangeYear}
          listYears={listYears}
          year={startYear}
          selectYear={selectStartYear}
          label="First Year of Range:"
          style="margin-left: 2em"
        />

        <YearSelect
          globalChangeYear={this.props._onChangeYear}
          listYears={listYears}
          year={endYear}
          selectYear={selectEndYear}
          label="Last Year of Range:"
        />

      </div>
    );
  }
}

export default YearRangeSelect;