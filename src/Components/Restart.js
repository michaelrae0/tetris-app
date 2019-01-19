import React from 'react';
import funcs from '../util/funcs.js';

class Restart extends React.Component {

  handleClick = event => {
    this.props.onClick(event)
  }

  render() {
    let fontSize = funcs.calcFontSize(this.props.dims.scoreWidth/document.documentElement.clientWidth, 0.14)

    return (
      <div
        className="restart-btn btn"
        style={{
          fontSize
        }}
        onClick = {this.handleClick}
      >
        Restart
      </div>
    )
  }
}

export default Restart;