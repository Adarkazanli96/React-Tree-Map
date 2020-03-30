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
    const { selectedNode } = this.props;
    this.setState({
      name: selectedNode,
      newName: selectedNode
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
    const { name, newName, child } = this.state;
    const { allNames } = this.props;
    return (
      <form
        onSubmit={event => {
          event.preventDefault();
          if (newName === "") alert("Name cannot have an empty field");
          if (
            (name !== newName && allNames.has(newName.toLowerCase())) ||
            allNames.has(child.name.toLowerCase())
          )
            alert("No duplicate names allowed");
          else this.props.onSave(name, newName, child);
        }}
        ref={node => (this.node = node)}
      >
        <input
          type="text"
          value={newName}
          placeholder="Name"
          onChange={this.handleNameChange}
        />
        <input
          type="text"
          value={child.name}
          placeholder="Child"
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
