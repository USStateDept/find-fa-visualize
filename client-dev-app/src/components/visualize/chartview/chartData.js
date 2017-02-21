import React, { PropTypes, Component } from "react";

import _ from "lodash";
import $ from "jquery";

class ChartData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      countries: props.data.countries,
      indicators: props.data.indicators
    };
  }

  componentWillMount() {
    this.setState({
      data: this.state.data,
      countries: this.state.countries,
      indicators: this.state.indicators
    });
  }

  componentDidMount() {
    let headerCreated = false;
    let header = "";
    let body = "";

    _.forIn(
      this.props.data.dataTableSet,
      (cobj, country) => {
        !headerCreated
          ? header += '<tr class="Chart__data-head"><th>Country</th><th>Indicator</th>'
          : null;

        _.forIn(
          cobj,
          (iobj, indicator) => {
            body += `<tr><td>${country}</td><td>${indicator}</td>`;
            _.forIn(
              iobj,
              (value, year) => {
                !headerCreated ? header += "<th>" + year + "</th>" : null;
                body += `<td>${value}</td>`;
              },
              this
            );
            body += "</tr>";

            header += "</tr>";
            headerCreated = true;
          },
          this
        );
      },
      this
    );

    $("#DataTable > tbody:last-child").append(header);
    $("#DataTable > tbody:last-child").append(body);
  }

  /**
   * Datatable CSV download
   */
  download() {
    let countries = this.state.countries;
    let indicators = this.state.indicators;
    // file headers
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Indicator,Country,Year,Value,Continent,DOS Group, Income Group, ISO, USAID Group\n";

    _.forEach(this.state.data.dataSet, value => {
      let val = value.Value;
      let year = value.Date;
      let index = _.findIndex(countries, c => {
        return c.Country_ID === value.Location_ID;
      });
      let country = countries[index].Name.replace(",", "");
      let index2 = _.findIndex(indicators, i => {
        return i.id === value.Indicator_ID;
      });
      let indicator = indicators[index2].name.replace(",", "");

      // file addition
      csvContent += indicator +
        "," +
        country +
        "," +
        year +
        "," +
        val +
        "," +
        countries[index]["Continent"] +
        "," +
        countries[index]["DOS_Group"] +
        "," +
        countries[index]["INCOME_Group"] +
        "," +
        countries[index]["ISO"] +
        "," +
        countries[index]["USAID_Group"] +
        "\n";
    });

    var uri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", uri);
    link.setAttribute("download", "data.csv");
    link.click();
  }

  render() {
    return this.state.data === {}
      ? <span />
      : <div className="Chart__container">
          <a onClick={this.download.bind(this)} className="Chart__data-csv">
            Download to csv
          </a>
          <table className="Chart__data-table" id="DataTable">
            <tbody />
          </table>
        </div>;
  }
}

ChartData.propTypes = {
  data: PropTypes.object.isRequired
};

export default ChartData;
