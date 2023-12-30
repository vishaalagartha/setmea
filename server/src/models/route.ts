import mongoose, { Schema } from 'mongoose'
import { RouteTag, type IRoute } from '../types/route'

const RouteSchema = new mongoose.Schema(
  {
    goal: { type: String, required: true },
    details: { type: String, required: false },
    gym: { type: Schema.Types.ObjectId, required: true },
    tags: { type: [String], enum: RouteTag, required: false },
    user: { type: Schema.Types.ObjectId, required: true },
    setter: { type: Schema.Types.ObjectId, default: null },
    votes: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
)

const RouteModel = mongoose.model<IRoute>('Route', RouteSchema)

export default RouteModel
