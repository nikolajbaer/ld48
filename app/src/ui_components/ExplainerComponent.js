import React from "react";
import explainer1 from "../../assets/images/explainer1.png"
import explainer2 from "../../assets/images/explainer2.png"
import explainer3 from "../../assets/images/explainer3.png"
import explainer4 from "../../assets/images/explainer4.png"
import explainer5 from "../../assets/images/explainer5.png"

export class ExplainerComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            slide: 1, 
        }
        this.slides = [
            {
                img:explainer1,
                txt:"Fly your spaceship around the system using W/A/S/D or Arrow keys to operate the thrusters and SHIFT to use extra thrust. Your current trajectory with the graviation of the planets is shown as a path ahead of your ship."
            },
            {
                img: explainer2,
                txt:"Blue path means there are no collisions anticipated ahead. Green path indicates you most likely will have a soft landing on a planet to refuel! Remember thrusters help you slow down!"
            },
            {
                img: explainer5,
                txt:'Red path means you most likely will leave a smoldering crater, or possibly incinerate in the star at the center. Use thrust to avoid that fate, and maybe try speeding up to escape that gravity!'
            },
            {
                img: explainer3,
                txt:'Land on planets to refuel. Use SHIFT to use your boost thrusters to get off a planet.'
            },
            {
                img: explainer4,
                txt:'Have fun, use the orbital paths to glide into planets as you go deeper and deeper down the well!'
            }
        ]
    }

    onNext(){
        const s = this.state.slide + 1
        if(s > 5){
            this.props.closeHandler()
        }else{
            this.setState({slide:s})
        }
    }

    render(){
        const slide = this.slides[this.state.slide-1]
        return (
            <div>
                <img src={slide.img} />
                <p>{slide.txt}</p>
                <button onClick={()=>this.onNext()}>{this.state.slide==5?"Let's Go!":"NEXT"}</button>
            </div>
        )
    }
}