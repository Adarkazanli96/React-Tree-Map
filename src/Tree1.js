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

  /*onClick = (event, nodeKey) => {
    console.log(event, nodeKey);
    alert(`Left clicked ${nodeKey}`);
  };*/

  onClick = (event, nodeKey) => {
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

  appendChild = (node, child) => {
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
        curr.children.push(child);
      }
    };

    appendChildHelper(treeData, node);

    this.setState({ data: treeData });
  };

  onSave = (node, child) => {

    this.closeForm();
    //return if name and child haven't changed
    //if(node ) only edit name if it's different
    if (child.name !== "") this.appendChild(node, child); //only append child if it has a name

    
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
              onSave={(parent, child) => this.onSave(parent, child)}
              onClose={() => this.closeForm()}
              selectedNode={this.state.selectedNode}
            />
          </div>
        ) : null}

        <Tree
          data={this.state.data}
          height={400}
          width={400}
          gProps={{
            onClick: this.onClick
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
