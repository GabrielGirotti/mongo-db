import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { IList } from "./Lists";

export interface IShop extends Document {
  shopName: string;
  localName: string;
  description: string;
  lists: PopulatedDoc<IList & Document>[]
};

const ShopSchemma: Schema = new Schema({
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
  lists: [{
    type: Types.ObjectId,
    ref: "List"
  }]
}, {timestamps: true});

const Shop = mongoose.model<IShop>('Shop', ShopSchemma)
export default Shop
