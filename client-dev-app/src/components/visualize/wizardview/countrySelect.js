import React, { Component, PropTypes } from "react";
import _ from "lodash";

import SearchSelect from "./searchSelect";

class RegionList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRegions: props.selectedRegions.map((r, i) => {
        return {
          region: r,
          clickState: 0
        };
      })
    };
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
      selectedCountries,
      selectCountry,
      selectAllCountries
    } = this.props;

    return (
      <div className="Wizard__menu-column-row-body">
        {this.props.type === "All" &&
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
        {this.props.type !== "All" &&
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
          Select the countries and regions you're interested in.
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
