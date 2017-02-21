import React, { Component } from "react";

const SummaryBox = (
  {
    selectedIndicators,
    deselectIndicator,
    deselectCountry,
    deselectRegion,
    deselectChart,
    selectedCountries,
    selectedRegions,
    selectedChart,
    selectionsMessage
  }
) => (
  <div className="Wizard__summary">
    <strong className="Wizard__summary-box-title">Selection:</strong>
    <div className="Wizard__summary-box">
      <div className="Wizard__summary-box-section">
        Indicators:<br />
        {selectedIndicators.map((indicator, i) => (
          <span
            key={i}
            className="Wizard__summary-box-section-item"
            onClick={() => {
              deselectIndicator(indicator);
            }}
          >
            <p>{" " + indicator.get("name")} ❌</p>
          </span>
        ))}
      </div>
      <div className="Wizard__summary-box-section">
        Countries:<br />
        {selectedCountries.map((country, i) => (
          <span
            key={i}
            className="Wizard__summary-box-section-item"
            onClick={() => {
              deselectCountry(country);
            }}
          >
            {" "}
            <span className={"flag " + country.get("ISO").toLowerCase()} />
            <p>{" " + country.get("Name")} ❌</p>
          </span>
        ))}
        {selectedRegions.map((region, i) => (
          <span
            key={i}
            className="Wizard__summary-box-section-item"
            onClick={() => {
              deselectRegion(region);
            }}
          >
            {" "}
            <p>{" " + region.get("Name")} ❌</p>
          </span>
        ))}
      </div>
      <div className="Wizard__summary-box-section">
        Chart:<br />
        {selectedChart &&
          <span
            className="Wizard__summary-box-section-item"
            onClick={() => {
              deselectChart(selectedChart);
            }}
          >
            <p>{" " + selectedChart} ❌</p>
          </span>}

      </div>
    </div>
    {selectionsMessage}
  </div>
);

export default SummaryBox;
