import React, { Component } from "react";

class Navbar extends Component {
  render() {
    return (
      <header id="fa-mimic-header">
        <h1>
          <a href="/">
            ForeignAssistance
            <span className="fa-mimic-logo-dot">.</span>
            <span className="fa-mimic-logo-ext">gov</span>
          </a>
        </h1>
        <nav id="fa-mimic-main" role="navigation" aria-label="Main Navigation">
          <ul>
            <li>
              <a href="#explore" aria-haspopup="true">
                <i className="fa-mimic-icon-location" /> Explore
              </a>
            </li>
            <li>
              <a href="/search">
                <i className="fa-mimic-icon-search" /> Search
              </a>
            </li>
            <li>
              <a href="#download" aria-haspopup="true">
                <i className="fa-mimic-icon-location" /> Download
              </a>
            </li>
            <li>
              <a href="/" aria-haspopup="true">
                <i className="fa-mimic-icon-info" /> Learn
              </a>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default Navbar;
