import React, { Component, PropTypes } from "react";

import _ from "lodash";

class RegionList extends Component {
  // constructor(props) {
  //   // init based on global store
  //   console.log(props);
  //   let copy = props.selectedRegions.slice(0);
  //   _.each(copy, (r, i) => {
  //     copy[i] = {
  //       region: r,
  //       clickState: 0
  //     };
  //   });

  //   super(props);

  //   // TODO ADD THIS AS A GLOBAL MAPPING IN REDUCER
  //   this.state = {
  //     selectedRegions: copy
  //   };
  // }

  // componentWillReceiveProps(props) {
  //   // selected state regions needs to be in sync with the global store
  //   let copy = this.state.selectedRegions.slice(0);
  //   _.each(this.state.selectedRegions, (r, i) => {
  //     let dex = props.selectedRegions.indexOf(r.region);
  //     if (dex === -1) {
  //       if (copy[i].clickState !== 1) {
  //         copy[i] = {};
  //       }
  //     }
  //   });

  //   this.setState({
  //     selectedRegions: copy
  //   });
  // }

  // // region name, type of region (like continent)
  // selectRegion(reg, type) {
  //   let dex = _.findIndex(this.state.selectedRegions, r => {
  //     return r.region === reg;
  //   });
  //   let copy = this.state.selectedRegions.slice(0);

  //   if (dex === -1) {
  //     copy.push({ region: reg, clickState: 0 });
  //     this.props.clickSelectRegion(reg, type);
  //   } else if (copy[dex].clickState === 0) {
  //     // it exists but has only been clicked once
  //     copy[dex].clickState += 1;
  //     // toggle the individual selection
  //     this.props.clickSelectRegion(reg, type);
  //     // select all countries
  //     this.props.selectAllFromRegion(reg, type);
  //   } else {
  //     // its been clicked multiple times now, reset it
  //     copy[dex] = {};
  //     // toggled all selected this point
  //     this.props.selectAllFromRegion(reg, type);
  //   }

  //   this.setState({
  //     selectedRegions: copy
  //   });
  // }

  // getRegionClassName(reg) {
  //   return _.findIndex(this.state.selectedRegions, r => {
  //     return r.region === reg && r.clickState === 0;
  //   }) !== -1
  //     ? "cty-row menu-selected"
  //     : _.findIndex(this.state.selectedRegions, r => {
  //         return r.region === reg && r.clickState === 1;
  //       }) !== -1
  //         ? "cty-row menu-selected-blue"
  //         : "cty-row";
  // }

  render() {
    const { countryList, selectedCountries, selectCountry } = this.props;

    return (
      <div className="Wizard__menu-column-row-body">
        {this.props.type === "All" &&
          <div>
            <div className="bld-options">
              <span
                className="bld-options-btn"
                onClick={() => {
                  this.props.selectAllCountries();
                }}
              >Select All</span>
            </div>
            <div className="Wizard__menu-column-row-body-list f32">
              {countryList.map((country, i) => (
                <div
                  className="Wizard__menu-column-row-base-float"
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
          <ul className="country-list">
            {this.props.list.map((reg, i) => (
              <li
                className={this.getRegionClassName(reg)}
                onClick={this.selectRegion.bind(this, reg, reg.Type)}
              >
                {reg.Name}
              </li>
            ))}
          </ul>}
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
      selectCountry
    } = this.props;

    return (
      <div>
        <div className="Wizard__header-title">
          Select the countries and regions you're interested in.
        </div>
        <input type="text" className="" />

        <div className="Wizard__menu-column-content">
          {setup.map((region, i) => (
            <div key={i}>
              <div
                onClick={this.collapseRegion.bind(this, region.get("name"))}
                className="Wizard__menu-column-row-title"
              >

                <p className="Wizard__menu-column-row-icon">
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
//                     ? "cty-row menu-selected"
//                     : "cty-row"
//                 }
//                 onClick={() => {
//                   this.props.selectCty(cty);
//                 }}
//                 key={i}
//               >
//                 <span className={"flag " + cty.ISO.toLowerCase()}>&nbsp;</span>
