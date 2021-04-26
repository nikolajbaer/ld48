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
                txt:"Fly your spaceship around the system using W/A/S/D or Arrow keys to operate the thrusters. Your current trajectory with the graviation of the planets is shown as a path ahead of your ship."
            },
            {
                img: explainer2,
                txt:"Blue path means there are no collisions anticipated ahead. Green path indicates you most likely will have a soft landing on a planet to refuel! Remember thrusters help you slow down!"
            },
            {
                img: explainer3,
                txt:'Red path means you most likely will leave a smoldering crater, or possibly incinerate in the star at the center.'
            },
            {
                img: explainer4,
                txt:'Land on planets to refuel. Use SPACE to use your boost thrusters to get off a planet, and SHIFT to make fine adjustments to your thrust.'
            },
            {
                img: explainer5,
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