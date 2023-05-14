import { model, Schema } from 'mongoose'

export const PostModel = model(
  'posts',
  Schema(
    {
      title: {
        type: String,
        required: true,
      },
      summary: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      cover: {
        type: String,
        required: true,
      },
      author: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
    },
    { timestamps: true }
  )
)
