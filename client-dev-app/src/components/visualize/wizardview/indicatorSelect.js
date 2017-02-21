import React, { Component, PropTypes } from "react";
import _ from "lodash";

import SearchSelect from "./searchSelect";

// child stateless component representing base of category tree
const Indicator = ({ indicators, selectIndicator, selectedIndicators }) => (
  <div>
    {indicators.map((ind, i) => (
      <div key={i} className="Wizard__menu-column-row-base-list">
        <div
          onClick={() => {
            selectIndicator(ind);
          }}
          className={
            selectedIndicators.findIndex(sel => sel.equals(ind)) !== -1
              ? "Wizard__item-selected"
              : ""
          }
        >
          <p>{ind.get("name")}</p>
        </div>
      </div>
    ))}
  </div>
);

// child stateless component representing body of category tree
const Subcategory = (
  {
    subcategories,
    collapseSubcategory,
    openSubcategory,
    selectIndicator,
    selectedIndicators
  }
) => (
  <div className="Wizard__menu-column-row-body">
    {subcategories.map(
      (sub, i) => openSubcategory === sub.get("name")
        ? <div key={i}>
            <div
              onClick={() => {
                collapseSubcategory(sub.get("name"));
              }}
              className={
                openSubcategory === sub.get("name")
                  ? "Wizard__menu-column-row-body-list"
                  : "Wizard__menu-column-row-body-list"
              }
            >
              {sub.get("name")} ◹
            </div>
            <div>
              <Indicator
                selectIndicator={selectIndicator}
                selectedIndicators={selectedIndicators}
                indicators={sub.get("indicators")}
              />
            </div>
          </div>
        : <div
            className="Wizard__menu-column-row-body-list"
            key={i}
            onClick={() => {
              collapseSubcategory(sub.get("name"));
            }}
          >
            {sub.get("name")} ◿
          </div>
    )}
  </div>
);

/**
 * 
 * 
 */
class IndicatorSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openCategory: "",
      openSubcategory: ""
    };
  }

  collapseCategory(cat) {
    if (this.state.openCategory != cat) {
      this.setState({
        openCategory: cat
      });
    } else {
      this.setState({
        openCategory: ""
      });
    }
  }

  collapseSubcategory(sub) {
    if (this.state.openSubcategory != sub) {
      this.setState({
        openSubcategory: sub
      });
    } else {
      this.setState({
        openSubcategory: ""
      });
    }
  }

  render() {
    const catNames = [
      "icon-cross-sector",
      "icon-democracy",
      "icon-economic",
      "icon-education",
      "icon-enviornment",
      "icon-health",
      "icon-assistance",
      "icon-peace-security"
    ];

    const { setup, selectIndicator } = this.props;
    const { openSubcategory, openCategory } = this.state;

    if (!setup) {
      return <span>Loading</span>;
    } else {
      return (
        <div>
          <div className="Wizard__header-title">
            Select up to three indicators.
          </div>

          <SearchSelect
            setup={setup}
            select={selectIndicator}
            type="indicator"
          />

          <div className="Wizard__menu-column-content">
            {setup.map((category, i) => (
              <div key={i}>
                <div
                  onClick={this.collapseCategory.bind(
                    this,
                    category.get("name")
                  )}
                  className="Wizard__menu-column-row-title"
                >
                  <i className={catNames[i] + " Wizard__indicator-row-icon"} />
                  <p className="Wizard__menu-column-row-name">
                    {category.get("name")}
                  </p>
                </div>

                {openCategory !== category.get("name")
                  ? <span />
                  : <div>
                      <Subcategory
                        subcategories={category.get("subcategories")}
                        openSubcategory={openSubcategory}
                        collapseSubcategory={this.collapseSubcategory.bind(
                          this
                        )}
                        selectIndicator={selectIndicator}
                        {...this.props}
                      />
                    </div>}

              </div>
            ))}
          </div>
        </div>
      );
    }
  }
}

IndicatorSelect.PropTypes = {
  setup: PropTypes.object.isRequired
};

export default IndicatorSelect;
