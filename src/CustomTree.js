import React, { Component } from "react";
import Tree from "react-d3-tree";
import Form from "./Form";
import { loginRoute, groupRoute, CREDENTIALS } from "./config.js";
import axios from "axios";
import lodash from "lodash";
import NodeLabel from "./NodeLabel";

class CustomTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: {
        name: "Parent",
        children: [
          {
            name: "Child",
            children: []
          }
        ]
      },
      showForm: false,
      showButton: false,
      selectedNode: "",
      xPos: 0,
      yPos: 0,
      allNames: new Set(["parent"])
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

  onEdit = nodeData => {
    this.unCollapse(nodeData.name);

    const element = document.getElementById(nodeData.id);
    const x = element.getBoundingClientRect().x;
    const y = element.getBoundingClientRect().y;

    this.setState({
      selectedNode: nodeData.name,
      showForm: true,
      xPos: x,
      yPos: y
    });
  };

  closeForm = () => {
    this.setState({ showForm: false, selectedNode: "" });
  };

  updateTree = (name, newName, child) => {
    const { treeData } = this.state;

    const root = lodash.cloneDeep(treeData);
    const allNames = lodash.cloneDeep(this.state.allNames);

    const stack = [root];
    while (stack.length) {
      const curr = stack.pop();
      if (curr.name === name) {
        if (curr.name !== newName) {
          allNames.delete(name);
          allNames.add(newName.toLowerCase());
          curr.name = newName;
        }
        if (child.name !== "") {
          allNames.add(child.name.toLowerCase());
          curr.children.push(child);
        }
        break;
      }
      for (let i = 0; i < curr.children.length; i++) {
        stack.push(curr.children[i]);
      }
    }

    this.setState({ treeData: root, allNames });
  };

  deleteNode = name => {
    const { treeData } = this.state;

    const root = lodash.cloneDeep(treeData);
    const allNames = lodash.cloneDeep(this.state.allNames);

    let stack = [root];
    while (stack.length) {
      const curr = stack.pop();
      for (let i = 0; i < curr.children.length; i++) {
        const child = curr.children[i];
        if (child.name === name) {
          curr.children.splice(i, 1);
          allNames.delete(name.toLowerCase());
          stack = [];
          break;
        }
        stack.push(curr.children[i]);
      }
    }

    this.setState({ treeData: root, allNames });
  };

  unCollapse = node => {
    const { treeData } = this.state;

    const root = lodash.cloneDeep(treeData);

    const stack = [root];
    while (stack.length) {
      const curr = stack.pop();
      if (curr.name === node) {
        curr._collapsed = false;
        break;
      }
      for (let i = 0; i < curr.children.length; i++) {
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
    const {
      showForm,
      treeData,
      selectedNode,
      allNames,
      xPos,
      yPos
    } = this.state;
    const { landscape } = this.props;
    return (
      <>
        <div>
          {showForm ? (
            <div
              style={{
                position: "absolute",
                left: xPos,
                top: yPos + 40,
                zIndex: 1000
              }}
            >
              <Form
                onSave={(name, newName, child) =>
                  this.onSave(name, newName, child)
                }
                onClose={() => this.closeForm()}
                selectedNode={selectedNode}
                allNames={allNames}
              />
            </div>
          ) : null}
        </div>
        <div id="treeWrapper" style={{ width: "100em", height: "100em" }}>
          <Tree
            onMouseOver={this.onMouseOver}
            data={treeData}
            //onClick={this.onNodeClick}
            zoomable={false}
            translate={{ x: 50, y: 250 }}
            //collapsible={false}
            transitionDuration={0}
            orientation={landscape ? "horizontal" : "vertical"}
            styles={{
              links: {},
              nodes: {
                node: {}, //{ circle: { stroke: "blue", strokeWidth: 3 } },
                leafNode: {}
              }
            }}
            allowForeignObjects
            nodeLabelComponent={{
              render: (
                <NodeLabel
                  onClick={nodeData => {
                    this.onEdit(nodeData);
                  }}
                  className="myLabelComponentInSvg"
                />
              ),
              foreignObjectWrapper: {
                y: -24,
                x: 10,
                height: 20,
                overflow: "visible"
              }
            }}
          />
        </div>
      </>
    );
  }
}

export default CustomTree;
