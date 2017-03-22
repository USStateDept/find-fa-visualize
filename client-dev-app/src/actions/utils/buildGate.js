const buildRules = {
  charts: {
    "Bar-Chart": {
      min_indicators: 1,
      min_countries: 1,
      max_indicators: 1,
      max_countries: 280,
      country_region_mix: true
    },
    "Stacked-Bar": {
      min_indicators: 1,
      min_countries: 1,
      max_indicators: 1,
      max_countries: 280,
      country_region_mix: true
    },
    Line: {
      min_indicators: 1,
      min_countries: 1,
      max_indicators: 1,
      max_countries: 280,
      country_region_mix: true
    },
    Treemap: {
      min_indicators: 1,
      min_countries: 3,
      max_indicators: 1,
      max_countries: 280,
      country_region_mix: true
    },
    Bubble: {
      min_indicators: 2,
      min_countries: 1,
      max_indicators: 2,
      max_countries: 280,
      country_region_mix: true
    },
    Scatter: {
      min_indicators: 2,
      min_countries: 1,
      max_indicators: 2,
      max_countries: 280,
      country_region_mix: false
    },
    "Bubble-3": {
      min_indicators: 3,
      min_countries: 1,
      max_indicators: 3,
      max_countries: 280,
      country_region_mix: false
    },
    Map: {
      min_indicators: 1,
      min_countries: 1,
      max_indicators: 1,
      max_countries: 280,
      country_region_mix: false
    }
  }
};

function checkBuildReady(state) {
  const selectedIndicators = state.get("selectedIndicators");
  const selectedCountries = state.get("selectedCountries");
  const selectedRegions = state.get("selectedRegions");
  const selectedChart = state.get("selectedChart");

  const indicatorsInitiated = state.get("wizardIndicatorSelectInit");
  const countriesInitiated = state.get("wizardCountrySelectInit");
  const chartInitiated = state.get("wizardChartSelectInit");

  // basic reqs
  if (indicatorsInitiated) {
    if (selectedIndicators.size === 0) {
      return { allow: false, message: "Please select one or more indicators" };
    }
    if (selectedIndicators.size > 3) {
      return {
        allow: false,
        message: `You have chosen too many indicators (max is 3)`
      };
    }
  }

  if (countriesInitiated) {
    if (selectedCountries.size === 0 && selectedRegions.size === 0) {
      return { allow: false, message: "Please select one or more countries" };
    }
  }

  if (chartInitiated) {
    if (selectedChart === "" || !selectedChart) {
      return { allow: false, message: "Please select a chart type" };
    }
    if (
      selectedIndicators.size < buildRules.charts[selectedChart].min_indicators
    ) {
      return {
        allow: false,
        message: (
          `You have not selected enough indicators for the chart type: ${selectedChart}`
        )
      };
    }
    if (
      selectedIndicators.size > buildRules.charts[selectedChart].max_indicators
    ) {
      return {
        allow: false,
        message: (
          `You have selected too many indicators for the chart type: ${selectedChart}`
        )
      };
    }
    if (
      selectedCountries.size < buildRules.charts[selectedChart].min_countries &&
      selectedRegions.size < buildRules.charts[selectedChart].min_countries
    ) {
      return {
        allow: false,
        message: (
          `You have not selected enough countries for the chart type: ${selectedChart}`
        )
      };
    }
    if (
      selectedCountries.size > buildRules.charts[selectedChart].max_countries
    ) {
      return {
        allow: false,
        message: (
          `You have selected too many countries for the chart type: ${selectedChart}`
        )
      };
    }
    if (
      selectedCountries.size > 0 &&
      selectedRegions.size > 0 &&
      selectedChart === "Map"
    ) {
      return {
        allow: false,
        message: (
          `You may not visualize Countries and Regions on a map togther (yet)`
        )
      };
    }
  }

  if (indicatorsInitiated && countriesInitiated && chartInitiated) {
    return { allow: true, message: "" };
  } else {
    return { allow: false, message: false };
  }
}

export default {
  checkBuildReady
};
