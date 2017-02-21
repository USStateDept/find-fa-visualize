import React, { Component, PropTypes } from "react";

const BeginWizard = ({ initWizard }) => (
  <div className="Wizard__begin">
    <h2>Let's get started</h2>
    <br />
    <h4>What are you interested in exploring first?</h4>
    <br />
    <br />
    <div className="Wizard__begin-buttons">
      <a className="Wizard__buttons" onClick={() => initWizard("indicator")}>
        Indicators
      </a>
      <a className="Wizard__buttons" onClick={() => initWizard("country")}>
        Countries
      </a>
    </div>
  </div>
);

export default BeginWizard;
