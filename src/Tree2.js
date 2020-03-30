import React, { Component } from "react";
import Tree from "react-d3-tree";
import Form from "./Form";
import { loginRoute, groupRoute, CREDENTIALS } from "./config.js";
import axios from "axios";

class CustomTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: {
        name: "Parent",
        children: []
      },
      showForm: false,
      showButton: false,
      selectedNode: "",
      xPos: 0,
      yPos: 0
    };
  }

  componentDidMount() {
    getGroups();

    async function getGroups() {
      let sessionKey;
      let response;

      //get authentication key
      await axios({
        method: "post",
        url: loginRoute,
        data: {
          email: CREDENTIALS.email,
          password: CREDENTIALS.password
        },
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => {
        sessionKey = res.data.sessionId;
      });

      //make request
      await axios({
        method: "get",
        url: groupRoute,
        headers: {
          Authorization: `bearer_admin ${sessionKey}`,
          "Content-Type": "application/json"
        }
      }).then(res => {
        //console.log(res.data);
        response = res;
        console.log(response.data);
      });
    }
  }

  onNodeClick = (nodeKey, event) => {
    event.preventDefault();
    console.log(nodeKey, event);
    this.setState({
      selectedNode: nodeKey.name,
      showForm: true,
      xPos: event.clientX,
      yPos: event.clientY
    });
  };

  closeForm = () => {
    this.setState({ showForm: false, selectedNode: "" });
  };

  updateTree = (name, newName, child) => {
    const { treeData } = this.state;

    const root = JSON.parse(JSON.stringify(treeData));

    const stack = [root];
    while (stack.length) {
      const curr = stack.pop();
      if (curr.name === name) {
        if (curr.name !== newName) curr.name = newName;
        if (child.name !== "") curr.children.push(child);
        break;
      }
      for (let i = 0; i < curr.children.length; i++) {
        stack.push(curr.children[i]);
      }
    }

    this.setState({ treeData: root });
  };

  deleteNode = name => {
    const { treeData } = this.state;

    const root = JSON.parse(JSON.stringify(treeData));

    let stack = [root];
    while (stack.length) {
      const curr = stack.pop();
      for (let i = 0; i < curr.children.length; i++) {
        const child = curr.children[i];
        if (child.name === name) {
          curr.children.splice(i, 1);
          stack = [];
          break;
        }
        stack.push(curr.children[i]);
      }
    }

    this.setState({ treeData: root });
  };

  onSave = (name, newName, child) => {
    this.closeForm();

    //only update the tree if name of node changed or added a child
    if (name !== newName || child.name !== "")
      this.updateTree(name, newName, child);
  };

  render() {
    const { showForm, treeData, selectedNode, xPos, yPos } = this.state;
    const { landscape } = this.props;
    return (
      <>
        <div>
          {showForm ? (
            <div
              style={{
                position: "absolute",
                left: xPos + 10,
                top: yPos + 10,
                zIndex: 1000
              }}
            >
              <Form
                onSave={(name, newName, child) =>
                  this.onSave(name, newName, child)
                }
                onClose={() => this.closeForm()}
                selectedNode={selectedNode}
              />
            </div>
          ) : null}
        </div>
        <div id="treeWrapper" style={{ width: "100em", height: "100em" }}>
          <Tree
            onMouseOver={this.onMouseOver}
            data={treeData}
            onClick={this.onNodeClick}
            zoomable={false}
            translate={{ x: 50, y: 250 }}
            collapsible={false}
            transitionDuration={0}
            orientation={landscape ? "horizontal" : "vertical"}
          />
        </div>
      </>
    );
  }
}

export default CustomTree;
