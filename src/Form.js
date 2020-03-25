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

  componentDidMount() {
    this.setState({
      name: this.props.selectedNode.name
    });
  }

  static getDerivedStateFromProps(props, state) {
    if (props.selectedNode.name === state.name) return null;
    return {
      name: props.selectedNode.name
    };
  }

  render() {
    return (
      <form
        onSubmit={event => {
          event.preventDefault();
          this.props.onSave(this.state.name, this.state.child);
        }}
      >
        <input
          type="text"
          value={this.state.child.name}
          placeholder="New Child"
          onChange={this.handleChildNameChange}
        />
        <button type="button" onClick={this.props.onClose}>
          Cancel
        </button>
      </form>
    );
  }
}

export default EditNodeForm;
