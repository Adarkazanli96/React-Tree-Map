import React, { Component } from "react";
import Tree from "react-tree-graph";
import "./Tree1.css";
import NodeForm from "./EditNodeForm";

class CustomTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        name: "Parent",
        children: [
          {
            name: "Child One",
            children: [{ name: "Ahmed" }, { name: "Kevin" }, { name: "Ryan" }]
          },
          {
            name: "Child Two",
            children: []
          }
        ]
      },
      showForm: false,
      selectedNode: {
        name: "",
        children: []
      }
    };
  }

  /*onClick = (event, nodeKey) => {
    console.log(event, nodeKey);
    alert(`Left clicked ${nodeKey}`);
  };*/

  onRightClick = (event, nodeKey) => {
    event.preventDefault();
    //alert(`Right clicked ${nodeKey}`);
    console.log("heres the nodekey", nodeKey);

    this.setState({
      selectedNode: {
        name: nodeKey,
        children: this.getChildren(nodeKey)
      },
      showForm: true
    });
  };

  clearForm = () => {
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

  replaceChildren = (parent, children) => {
    let treeData = JSON.parse(JSON.stringify(this.state.data));

    let found = false;
    var replaceChildrenHelper = (curr, target, children) => {
      if (curr.name !== target) {
        if (!curr.children) return;
        for (let i = 0; i < curr.children.length; i++) {
          replaceChildrenHelper(curr.children[i], target, children);
          if (found) return;
        }
      } else {
        found = true;
        curr.children = children;
      }
    };

    replaceChildrenHelper(treeData, parent, children);

    this.setState({ data: treeData });
  };

  onSave = (parent, children) => {
    this.clearForm();
    this.replaceChildren(parent, children);
  };

  render() {
    return (
      <>
        {this.state.showForm ? (
          <NodeForm
            onSave={(parent, children) => this.onSave(parent, children)}
            onCancel={this.clearForm}
            selectedNode={this.state.selectedNode}
          />
        ) : null}

        <Tree
          data={this.state.data}
          height={400}
          width={400}
          gProps={{
            onClick: this.onClick,
            onContextMenu: this.onRightClick
          }}
          svgProps={{
            className: "custom",
            transform: this.props.landscape ? "rotate(0)" : "rotate(90)"
          }}
          animation
          duration={400}
        />
      </>
    );
  }
}

export default CustomTree;
