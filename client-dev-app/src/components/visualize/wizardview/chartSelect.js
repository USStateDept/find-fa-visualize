import React, { Component } from "react";

class ChartList extends Component {
  render() {
    let chartNames = this.props.list.map(n => {
      return n == "Bubble-3"
        ? { id: "Bubble-3", display: "bubble" }
        : n == "Stacked-Bar"
            ? { id: "Stacked-Bar", display: "bar-chart" }
            : { id: n, display: n.toLowerCase() };
    });
    return (
      <div>
        {chartNames.map((n, i) => (
          <div
            key={i}
            className={
              this.props.chart == n.id
                ? "Wizard__item-selected Wizard__chart-option"
                : "Wizard__chart-option"
            }
          >
            <span
              onClick={() => {
                this.props.selectChart(n.id);
              }}
              className={`icon-${n.display} Wizard__chart-option-icon`}
            />
            <br />
            {n.id}
          </div>
        ))}
        <div className="dummyClear" />
      </div>
    );
  }
}

class ChartSelect extends Component {
  render() {
    let {
      chartOptiontype
    } = this.props;

    const chartTypes = [
      {
        name: "one",
        list: ["Bar-Chart", "Stacked-Bar", "Line", "Map", "Treemap"]
      },
      {
        name: "two",
        list: ["Scatter", "Bubble"]
      },
      {
        name: "three",
        list: ["Bubble-3"]
      }
    ];

    return (
      <div>
        <div className="Wizard__header-title">
          We can display the data you've selected in several ways. Make a selection below.
        </div>
        <div className="Wizard__menu-column-content">
          {chartTypes.map((type, i) => (
            <div key={i}>
              {chartOptiontype != type.name
                ? <span />
                : <div key={i}>
                    <ChartList
                      {...this.props}
                      chart={this.props.chart}
                      list={type.list}
                    />
                  </div>}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ChartSelect;
