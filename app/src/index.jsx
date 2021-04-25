import React from "react";
import ReactDOM, { render } from "react-dom";
import { GameComponent } from "../../src/core/ui_components/GameComponent"
import { HUDView } from "../../src/core/ui_components/HUDView";
import { game_init,asset_loader } from "./game.js"
import "./style.css"

export class PlanetGame extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            playing: false,
            fullscreen: false,
            playSound: false,
        }
        this.handleNewGame = this.handleNewGame.bind(this)
    }
    
    handleNewGame(){
        this.setState({playing:true}) 
    } 

    render(){
       
        if(this.state.playing){
            return  (
                <GameComponent init_game={game_init}>
                    {hudState => 
                        <HUDView hudState={hudState}>
                            {hudState => (
                                <div>{Math.round(hudState.distance).toLocaleString({minimumFractionDigits: 0,maximumFractionDigits: 0}) } million km</div>
                            )}
                        </HUDView>
                    }
                </GameComponent>
            )
        }else{
            return (
                <div className="menu">
                    <h1>TBD GAME TITLE</h1>
                    <h4>deeper and deeper..</h4>
                    <button onClick={() => this.handleNewGame()}>NEW GAME</button>
                </div>
            )
        }
    }
}

ReactDOM.render( <PlanetGame />, document.getElementById("app"))

