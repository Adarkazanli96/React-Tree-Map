import React, { Component } from "react";

class EditNodeForm extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      children: [{ name: "" }]
    };
  }

  handleChildNameChange = idx => evt => {
    const newChildren = this.state.children.map((child, sidx) => {
      if (idx !== sidx) return child;
      return { ...child, name: evt.target.value };
    });

    this.setState({ children: newChildren });
  };

  handleAddChild = () => {
    this.setState({
      children: this.state.children.concat([{ name: "", children: [] }])
    });
  };

  handleRemoveChild = idx => () => {
    this.setState({
      children: this.state.children.filter((s, sidx) => idx !== sidx)
    });
  };

  emptyFieldExists = () => {
    if (this.state.children.length === 0) return false;
    let lastIdx = this.state.children.length - 1;
    return this.state.children[lastIdx].name === "";
  };

  componentDidMount() {
    this.setState({
      name: this.props.selectedNode.name,
      children: this.props.selectedNode.children
    });
  }

  render() {
    console.log(this.state.name);
    console.log(this.state.children);
    return (
      <div>
        <div>
          <h4>{this.state.name}</h4>
          {this.state.children.map((child, idx) => (
            <div className="child" key={idx}>
              <input
                type="text"
                placeholder={`Child #${idx + 1} name`}
                value={child.name}
                onChange={this.handleChildNameChange(idx)}
              />
              <button
                type="button"
                onClick={this.handleRemoveChild(idx)}
                className="small"
              >
                -
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={this.handleAddChild}
            style={{ display: "block", margin: "0 auto" }}
            className="small"
            disabled={this.emptyFieldExists()}
          >
            +
          </button>
          <button
            onClick={() =>
              this.props.onSave(this.state.name, this.state.children)
            }
          >
            Save
          </button>
          <button onClick={this.props.onCancel}>Cancel</button>
        </div>
      </div>
    );
  }
}

export default EditNodeForm;
