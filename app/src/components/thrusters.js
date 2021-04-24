import { Component,Types } from "ecsy"

export class ThrusterComponent extends Component {}
ThrusterComponent.schema = {
    thrust: { type: Types.Number, default: 1 },
    boost: { type: Types.Number, default: 3 }, // boost multiplier
    burn: { type: Types.Number, default: 1 }, // fuel burn
    boost_burn: { type: Types.Number, default: 3 }, // boost fuel burn
    local: { type: Types.Boolean, default: false },
}