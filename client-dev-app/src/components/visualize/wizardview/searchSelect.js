import React, { Component, PropTypes } from "react";

const SearchResultsBox = ({ results, select }) => (
  <table className="Wizard__search-results">
    {results.map((r, i) => <tr
        onClick={() => {
          select(r);
        }}
        key={i}
      ><td>{r.get("name") || r.get("Name")}</td></tr>)}
  </table>
);

class SearchSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      type: props.type
    };
  }
  handleSearchInput(e, type) {
    var input = e.target.value;
    var list = [];

    if (input.length > 1 && this.state.type === "country") {
      this.props.setup.get(0).get("list").map((country, i) => {
        if (country.get("Name").toLowerCase().indexOf(input) !== -1) {
          list.push(country);
        }
      });
    }
    if (input.length > 1 && this.state.type === "indicator") {
      this.props.setup.map(cat => {
        cat.get("subcategories").map(sub => sub.get("indicators").map(ind => {
          if (ind.get("name").toLowerCase().indexOf(input) !== -1) {
            list.push(ind);
          }
        }));
      });
    }

    this.setState(Object.assign({}, this.state, { results: list }));
  }

  render() {
    return (
      <div>
        <input
          type="text"
          className="Wizard__search-input"
          placeholder="Search ..."
          onChange={this.handleSearchInput.bind(this)}
        />
        {this.state.results.length !== 0 &&
          <SearchResultsBox
            results={this.state.results}
            select={this.props.select}
          />}

      </div>
    );
  }
}

export default SearchSelect;
