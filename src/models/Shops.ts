import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { IList } from "./Lists";
import { IUser } from "./User";

export interface IShop extends Document {
  shopName: string;
  localName: string;
  description: string;
  lists: PopulatedDoc<IList & Document>[];
  manager: PopulatedDoc<IUser & Document>;
  team: PopulatedDoc<IUser & Document>[];
}

const ShopSchemma: Schema = new Schema(
  {
    shopName: {
      type: String,
      required: true,
      trim: true,
    },
    localName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    lists: [
      {
        type: Types.ObjectId,
        ref: "List",
      },
    ],
    manager: {
      type: String,
      ref: "User",
    },
    team: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Shop = mongoose.model<IShop>("Shop", ShopSchemma);
export default Shop;
