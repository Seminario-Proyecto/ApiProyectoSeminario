import mongoose, { Schema, Document } from "mongoose";

export interface ISimpleProducts {
  id: string;
  name: string;
  cantidad: number;
  priceUnitary: number;
  priceTotal: number;
  registerdate: Date;
}

export interface IProducts extends Document {
  name: string;
  uriimage: string;
  pathavathar: string;
  stock: number;
  price: number;
  ofert: number;
  registerdate: Date;
}
