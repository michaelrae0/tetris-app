import React from 'react';
import funcs from '../util/funcs.js';

class Restart extends React.Component {

  // Invokes onclick function prop.
  handleClick = event => {
    this.props.onClick(event)
  }

  render() {
    // Dynamic fontsizes.
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