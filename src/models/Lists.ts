import mongoose, { Types, Schema, Document } from "mongoose";

const listStatus = {
  TOSHOP: "toShop",
  TOCHANGESOME: "toChangeSome",
  BOUGHT: "bought",
  IDEAS: "ideas",
} as const;

export type ListStatus = (typeof listStatus)[keyof typeof listStatus];

export interface IList extends Document {
  name: string;
  description: string;
  shop: Types.ObjectId;
  completedBy: {
    user: Types.ObjectId;
    status: ListStatus;
  }[];
  status: ListStatus;
}

export const ListSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    shop: {
      type: Types.ObjectId,
      ref: "Shop",
    },
    status: {
      type: String,
      enum: Object.values(listStatus),
      default: listStatus.TOSHOP,
    },
    completedBy: [
      {
        user: {
          type: Types.ObjectId,
          ref: "User",
          default: null,
        },
        status: {
          type: String,
          enum: Object.values(listStatus),
          default: listStatus.TOSHOP,
        },
      },
    ],
  },
  { timestamps: true }
);

const List = mongoose.model<IList>("List", ListSchema);
export default List;
