import React from "react";
import ReactDOM, { render } from "react-dom";
import { GameComponent } from "../../src/core/ui_components/GameComponent"
import { HUDView } from "../../src/core/ui_components/HUDView";
import { game_init } from "./game.js"
import { PlanetMeshCreator } from "./mesh_creator"
import { SoundLoader } from "./sound_loader"
import "./style.css"

export class PlanetGame extends React.Component {
    constructor(props){
        super(props)
        this.state = { 
            playing: false,
            loading: false,
            mesh_creator: null,
            fullscreen: false,
            playSound: false,
        }
        this.handleNewGame = this.handleNewGame.bind(this)
    }
    
    handleNewGame(){
        this.setState({loading:true}) 
        if(this.state.mesh_creator == null){
            const creator = new PlanetMeshCreator()
            creator.load().then( () => {
                const soundLoader = new SoundLoader()
                soundLoader.load().then( () => {
                    soundLoader.get('title').play();
                    this.startGame()
                })
            })
            this.setState({mesh_creator:creator})
        }else{
            this.startGame()
        }
    } 

    startGame(){
        this.setState({playing:true,loading:false})
    }

    exitToMenu(){
        this.setState({playing:false}) 
    }

    gameOverMenu(distance){
        return (
            <div className="menu">
                <h1>Game Over</h1>
                <p>You traveled {format_int(distance)} million kilometers!</p>

                <button onClick={()=>this.exitToMenu()}>PLAY AGAIN</button>
            </div>
        )
    }

    render(){
       
        if(this.state.playing){
            return  (
                <GameComponent init_game={game_init} mesh_creator={this.state.mesh_creator}>
                    {hudState => (
                        <HUDView hudState={hudState}>
                            {hudState => (
                                <React.Fragment>
                                    {(hudState != undefined && hudState.game_over)?this.gameOverMenu(hudState.distance):""}
                                    <div className="score">
                                        <div>{ format_int(hudState.distance) } mkm</div>
                                        <div>{ format_int(hudState.velocity) } mkm/s</div>
                                    </div>
                                </React.Fragment>
                            )}
                        </HUDView>
                    )}
                </GameComponent>
            )
        }else if(this.state.loading){
            return (
                <div className="menu">
                    <p>LOADING ASSETS..</p>
                </div>
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

function format_int(n){
    return Math.round(n).toLocaleString({minimumFractionDigits: 0,maximumFractionDigits: 0})
}