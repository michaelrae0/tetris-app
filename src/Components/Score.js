import React from 'react';
import funcs from '../util/funcs.js';
// import ReactDOM from 'react-dom';

class Score extends React.Component {
  render () {
    // let dims = this.props.dims;
    let fontSize = funcs.calcFontSize(this.props.dims.scoreWidth/document.documentElement.clientWidth, 0.14)

    return (
      <div
      className="scoreboard"
      style = {{
        fontSize
      }}
      >
        <div
        className="stat score"
        style = {{
          top: 17 + '%',        
        }}
        >
          <span className="stat-word" >Score</span> 
          <div className="stat-num" >{this.props.score}</div>
        </div>
        <div
        className="stat level"
        style = {{
          top: 47 + '%',
        }}
        >
          <span className="stat-word" >Level</span>
          <div className="stat-num" >{this.props.level}</div>
        </div>
        <div
        className="stat lines"
        style = {{
          top: 77 + '%',    
        }}
        >
          <span className="stat-word" >Lines</span>
          <div className="stat-num" >{this.props.lines}</div>
        </div>
      </div>
    )
  }
}

export default Score;