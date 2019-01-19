import React from 'react';
import Grid from './Grid.js';
let images = require.context('../images', true);
// import ReactDOM from 'react-dom';

class Viewport extends React.Component {
  render() {
    let current = this.props.current;
    let dims = this.props.dims;
    let borderWidth = 2;

    // Create blocks that are currently moving
    let movingBlock = (current.map( (value, i) => {
      let imageFile = `./${current[0].color}.JPG`;
      let image = images(imageFile);

      return (
        <div
        key={this.props.current[i].id}
        className="block-piece"
        style={{
          left: current[i].x * dims.dR + dims.dR - borderWidth*2,
          top: current[i].y * dims.dR,

          height: dims.dR - borderWidth*2,
          width: dims.dR -borderWidth*2,

          marginLeft: -(2 *dims.dR - borderWidth*2),
          borderWidth,
          backgroundImage: "url(" + image + ")"
        }}
        ></div>
      )}
      ))

    // Render blocks that are already placed
    let laid = this.props.laid
    let arr = [];
    
    for (let i = 0; i < laid.length; i++) {
      let imageFile = `./${laid[i].color}.JPG`;
      let image = images(imageFile);

      arr.push(
        <div
          key={laid[i].id}
          className="block-piece"
          style={{
            left: laid[i].x * dims.dR + dims.dR - borderWidth*2,
            top: laid[i].y * dims.dR,

            height: dims.dR - borderWidth*2,
            width: dims.dR - borderWidth*2,

            marginLeft: -(2 *dims.dR - borderWidth*2),
            borderWidth,

            backgroundImage: "url(" + image + ")"
          }}
        ></div>
      
      );     
    }


    let boardBorder = 5;
    let boardPercHeight = dims.boardContainerHeight - dims.boardHeight;
    let boardPercWidth = dims.boardContainerWidth - dims.boardWidth;
    
    let top = boardPercHeight/2 - boardBorder;
    let left = boardPercWidth/2 - boardBorder;
    
  
    return (
      <div
        className="board"
        style={{
          height: dims.boardHeight,
          width: dims.boardWidth,
          left,
          top,
          borderWidth: boardBorder
        }}

      >
        <Grid
        dims = {dims}
        />
        {movingBlock}
        {arr}
        
      </div>

    )
    }
  }

export default Viewport;