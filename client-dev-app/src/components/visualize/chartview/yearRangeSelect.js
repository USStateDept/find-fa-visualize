import React, { PropTypes, Component } from "react";

//TODO Add radial button toggle between range and all

const YearSelect = ({ originalYearRange, selectYear, label, year }) => (
  <div>
    <div className="Chart__banner-tool Chart__chart-dropdown">
      <label>{label}</label>
      <select onChange={selectYear.bind(this)}>
        <option value="null">{year}</option>
        {originalYearRange.map((y, i) => <option key={i} value={y}>{y}</option>)}
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
      endLabel: "Last Year of Range: ",
      selectedYearRange: props.selectedYearRange,
      originalYearRange: props.originalYearRange
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
      endLabel,
      selectedYearRange,
      originalYearRange
    } = this.props;

    return (

      <div className="viz-chart-settings">
        Showing {listYears[0]} through {listYears[(listYears.length - 2)]}
        <YearSelect
          globalChangeYear={this.props._onChangeYear}
          listYears={listYears}
          selectedYearRange={selectedYearRange}
          originalYearRange={originalYearRange}
          year={listYears[0]}
          selectYear={selectStartYear}
          label="First Year of Range:"
        />

        <YearSelect
          globalChangeYear={this.props._onChangeYear}
          listYears={listYears}
          selectedYearRange={selectedYearRange}
          originalYearRange={originalYearRange}
          year={listYears[(listYears.length - 2)]}
          selectYear={selectEndYear}
          label="Last Year of Range:"
        />

      </div>
    );
  }
}

export default YearRangeSelect;