import React, { PropTypes, Component } from "react";

class ChartSource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metadata: props.data.metadataSet
    };
  }

  componentWillMount() {
    this.setState({
      metadata: this.state.metadata
    });
  }

  render() {
    return (
      <div className="Chart__container">
        {this.state.metadata.map((row, i) => (
          <table className="Chart__data-table">
            <caption>{row.Indicator_Name}</caption>
            <tbody>
              <tr>
                <td><h5>Indicator Source:</h5> </td>
                <td>{row.Direct_Indicator_Source}</td>
              </tr>
              <tr>
                <td><h5>Original Indicator Source: </h5> </td>
                <td>{row.Original_Indicator_Source}</td>
              </tr>
              <tr>
                <td><h5>Indicator URL:</h5> </td><td> {row.Indicator_URL}</td>
              </tr>
              <tr>
                <td><h5>Indicator Data URL: </h5> </td>
                <td>{row.Indicator_Data_URL}</td>
              </tr>
              <tr>
                <td><h5>Units: </h5> </td><td>{row.Units}</td>
              </tr>
              <tr>
                <td><h5>Indicator Definition: </h5> </td>
                <td>{row.Indicator_Definition}</td>
              </tr>
            </tbody>
          </table>
        ))}

      </div>
    );
  }
}

ChartSource.propTypes = {
  data: PropTypes.object.isRequired
};

export default ChartSource;
