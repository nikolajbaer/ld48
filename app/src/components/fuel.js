import { Component,Types } from "ecsy"


export class FuelComponent extends Component {}
FuelComponent.schema = {
    amount: { type: Types.Number, default: 100.0 }, // 100 fuel units
    costPerThrust: { type: Types.Number, default: 0.1 }
}