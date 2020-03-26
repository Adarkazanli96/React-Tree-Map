import React, { Component } from "react";
import Tree from "react-tree-graph";
import "./Tree1.css";
import NodeForm from "./Form";

class CustomTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        name: "Parent",
        children: []
      },
      showForm: false,
      selectedNode: {
        name: "",
        children: []
      },
      x: 0,
      y: 0
    };
  }

  onNodeClick = (event, nodeKey) => {
    event.preventDefault();
    //alert(`Right clicked ${nodeKey}`);
    console.log("heres the nodekey", nodeKey);

    //this.closeForm();
    this.setState({
      selectedNode: {
        name: nodeKey,
        children: this.getChildren(nodeKey)
      },
      showForm: true,
      x: event.clientX,
      y: event.clientY
    });

    console.log(this.state.selectedNode);
  };

  closeForm = () => {
    let selectedNode = {
      name: "",
      children: []
    };
    this.setState({ showForm: false, selectedNode });
  };

  /* dfs to get children */
  getChildren = target => {
    let children = [];

    var getChildrenHelper = (curr, target) => {
      if (curr.name !== target) {
        if (!curr.children) return;
        for (let i = 0; i < curr.children.length; i++) {
          getChildrenHelper(curr.children[i], target);
          if (children.length) return;
        }
      } else children = curr.children;
    };

    getChildrenHelper(this.state.data, target);

    return children;
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
    //return if name and child haven't changed
    //if(node ) only edit name if it's different

    // only change if one or the other is true
    console.log("boutta save");
    if (name !== newName || child.name !== "")
      this.appendChild(name, newName, child); //only append child if it has a name
  };

  render() {
    return (
      <>
        {this.state.showForm ? (
          <div
            style={{
              position: "absolute",
              left: this.state.x + 10,
              top: this.state.y + 10,
              zIndex: 1000
            }}
          >
            <NodeForm
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
          height={400}
          width={700}
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
      </>
    );
  }
}

export default CustomTree;
