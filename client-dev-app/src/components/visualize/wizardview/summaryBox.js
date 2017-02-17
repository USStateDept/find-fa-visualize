import React, { Component } from "react";

const SummaryBox = ({ selectedIndicators, deselectIndicator }) => (
  <div className="Wizard__summary">
    <strong className="Wizard__summary-box-title">Selection:</strong>
    <div className="Wizard__summary-box">
      {selectedIndicators.map((indicator, i) => (
        <span
          key={i}
          className="Wizard__summary-box-item"
          onClick={() => {
            this.removeAction(indicator);
          }}
        >
          <p>{" " + indicator.get("name")} ❌</p>
        </span>
      ))}

    </div>
  </div>
);

export default SummaryBox;
