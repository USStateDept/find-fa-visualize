import React, { PropTypes, Component } from "react";
import YearRangeSelect from "./yearRangeSelect";

class ChartSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listYears: props.listYears,
      startYear: props.startYear,
      endYear: props.endYear,
      selectStartYear: props.selectStartYear,
      selectEndYear: props.selectEndYear,
      calculateYearRange: props.calculateYearRange,
      selectedYearRange: props.selectedYearRange,
      originalYearRange: props.originalYearRange
    };
  }

  render() {
    const {
      chartType,
      startYear,
      listYears,
      endYear,
      selectStartYear,
      selectEndYear,
      calculateYearRange,
      originalYearRange,
      selectedYearRange
    } = this.props;

    return (
      <div className="viz-chart-settings">

        <YearRangeSelect
          globalChangeYear={this.props._onChangeYear}
          listYears={listYears}
          startYear={startYear}
          endYear={endYear}
          selectStartYear={selectStartYear}
          selectEndYear={selectEndYear}
          calculateYearRange={calculateYearRange}
          originalYearRange={originalYearRange}
          selectedYearRange={selectedYearRange}
        />

      </div>
    );
  }
}

export default ChartSettings;
