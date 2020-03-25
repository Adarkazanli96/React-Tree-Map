import React, { Component } from "react";
import Tree from "react-d3-tree";
import Popup from "./Popup";

class CustomTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
        uuid = '2',
        myTreeData: [{
          name: "Top Level",
          children: [
            {
              name: "Level 2: A",
              attributes: {
                keyA: "val A",
                keyB: "val B",
                keyC: "val C"
              }
            },
            {
              name: "Level 2: B"
            }
          ],
          keyProp: ""
        }
      ],
      showPopup: false
    };
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  onClick = (nodeData, event) => {
    console.log(nodeData, event);
    this.generateNode(nodeData);
  };

  // can get x and y coordinate
  onMouseOver = (nodeData, event) => {
    console.log(nodeData, event);
  };

  render() {
    return (
      <div id="treeWrapper" style={{ width: "100em", height: "100em" }}>
        {/*<div>
          <h1> Simple Popup Example In React Application </h1>
          <button onClick={this.togglePopup.bind(this)}>
            {" "}
            Click To Launch Popup
          </button>

          {this.state.showPopup ? (
            <Popup
              text='Click "Close Button" to hide popup'
              closePopup={this.togglePopup.bind(this)}
            />
          ) : null}
          </div>*/}
        <Tree
          onMouseOver={this.onMouseOver}
          data={this.state.myTreeData}
          onClick={this.onClick}
          zoomable={false}
          translate={{ x: 50, y: 250 }}
        />
      </div>
    );
  }
}

export default CustomTree;
