import React from 'react';
import funcs from '../util/funcs.js';
let images = require.context('../images', true);

class NextBlock extends React.Component {
  render() {
    let next = this.props.next;
    let dims = this.props.dims;
    let borderWidth = 2;

    let nextBlock = (next.map( (value, i) => {
      // Block textures
      let imageFile = `./${next[0].color}.JPG`; // './red.JPG'
      let image = images(imageFile);

      // Offset coordinates for the different types of blocks
      let offset_x = 0;
      let offset_y = 0;
      if (next[0].type === 'back-r'||
          next[0].type ==='tp'||
          next[0].type ==='r'||
          next[0].type ==='left'||
          next[0].type ==='right') {
        offset_x = -2.9;
        offset_y = 1.7;
      }
      else if (next[0].type === 'l') {
        offset_x = -2.8;
        offset_y = 0.7;
      }
      else if (next[0].type === 's') {
        offset_x = -3.35;
        offset_y = 1.8;
      }

      return (
        <div
          key={this.props.next[i].id}
          className="block-piece"
          style={{
            left: (next[i].x + offset_x) * dims.dR + dims.dR - borderWidth*2,
            top: (next[i].y + offset_y) * dims.dR,

            height: dims.dR - borderWidth*2,
            width: dims.dR -borderWidth*2,

            marginLeft: -(2 *dims.dR - borderWidth*2),
            borderWidth,
            backgroundImage: "url(" + image + ")"
          }}
        ></div>
      )}
      ))

    // Dynamic fontsizes.
    let fontSize = funcs.calcFontSize(dims.scoreWidth/document.documentElement.clientWidth, 0.14)

    return (
      <div
        className="next-block-container"
        style={{

        }}
      >
        <div
          className="next-block-header"
          style={{
            fontSize
          }}
        >
          Next Block
        </div>
        <div
          className="next-block-preview"
        >
          {nextBlock}
        </div>
      </div>
    )
  }
}

export default NextBlock;