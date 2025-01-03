import mongoose from 'mongoose'
import type { IGym } from '../types/gym'
import { State } from '../types/gym'

const GymSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, enum: Object.values(State), required: true },
    zones: { type: [String], default: [] }
  },
  {
    versionKey: false
  }
)

const GymModel = mongoose.model<IGym>('Gym', GymSchema)

export default GymModel
