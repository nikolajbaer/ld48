import { SystemStateComponent, Component, Types, TagComponent } from 'ecsy'
import { Vector2Type } from '../ecs_types'

// inpsired by https://github.com/macaco-maluco/thermal-runway/blob/master/src/components/

export class Body2dComponent extends Component {}
Body2dComponent.schema = {
  density: { type: Types.Number, default: 1  },
  bounds_type: { type: Types.String, default:"circle" },
  width: { type: Types.Number, default: 1 },
  height: { type: Types.Number, default: 1 },
  body_type: { type: Types.Number, default: "static"  }, 
  velocity: { type: Vector2Type },
  destroy_on_collision: { type: Types.Boolean, default: false },
  track_collisions: { type: Types.Boolean, default: false }, 
  fixed_rotation: { type: Types.Boolean, default: false },
}

export class Physics2dComponent extends SystemStateComponent {}
Physics2dComponent.schema = {
  body: { type: Types.Ref }
}

