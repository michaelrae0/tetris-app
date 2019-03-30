import React from 'react';

class Grid extends React.Component {
  render () {
    let dims = this.props.dims
    
    // Render background grid
    let grid = [];
    for (let i = 0; i < dims.xTiles ; i++) {
      for (let j = 0; j < dims.yTiles + 1; j++) {
        let id = String(i) + ", " + String(j)
        
        grid.push(<div
          className="grid-piece"
          key={id}
          style={{
            top: -15 + j * dims.dR +'px',
            left: 30 + i * dims.dR + 'px',
            width: dims.dR -2+ 'px',
            height: dims.dR -2+ 'px'
          }}
          ></div>)
      }
    }
    
    return (
      <div className="grid">{grid}</div>
    )
  }
}

export default Grid;