import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import './index.css';
import Board from './Components/Board.js';
import NextBlock from './Components/NextBlock.js';
import Restart from './Components/Restart.js'
import Score from './Components/Score.js';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.frames = 60;

    this.state = {
      blocks: [this.chooseRandomBlock(), this.chooseRandomBlock()],
      laidBlocks: [],

      score: 0,
      level: 1,
      lines: 0,

      clock: 0,
      framesPerMove: 18,
      dims: this.calcDimensions(),

      isGameOver: false,
      isUpdatable: false
    }
  }

  // Calculate dimensions at start and every frame
  calcDimensions = () => {
    let clientHeight = document.documentElement.clientHeight;
    let clientWidth = document.documentElement.clientWidth;

    let gameHeight =   800;
    let gameWidth =    700;

    // Scale game to client dimensions
    if (clientWidth < 700) {
      gameWidth = Math.max(clientWidth, 200);
      gameHeight = gameWidth / 7*8;
    }
    else if (clientHeight < 800) {
      gameHeight = Math.max(clientHeight, 300);
      gameWidth = gameHeight / 8*7;
    }

    // Calculate game's containers based off its dims
    let boardContainerHeight = gameHeight;
    let boardContainerWidth = gameWidth * 4/7;

    let boardHeight = boardContainerHeight  * 0.9;
    let boardWidth = boardContainerWidth * 0.9;

    let scoreHeight = gameHeight * 3/8;
    let scoreWidth = gameWidth * 2.6/8;

    let dR = boardHeight / 20;

    return {
      gameHeight,
      gameWidth,

      boardContainerHeight,
      boardContainerWidth,
      boardHeight,
      boardWidth,

      scoreHeight,
      scoreWidth,

      dR,
      xTiles: 10,
      yTiles: 19
    }
  }


  // Block spawning functions
  chooseRandomBlock = () => {
    let blockNum = Math.floor(Math.random() * 7);
    let colors = ["green", "red", "orange", "yellow", "purple", "cyan"]
    let block;

    switch (blockNum) {
      case 0:
        block = [
          {x: 5, y: 0, pos: "left", lay: "horizontal", type:"back-r"}, 
          {x: 6, y: 0, pos: "middle", lay: "horizontal", type:"back-r"}, 
          {x: 6, y: 1, pos: "bottom", lay: "horizontal", type:"back-r"}, 
          {x: 7, y: 1, pos: "bottomRight", lay: "horizontal", type:"back-r"}
        ]; // -,_
        break;
      case 1:
        block = [
          {x: 6, y: 0, pos: "pipe", lay: "vertical", type:"l"}, 
          {x: 6, y: 1, pos: "pipe", lay: "vertical", type:"l"}, 
          {x: 6, y: 2, pos: "pipe", lay: "vertical", type:"l"}, 
          {x: 6, y: 3, pos: "pipe", lay: "vertical", type:"l"}
        ]; // |
        break;
      case 2:
        block = [
          {x: 6, y: 0, pos: "square", type:"s"}, 
          {x: 7, y: 0, pos: "square", type:"s"}, 
          {x: 6, y: 1, pos: "square", type:"s"}, 
          {x: 7, y: 1, pos: "square", type:"s"}
        ]; // []
        break;
      case 3:
        block = [
          {x: 5, y: 1, pos: "bottomLeft", lay: "horizontal", type:"tp"}, 
          {x: 6, y: 1, pos: "bottom", lay: "horizontal", type:"tp"}, 
          {x: 7, y: 1, pos: "bottomRight", lay: "horizontal", type:"tp"}, 
          {x: 6, y: 0, pos: "middle", lay:"horizontal", type:"tp"}
        ]; // T
        break;
      case 4:
        block = [
          {x: 6, y: 0, pos: "middle", lay: "horizontal", type:"r"}, 
          {x: 7, y: 0, pos: "right", lay: "horizontal", type:"r"}, 
          {x: 5, y: 1, pos: "bottomLeft", lay: "horizontal", type:"r"}, 
          {x: 6, y: 1, pos: "bottom", lay: "horizontal", type:"r"}
        ]; // _,-
        break;
      case 5:
        block = [
          {x: 5, y: 1, pos: "bottomLeft", lay: "horizontal", type:"left"}, 
          {x: 6, y: 1, pos: "bottom", lay: "horizontal", type:"left"}, 
          {x: 7, y: 1, pos: "bottomRight", lay: "horizontal", type:"left"}, 
          {x: 5, y: 0, pos: "left", lay: "horizontal", type:"left"}
        ]; // ,--
        break;
      case 6:
        block = [
          {x: 5, y: 1, pos: "bottomLeft", lay: "horizontal", type:"right"}, 
          {x: 6, y: 1, pos: "bottom", lay: "horizontal", type:"right"}, 
          {x: 7, y: 1, pos: "bottomRight", lay: "horizontal", type:"right"}, 
          {x: 7, y: 0, pos: "right", lay: "horizontal", type:"right"}
        ]; // --,
        break;
      default:
        break;
    }
    let blockColor = colors[Math.floor(Math.random(0) * colors.length)]
    for (let i = 0; i < block.length; i++) {
      block[i].color = blockColor;
      block[i].id = Math.floor(Math.random() * 10000000);
    }
    
    return block;
  }
  spawnBlock = () => { 
    // Push last curr to laidBlocks
    let laid = this.state.laidBlocks;
    for (let i = 0; i < this.state.blocks[0].length; i++) {
      laid.push(this.state.blocks[0][i])
    }

    this.setState({
      blocks: [this.state.blocks[1], this.chooseRandomBlock()]
    })
  }


  // Collision tests. Return true or false
  laidCollision = block => {
    for (let i = 0; i < block.length; i++) {
      for (let j = 0; j < this.state.laidBlocks.length; j++) { 
        
        // If a location overlaps, return true        
        if (block[i].x === this.state.laidBlocks[j].x &&
            block[i].y === this.state.laidBlocks[j].y ) {          
          return true;
        }  

      } 
    }
    return false;
  }
  floorCollision = block => {
    for (let i = 0; i < block.length; i++) {
      if (block[i].y > this.state.dims.yTiles) {
        return true;
      }
    }
    return false;
  }
  wallCollision = (block, direction) => {
    // Returns true if moving will take player off screen
    for (let i = 0; i < block.length; i++) {
      
      if ((block[i].x >= this.state.dims.xTiles + 1 && (direction === "right" || direction === "turn")) || // right wall
          (block[i].x <= 0 && direction === "left") || // left wall
          (block[i].y < 0 && direction === "turn" && block[i].pos !== "pipe") || // ceiling
          (block[i].x < 1 && direction === "turn" && block[i].pos === "pipe") ) { // pipe only
        
        return true;
      }
    }

    return false;
  }



  // Functions for turning blocks
  leftPiece = blockPiece => {
    if (blockPiece.lay === "horizontal") {
      blockPiece.x += 1; blockPiece.y -= 1;
      blockPiece.pos = "top";
      blockPiece.lay = "vertical";
      return blockPiece
    } else {
      blockPiece.x += 1;
      blockPiece.pos = "middle";
      blockPiece.lay = "horizontal";
      return blockPiece
    }
  }
  topPiece = blockPiece => { 
    // vertical
    blockPiece.x += 1; blockPiece.y += 2;
    blockPiece.pos = "bottomRight";
    blockPiece.lay = "horizontal";
    return blockPiece
  }
  rightPiece = blockPiece => {
    // horizontal
      blockPiece.x -= 1; blockPiece.y += 1;
      blockPiece.pos = "bottom";
      blockPiece.lay = "vertical";
      return blockPiece
  }
  bottomPiece = blockPiece => { 
    if (blockPiece.lay === "horizontal") {
      blockPiece.x -= 1; blockPiece.y -= 1;
      blockPiece.pos = "left";
      blockPiece.lay = "vertical";
      return blockPiece
    } else {
      blockPiece.x -= 1;
      blockPiece.pos = "bottomLeft";
      blockPiece.lay = "horizontal";
      return blockPiece
    }
  }
  bottomLeftPiece = blockPiece => { 
    if (blockPiece.lay === "horizontal") {
      blockPiece.y -= 2;
      blockPiece.pos = "topLeft";
      blockPiece.lay = "vertical";
      return blockPiece
    } else {
      blockPiece.y -= 1;
      blockPiece.pos = "left";
      blockPiece.lay = "horizontal";
      return blockPiece
    }
  }
  topLeftPiece = blockPiece => { 
    // vertical
    blockPiece.x += 2; blockPiece.y += 1;
    blockPiece.pos = "right";
    blockPiece.lay = "horizontal";
    return blockPiece    
  }
  bottomRightPiece = blockPiece => { 
    // horizontal
    blockPiece.x -= 2;
    blockPiece.pos = "bottomLeft";
    blockPiece.lay = "vertical";
    return blockPiece
  }
  middlePiece = blockPiece => { 
    if (blockPiece.lay === "horizontal") {
      blockPiece.lay = "vertical"; // only change
      return blockPiece
    } else {
      blockPiece.y += 1;
      blockPiece.pos = "bottom";
      blockPiece.lay = "horizontal";
      return blockPiece
    }
  }
  turnPipe = pipe => {
    // Solely for pipe blocks
    if  (pipe[0].lay === "vertical") {
      pipe[0].x += 2; pipe[0].y += 3; pipe[0].lay = "horizontal";
      pipe[1].x += 1; pipe[1].y += 2;
      pipe[2].x -= 0; pipe[2].y += 1;
      pipe[3].x -= 1; pipe[3].y += 0; 
    } else {
      pipe[0].x -= 2; pipe[0].y -= 3; pipe[0].lay = "vertical";
      pipe[1].x -= 1; pipe[1].y -= 2;
      pipe[2].x -= 0; pipe[2].y -= 1;
      pipe[3].x += 1; pipe[3].y += 0; 
    }
    return pipe
  }
  turnBlock = block => { // Main turn functionblockPiece
    if (block[0].pos === "pipe") {
      this.turnPipe(block);
      return block;
    }
    for (let i = 0; i < block.length; i++) {     
      switch (block[i].pos) {
        case "top":
          block[i] = this.topPiece(block[i])
          break;    
        case "right":
          block[i] = this.rightPiece(block[i])
          break;
        case "bottom":
          block[i] = this.bottomPiece(block[i])
          break;
        case "left":
          block[i] = this.leftPiece(block[i])
          break;
        case "topLeft":
          block[i] = this.topLeftPiece(block[i])
          break;
        case "bottomRight":
          block[i] = this.bottomRightPiece(block[i])
          break;        
        case "bottomLeft":
          block[i] = this.bottomLeftPiece(block[i])
          break;
        case "middle":
          block[i] = this.middlePiece(block[i])
          break;
        default: //square
          break;
      }
    }
    return block
  }


  // Check for lines
  deleteLine = (row, laid) => {
    for (let i = laid.length-1; i >= 0; i--) {
      if (laid[i].y === row) {
        laid.splice(i, 1);
      }
    }
    for (let i = 0; i < laid.length; i++) {
      if (laid[i].y < row) {
        laid[i].y +=1
      }
    }
  }
  lineTest = () => {
    let blocksInRow = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    let laid = _.map(this.state.laidBlocks, _.clone); // creates deep copy instead of reference

    for (let i = 0; i < laid.length; i++) {
      blocksInRow[laid[i].y] += 1;
    }

    let rowsDeleted = 0;
    for (let i = blocksInRow.length; i >= 0; i--) {
      if (blocksInRow[i] === this.state.dims.xTiles) {
        this.deleteLine(i, laid);
        
        this.setState({
          lines: this.state.lines + 1,
          isUpdatable: true
        })
        rowsDeleted++
      }
    }
    this.updateScore(rowsDeleted);

    this.setState({
      laidBlocks: laid
    })
  }
  updateScore = rows => {
    let increment = 100 * rows * (1 + this.state.level*0.2);
    increment =  increment * Math.pow(1.2, rows-1)
    increment = Math.floor(increment)

    this.setState({
      score: this.state.score + increment
    })
  }

  // Speed changing functions
  updateSpeed = () => {
    if (this.state.lines % 3 === 0 && this.state.isUpdatable === true) {
      
      if (this.state.framesPerMove >= 15) {
        this.setState({
          framesPerMove: this.state.framesPerMove - 3,
        })
      } 
      else if (this.state.framesPerMove >= 8) {
        this.setState({
          framesPerMove: this.state.framesPerMove - 2,
        })
      } 
      else if (this.state.framesPerMove >= 6) {
        this.setState({
          framesPerMove: this.state.framesPerMove - 1,         
        })
      }
      this.setState({
        level: this.state.level + 1,
        isUpdatable: false
      })

    }
  }
  testGameOver = () => {
    if (this.laidCollision(this.state.blocks[1], "left")) {
      clearInterval(this.intervalId); // stops frames
      
      this.setState({ // prevents block moving events
        isGameOver: true
      });
    }
  }



  // Movement functions.
  incrementLocation = (block, coordStr, amount) => {
    for (let i = 0; i < block.length; i++) {
      block[i][coordStr] = block[i][coordStr] + amount; // adds 1 or -1 (or any number)
    }
  }
  moveBlock = () => {
    var copy = _.map(this.state.blocks[0], _.clone); // creates deep copy instead of reference
    // stops after ground hit
    this.incrementLocation(copy, "y", 1);

    if (!this.laidCollision(copy) &&
        !this.floorCollision(copy) ) {  

      this.setState({
        blocks: [copy, this.state.blocks[1]]
      })
    } 
    else {
      this.spawnBlock();
    }
    this.setState({
      clock: 0
    })
  }



  // Frame function
  nextFrame = () => {         
    // Runs every set amount of frames
    if (this.state.clock >= this.state.framesPerMove) {
      this.moveBlock();
      this.lineTest();
      this.updateSpeed();
      this.testGameOver();

      this.setState({ clock: 0 });
    }
    console.log(this.state.framesPerMove)
    // Runs every frame
    
    this.setState({
      dims: this.calcDimensions(),
      clock: this.state.clock + 1
    })
  }
  componentDidMount = () => {
    this.intervalId = setInterval(this.nextFrame, 1000/this.frames);
  }


  // Event handlers
  handleKeyDown = event => {
    // Don't accept events if the game is over
    if (this.state.isGameOver) return;

    // creates deep copy instead of reference
    var copy = _.map(this.state.blocks[0], _.clone); 

    // Pushes block down
    if (event.key === "s" || event.keyCode === "38") {   
      // Skip to next frame
      this.setState({ 
        clock: this.state.framesPerMove
      })
    }

    // Pushes block left
    else if (event.key === "a" || event.keyCode === "37") {      
      this.incrementLocation(copy, "x", -1);
      
      // Check for collisions before updating this.state.blocks
      if (!this.wallCollision(copy, "left") &&
          !this.laidCollision(copy, "left") ) {

        this.setState({
          blocks: [copy, this.state.blocks[1]]
        })
      }
    } 

    // Pushes block right
    else if (event.key === "d" || event.keyCode === "39") {
      this.incrementLocation(copy, "x", 1);     
      
      // Check for collisions before updating this.state.blocks
      if (!this.wallCollision(copy, "right") &&
          !this.laidCollision(copy, "right") ) { 
        
        this.setState({
          blocks: [copy, this.state.blocks[1]]
        })
      }

    }

    // Turns block
    else if (event.key === "w" || event.keyCode === "40") {
      copy = this.turnBlock(copy);

      // Check for collisions before updating this.state.blocks
      if (!this.wallCollision(copy, "turn") &&
          !this.laidCollision(copy, "turn") ) {
        
        this.setState({
          blocks: [copy, this.state.blocks[1]]
        })
      }
    }
    
    // Restart game
    else if (event.key === "r") {
      this.handleClick(event);
    }
  }
  handleClick = event => {
    clearInterval(this.intervalId); // stops frames
    this.intervalId = setInterval(this.nextFrame, 1000/this.frames);

    this.setState({
      blocks: [this.chooseRandomBlock(), this.chooseRandomBlock()],
      laidBlocks: [],

      score: 0,
      level: 1,
      lines: 0,

      clock: 0,
      framesPerMove: 18,
      dims: this.calcDimensions(),

      isGameOver: false,
      isUpdatable: false
    })
    event.preventDefault()
  }

  render() {
    let dims = this.state.dims

    return (
      <div 
      className="game"
      style={{
        height: dims.gameHeight,
        width: dims.gameWidth
      }}
      onKeyDown={this.handleKeyDown}
      tabIndex="0"
      >
        <div
          className='board-container'
          style={{
            height: dims.boardContainerHeight,
            width: dims.boardContainerWidth
          }}
        >
          <Board 
            current = {this.state.blocks[0]}
            laid = {this.state.laidBlocks}
            dims = {dims}    
          />
        </div>

        <div
        className = "metadata-container"
        style = {{
          height: dims.gameHeight,
          width: dims.gameWidth - dims.boardContainerWidth,
        }}
        >
          <NextBlock 
            next={this.state.blocks[1]}
            dims={dims}
          />
          <Restart 
            onClick = {this.handleClick}
            dims={dims}
          />
          <Score 
            score={this.state.score}
            level={this.state.level}
            lines={this.state.lines}
            dims={dims}
          />
          
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));