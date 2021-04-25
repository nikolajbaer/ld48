import React from "react";
import ReactDOM, { render } from "react-dom";
import { GameComponent } from "../../src/core/ui_components/GameComponent"
import { HUDView } from "../../src/core/ui_components/HUDView";
import { game_init,asset_loader } from "./game.js"
import "./style.css"

export class PlanetGame extends React.Component {
    render(){
        return  (
            <GameComponent init_game={game_init}>
                {hudState => (
                <HUDView hudState={hudState}>
                    {hudState => (
                        <div>{Math.round(hudState.distance).toLocaleString({minimumFractionDigits: 0,maximumFractionDigits: 0}) } million km</div>
                    )}
                </HUDView>
                )}
            </GameComponent>
        )
    }
}

ReactDOM.render( <PlanetGame />, document.getElementById("app"))

