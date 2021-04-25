import React from "react";
import { MobileStick } from "./MobileStick"
import { HUDView } from "./HUDView"
import { HUDSystem } from "../systems/hud"

export class GameComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hudState: null, 
            fullscreen: false,
            world: null,
        }
        this.handleFullscreen = this.handleFullscreen.bind(this)
    }

    componentDidMount(){
        if(this.state.world != null){
            this.state.world.stop()
        }
        const options = {render_element: "render"}
        const world = this.props.init_game(options)
        this.setState({
            hudState:world.getSystem(HUDSystem).state,
            world:world
        })
    }

    handleFullscreen(event){
        const showFullscreen = event.target.checked
        if (!document.fullscreenElement && showFullscreen) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen && !showFullscreen) {
                document.exitFullscreen();
            }
        }
        this.setState({fullscreen:showFullscreen})
    }

    render() {
        return (
        <div id="game">
            <canvas id="render"></canvas>
            {this.props.children(this.state.hudState)}
        </div>
        )
    }
}