import mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export type ListType = Document & {
  shopName: string;
  localName: string;
  description: string;
};

const ListSchemma: Schema = new Schema({
  shopName: {
    type: "string",
    required: true,
    trim: true,
  },
  localName: {
    type: "string",
    required: true,
    trim: true,
  },
  description: {
    type: "string",
    required: true,
    trim: true,
  },
});

const List = mongoose.model<ListType>('List', ListSchemma)
export default List
