import "./App.css";
import CustomTree from "./Tree2";
import React, { Component } from "react";
import Switch from "@material-ui/core/Switch";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      landscape: true
    };
  }

  handleChange = event => {
    console.log([event.target.name], event.target.checked);
    this.setState({ ...this.state, [event.target.name]: event.target.checked });
  };

  render() {
    return (
      <div className="App">
        <div>
          <Switch
            checked={this.state.landscape}
            onChange={this.handleChange}
            color="primary"
            name="landscape"
            inputProps={{ "aria-label": "primary checkbox" }}
            label="Landscape"
          />
          Landscape
        </div>

        <CustomTree landscape={this.state.landscape} />
      </div>
    );
  }
}

export default App;
