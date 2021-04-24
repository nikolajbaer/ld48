import { Component,Types } from "ecsy"

export class ThrusterComponent extends Component {}
ThrusterComponent.schema = {
    thrust: { type: Types.Number, default: 1 },
    local: { type: Types.Boolean, default: false },
}