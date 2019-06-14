/*eslint no-unused-vars: "off"*/
import React, { Component } from 'react';
import './Game.css';

const TILESIZE = 32; // Size of each tile in pixels
const GRIDSIZE = 15; // Number of tiles per row

class Game extends Component {
    constructor(props) {
        super(props);

        // Sets content size to match TILESIZE and GRIDSIZE
        this.content_width = GRIDSIZE * TILESIZE;
        this.content_height = GRIDSIZE * TILESIZE;

        this.state = {
            baddie_class: " ",
            baddie_type: "baddie-ninja ", //TEMP get from db

            //Position of baddie in window
            baddie_left: 0,
            baddie_top: 0,

            //Position of baddie in the grid
            baddie_grid_left: 0,
            baddie_grid_top: 0,
        };

        this.baddie_el = React.createRef();

        this.keypress = this.keypress.bind(this);

        /**
         * This is the game area with a 10x10 grid (GRIDSIZE)
         * 10 - nothing (grass)
         * 11 - wall (impassible)
         * 13 - door (passible)
         * 14 - water (passible)
         */
        // The array size must be GRIDSIZE*GRIDSIZE
        this.gameArea = [
            11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11,
            11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 10, 10, 10, 11,
            11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 10, 10, 10, 11,
            11, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11, 10, 10, 10, 11,
            11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11,
            11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 13,
            11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11,
            11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11,
            11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11,
            11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11,
            11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11,
            11, 14, 14, 14, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11,
            11, 14, 14, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11,
            11, 14, 14, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11,
            11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11
        ];
    }

    componentDidMount() {
        document.title = "THE GAME";

        // Set starting position of baddie
        this.setState({
            "baddie_left": this.baddie_el.offsetLeft,
            "baddie_top": this.baddie_el.offsetTop
        });

        this.moveBaddie(1, 1);
        document.addEventListener("keydown", this.keypress);
    }

    /**
     * This function checks that the move was possible and returns either true or false
     * @param  {int} moveLeft	- direction to move horizontally, range: -1 -> 1
     * @param  {int} moveTop	- direction to move vertically, range: -1 -> 1
     * @return {bool} 			- was baddie movable
     */
    isBaddieMovable(moveLeft, moveTop) {
        // This time we want the grid position values, not the pixel position values
        let newLeft = this.state.baddie_grid_left + moveLeft,
            newTop = this.state.baddie_grid_top + moveTop,

            movable = false,

            // Get the tile baddie wants to move to
            // left is the row number and top is the column number
            tilePos = newLeft + newTop*GRIDSIZE,

            tile =  this.gameArea[tilePos];

        if (newLeft > GRIDSIZE-1 || newLeft < 0) {
            return movable;
        }

        // Switch case on the tile value baddie is moving to
        switch (tile) {
            case 10: // empty
            case 14: // water
                // Move baddie to tile
                movable = true;
                break;
            case 13: // door
                // Move baddie to tile
                movable = true;
                break;
            case 11:
                // Wall, don't move baddie
                movable = false;
                break;
            default:
                // Tile was impassible - collided, do not move baddie
                movable = false;
        }
        return movable;
    }

    /**
     * Changes position variables for baddie and style to draw the change out on the screen
     * @param  {[type]} x	- direction to move horizontally
     * @param  {[type]} y	- direction to move vertically
     */
    moveBaddie(x, y) {
        // Update baddies grid position variables
        this.setState((state) => ({
            "baddie_grid_left": state.baddie_grid_left + x,
            "baddie_grid_top": state.baddie_grid_top + y,
        }));

        // Assign left and right to the pixel positions inside the area that the baddie is moving to
        // x and y are the grid coordinates, so you take TILESIZE and use that to get the pixels
        this.setState( (state) => ({
            "baddie_left": state.baddie_grid_left * TILESIZE,
            "baddie_top": state.baddie_grid_top * TILESIZE
        }));
    }

    keypress(event) {
        // Gets what key was pressed as number
        let key = event.keyCode || event.which;

        // Switch case to decide where baddie is to go
        switch (key) {
            case 37: //left
                if (this.isBaddieMovable(-1, 0)) {
                    // Turn baddie left - transform handled in style.css
                    this.setState({"baddie_class": "baddie-left "});
                    this.moveBaddie(-1, 0);
                }
                break;
            case 38: //up
                if (this.isBaddieMovable(0, -1)) {
                    this.moveBaddie(0, -1);
                }
                break;
            case 39: //right
                if (this.isBaddieMovable(1, 0)) {
                    // Turn baddie right - transform handled in style.css
                    this.setState({"baddie_class": " "});
                    this.moveBaddie(1, 0);
                }
                break;
            case 40: //down
                if (this.isBaddieMovable(0, 1)) {
                    this.moveBaddie(0, 1);
                }
                break;

            default:
                // Button was pressed but no action is to be performed
                // return this function so that the default button action is performed instead
                return true;
        }
        // Baddie action was performed - prevent button default
        event.preventDefault();
    }

    render() {
        return (
            <main>
                <p>Control the character with the arrow keys</p>
                <div
                    id="content"
                    style={{
                        width: this.content_width + "px",
                        height: this.content_height + "px"
                    }}
                    className = "content"
                >
                    {this.gameArea.map((item, index) => (
                        <div className={"tile t" + item} id={"n" + index} key={index} />
                    ))}

                    <div
                        id="baddie"
                        ref={this.baddie_el}
                        style={{
                            left: this.state.baddie_left + "px",
                            top: this.state.baddie_top + "px"
                        }}
                        className = {"baddie "
                                    + this.state.baddie_type
                                    + this.state.baddie_class}
                    >
                    </div>
                </div>
            </main>
        );
    }
}

export default Game;
