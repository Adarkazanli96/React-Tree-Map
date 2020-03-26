import React, { Component } from "react";
import Tree from "react-tree-graph";
import "./Tree1.css";
import Form from "./Form";

class CustomTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        name: "Parent",
        children: []
      },
      showForm: false,
      selectedNode: "",
      xPos: 0,
      yPos: 0
    };
  }

  onNodeClick = (event, nodeKey) => {
    event.preventDefault();
    this.setState({
      selectedNode: nodeKey,
      showForm: true,
      xPos: event.clientX,
      yPos: event.clientY
    });
  };

  closeForm = () => {
    this.setState({ showForm: false, selectedNode: "" });
  };

  appendChild = (name, newName, child) => {
    let treeData = JSON.parse(JSON.stringify(this.state.data));

    let found = false;
    var appendChildHelper = (curr, target) => {
      if (curr.name !== target) {
        if (!curr.children) return;
        for (let i = 0; i < curr.children.length; i++) {
          appendChildHelper(curr.children[i], target);
          if (found) return;
        }
      } else {
        found = true;
        if (curr.name !== newName) curr.name = newName;
        if (child.name !== "") curr.children.push(child);
      }
    };

    appendChildHelper(treeData, name);

    this.setState({ data: treeData });
  };

  onSave = (name, newName, child) => {
    this.closeForm();
    if (name !== newName || child.name !== "")
      //only call function if name of node changed or added a child
      this.appendChild(name, newName, child);
  };

  render() {
    return (
      <div
        style={
          this.props.landscape
            ? {}
            : {
                position: "relative",
                top: "300px"
              }
        }
      >
        {this.state.showForm ? (
          <div
            style={{
              position: "absolute",
              left: this.state.xPos + 10,
              top: this.state.yPos + 10,
              zIndex: 1000
            }}
          >
            <Form
              onSave={(name, newName, child) =>
                this.onSave(name, newName, child)
              }
              onClose={() => this.closeForm()}
              selectedNode={this.state.selectedNode}
            />
          </div>
        ) : null}

        <Tree
          data={this.state.data}
          height={500}
          width={1000}
          gProps={{
            onClick: this.onNodeClick
          }}
          svgProps={{
            className: "custom",
            transform: this.props.landscape ? "rotate(0)" : "rotate(90)"
          }}
          animation
          duration={200}
        />
      </div>
    );
  }
}

export default CustomTree;
