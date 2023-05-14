import { model, Schema } from 'mongoose'

export const UserModel = model(
  'users',
  Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      min: 4,
    },
    password: {
      type: String,
      required: true,
    },
  })
)
