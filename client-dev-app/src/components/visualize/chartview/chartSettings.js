import React, { PropTypes, Component } from "react";
import YearRangeSelect from "./yearRangeSelect";

// const YearSelect = ({ listYears, selectYear }) => (
//   <div>
//     <h3>Select Year(s):</h3>
//     <div className="Chart__banner-tool Chart__chart-dropdown">
//       <select onChange={selectYear.bind(this)}>
//         <option value="null">Select Year</option>
//         {listYears.map((y, i) => <option key={i} value={y}>{y}</option>)}
//       </select>
//     </div>
//   </div>
// );

class ChartSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listYears: props.listYears,
      startYear: props.startYear,
      endYear: props.endYear,
      selectStartYear: props.selectStartYear,
      selectEndYear: props.selectEndYear,
      calculateYearRange: props.calculateYearRange
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
      calculateYearRange
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
        />

      </div>
    );
  }
}

export default ChartSettings;
