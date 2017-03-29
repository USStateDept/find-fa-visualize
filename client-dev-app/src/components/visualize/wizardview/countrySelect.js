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
                indicators={sub.get("list")}
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

class RegionList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openCategory: "",
      openSubcategory: "",
      selectedRegions: props.selectedRegions.map((r, i) => {
        return {
          region: r,
          clickState: 0
        };
      }),
    };
  }

  collapseCategory(cat) {
    if (this.state.openCategory !== cat) {
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
    if (this.state.openSubcategory !== sub) {
      this.setState({
        openSubcategory: sub
      });
    } else {
      this.setState({
        openSubcategory: ""
      });
    }
  }

  // region name, type of region (like continent)
  selectRegion(reg, type) {
    let dex = this.state.selectedRegions.findIndex(r => r.region === reg);
    let copy = this.state.selectedRegions;

    if (dex === -1) {
      copy = copy.push({ region: reg, clickState: 0 });
      this.props.selectRegion(reg, type);
    } else if (copy.get(dex).clickState === 0) {
      // it exists but has only been clicked once
      copy = copy.set(copy.get(dex), copy.get(dex).clickState += 1);
      // toggle the individual selection
      this.props.selectRegion(reg, type);
      // select all countries
      this.props.selectAllFromRegion(reg, type);
    } else {
      // its been clicked multiple times now, reset it
      copy = copy.set(copy.get(dex), {});
      // toggled all selected this point
      this.props.selectAllFromRegion(reg, type);
    }

    this.setState({
      selectedRegions: copy
    });
  }

  getRegionClassName(region) {
    return this.state.selectedRegions.findIndex(
      r => r.region === region && r.clickState === 0
    ) !== -1
      ? "Wizard__item-selected Wizard__menu-column-row-base-float"
      : this.state.selectedRegions.findIndex(
          r => r.region === region && r.clickState === 1
        ) !== -1
          ? "Wizard__item-selected-blue Wizard__menu-column-row-base-float"
          : "Wizard__menu-column-row-base-float";
  }

  render() {
    const {
      countryList,
      subcategories,
      selectedCountries,
      selectCountry,
      selectAllCountries
    } = this.props;

    const { selectIndicator } = this.props;
    const { openSubcategory, openCategory } = this.state;

    return (
      <div className="Wizard__menu-column-row-body">
        {this.props.type === "By Country Name" &&
          <div>
            <div className="bld-options">
              <span
                className="bld-options-btn"
                onClick={() => {
                  selectAllCountries();
                }}
              >Select All</span>
            </div>
            <div className="Wizard__menu-column-row-body-list f32">
              {countryList.map((country, i) => (
                <div
                  className={
                    selectedCountries.findIndex(cty => cty.equals(country)) !==
                      -1
                      ? "Wizard__item-selected Wizard__menu-column-row-base-float"
                      : "Wizard__menu-column-row-base-float"
                  }
                  onClick={() => {
                    this.props.selectCountry(country);
                  }}
                  key={i}
                >
                  <span
                    className={"flag " + country.get("ISO").toLowerCase()}
                  />
                  <p>{country.get("Name")}</p>
                </div>
              ))}
            </div>
          </div>}
        {this.props.type !== "By Country Name" && this.props.type !== "By Agency Classification" &&
          <div>
            <div className="Wizard__menu-column-row-body-list">
              {countryList.map((region, i) => (
                <div
                  className={this.getRegionClassName(region)}
                  onClick={this.selectRegion.bind(
                    this,
                    region,
                    region.get("Type")
                  )}
                  key={i}
                >
                  <p>{region.get("Name")}</p>
                </div>
              ))}
            </div>
            <div className="Wizard__menu-column-row-body-float">
              <p>
                <i>Double-click on a collection to show the countries
                comprising your selection. These countries will appear
                in the Selection Box</i>
              </p>
            </div>
          </div>}
        {this.props.type === "By Agency Classification" &&
          <div>

            <div className="Wizard__menu-column-row-body-list">

                  <Subcategory
                    subcategories={subcategories.get("list")}
                    openSubcategory={openSubcategory}
                    collapseSubcategory={this.collapseSubcategory.bind(
                      this
                    )}
                    selectIndicator={selectIndicator}
                    {...this.props}
                  />
                
            </div>

            <div className="Wizard__menu-column-row-body-float">
              <i>Double-click on a collection to show the countries
                comprising your selection. These countries will appear
                in the Selection Box</i>
            </div>

          </div>}

      </div>
    );
  }
}

class CountrySelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: ""
    };
  }

  collapseRegion(reg) {
    this.props.setMapTypeForGeojson(reg);
    if (this.state.region !== reg) {
      this.setState({
        region: reg
      });
    } else {
      this.setState({
        region: ""
      });
    }
  }

  render() {
    const {
      setup,
      selectedRegions,
      selectedCountries,
      selectCountry,
      selectRegion,
      selectAllFromRegion,
      selectAllCountries
    } = this.props;

    return (
      <div>
        <div className="Wizard__header-title">
          Select the countries and regions you are interested in.
        </div>

        <SearchSelect setup={setup} select={selectCountry} type="country" />

        <div className="Wizard__menu-column-content">
          {setup.map((region, i) => (
            <div key={i}>
              <div
                onClick={this.collapseRegion.bind(this, region.get("name"))}
                className="Wizard__menu-column-row-title"
              >

                <p className="Wizard__menu-column-row-name">
                  {region.get("name")}
                </p>

              </div>
              {this.state.region !== region.get("name")
                ? <div />
                : <div>
                    <RegionList
                      type={region.get("name")}
                      countryList={region.get("list")}
                      subcategories={region.get("subcategories")}
                      selectedRegions={selectedRegions}
                      selectedCountries={selectedCountries}
                      selectCountry={selectCountry}
                      selectRegion={selectRegion}
                      selectAllFromRegion={selectAllFromRegion}
                      selectAllCountries={selectAllCountries}
                    />
                  </div>}
            </div>
          ))}

          {/*setup.map((category, i) => (
            <div key={i}>
              <div
                onClick={this.collapseCategory.bind(this, category.get("name"))}
                className="Wizard__menu-column-row-title"
              >
                <i className={catNames[i] + " catcon"} />
                <p className="Wizard__menu-column-row-icon">
                  {category.get("name")}
                </p>
              </div>

              {openCategory !== category.get("name")
                ? <span />
                : <div key={i}>
                    <Subcategory
                      subcategories={category.get("subcategories")}
                      openSubcategory={openSubcategory}
                      collapseSubcategory={this.collapseSubcategory.bind(this)}
                      selectIndicator={selectIndicator}
                      {...this.props}
                    />
                  </div>}

            </div>
          ))*/
          }
        </div>
      </div>
    );
  }
}

CountrySelect.PropTypes = {
  setup: PropTypes.object.isRequired
};

export default CountrySelect;
// <li
//                 className={
//                   this.props.selectedCountries.findIndex(cty) !== -1
//                     ? "cty-row Wizard__item-selected"
//                     : "cty-row"
//                 }
//                 onClick={() => {
//                   this.props.selectCty(cty);
//                 }}
//                 key={i}
//               >
//                 <span className={"flag " + cty.ISO.toLowerCase()}>&nbsp;</span>
