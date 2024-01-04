import mongoose, { Schema } from 'mongoose'
import { RouteTag, type IRoute } from '../types/route'

const RouteSchema = new mongoose.Schema(
  {
    open: { type: Boolean, default: true },
    goal: { type: String, required: true },
    details: { type: String, required: false },
    gym: { type: Schema.Types.ObjectId, required: true },
    tags: { type: [String], enum: RouteTag, required: false },
    user: { type: Schema.Types.ObjectId, required: true },
    requestedSetter: { type: Schema.Types.ObjectId, default: null },
    setter: { type: Schema.Types.ObjectId, default: null },
    votes: { type: [String], default: [] },
    zone: { type: String, default: null },
    grade: { type: Number, default: null, min: 0, max: 17 },
    date: { type: Date, default: Date.now },
  },
  {
    versionKey: false
  }
)

const RouteModel = mongoose.model<IRoute>('Route', RouteSchema)

export default RouteModel
