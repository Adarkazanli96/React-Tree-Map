import React, { Component } from "react";
import editIcon from "./assets/images/edit.png";

export default class NodeLabel extends React.PureComponent {
  render() {
    const { className, nodeData } = this.props;
    return (
      <div
        style={{ textAlign: "left" }}
        className={className}
        onClick={() => {
          this.props.onClick(nodeData);
        }}
      >
        {nodeData.name}
        <img height="10px" style={{ marginLeft: "3px" }} src={editIcon} />
      </div>
    );
  }
}
