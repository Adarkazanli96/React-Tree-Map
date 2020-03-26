import React, { Component } from "react";

class EditNodeForm extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      newName: "",
      child: {
        name: "",
        children: []
      }
    };
  }

  handleChildNameChange = evt => {
    this.setState({ child: { ...this.state.child, name: evt.target.value } });
  };

  handleNameChange = evt => {
    this.setState({ newName: evt.target.value });
  };

  componentDidMount() {
    this.setState({
      name: this.props.selectedNode,
      newName: this.props.selectedNode
    });
  }

  handleClick = e => {
    if (!this.node.contains(e.target)) {
      this.props.onClose();
    }
  };

  componentWillMount() {
    document.addEventListener("mousedown", this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClick, false);
  }

  render() {
    return (
      <form
        onSubmit={event => {
          event.preventDefault();
          if (this.state.newName === "")
            alert("name cannot have an empty field");
          console.log("submitting");
          this.props.onSave(
            this.state.name,
            this.state.newName,
            this.state.child
          );
        }}
        ref={node => (this.node = node)}
      >
        <input
          type="text"
          value={this.state.newName}
          placeholder="Edit Name"
          onChange={this.handleNameChange}
          style={{ display: "block" }}
        />
        <input
          type="text"
          value={this.state.child.name}
          placeholder="New Child"
          onChange={this.handleChildNameChange}
          style={{ display: "block" }}
        />
        <button type="submit" style={{ display: "none" }}>
          Submit
        </button>
        <button type="button" onClick={this.props.onClose}>
          Cancel
        </button>
      </form>
    );
  }
}

export default EditNodeForm;
