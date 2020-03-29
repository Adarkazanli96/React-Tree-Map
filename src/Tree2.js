import React, { Component } from "react";
import Tree from "react-d3-tree";
import Form from "./Form";
import { loginRoute, groupRoute, CREDENTIALS } from "./config.js";
import axios from "axios";

class CustomTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        name: "Parent",
        id: "1",
        key: "1",
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
      <>
        <div>
          {" "}
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
        </div>
        <div id="treeWrapper" style={{ width: "100em", height: "100em" }}>
          {/*{this.state.showButton ? (
          <div
            style={{
              position: "absolute",
              left: this.state.xPos + 10,
              top: this.state.yPos + 10,
              zIndex: 1000
            }}
          >
            <button>+</button>
          </div>
          ) : null}*/}
          <Tree
            onMouseOver={this.onMouseOver}
            data={this.state.data}
            onClick={this.onNodeClick}
            zoomable={false}
            translate={{ x: 50, y: 250 }}
            collapsible={true}
            transitionDuration={0}
            /*onMouseOver={(nodeKey, event) =>
            this.setState({ showButton: true, xPos: event.clientX })
          }
          onMouseOut={(nodeKey, event) =>
            this.setState({ showButton: false, yPos: event.clientY })
          }*/
            orientation={this.props.landscape ? "horizontal" : "vertical"}
          />
        </div>
      </>
    );
  }
}

export default CustomTree;
