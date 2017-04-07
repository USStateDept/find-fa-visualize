import React, { Component } from "react";
import Visualize from "./Visualize";

class App extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log(this.props.location.query);
    }

    render() {
        return <div className="App">
                <Visualize />
            </div>;
    }
}

export default App;