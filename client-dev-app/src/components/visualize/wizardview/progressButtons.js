import React, { Component } from "react";

const ProgressButtons = (
  { changeWizardState, showFinish, showBack, buildAllowed, requestData }
) => (
  <div className="Wizard__progress-buttons">
    {showFinish &&
      <a className="Wizard__buttons" onClick={() => changeWizardState("next")}>
        Next
      </a>}
    {!showFinish &&
      <a
        className={`Wizard__buttons ${!buildAllowed && "disabled"} `}
        onClick={buildAllowed ? requestData : null}
      >
        Finish
      </a>}
    {showBack &&
      <a className="Wizard__buttons" onClick={() => changeWizardState("back")}>
        &lt; Back
      </a>}
  </div>
);

export default ProgressButtons;
