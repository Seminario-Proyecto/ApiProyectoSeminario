import mongoose, { Schema, Document } from "mongoose";
import { ISimpleProducts } from "./Products";

export interface IPedidos extends Document {
  state: string;
  products: Array<ISimpleProducts>;
  registerdate: Date;
  ordenarP: string;
  methodpay: string;
  cuentaBancaria?: string;
  total: number;
  Recibo: Array<string>;
}
const pedidoSchema: Schema = new Schema({
  state: {
    type: String,
    required: true,
    default: "Sin Entregar",
  },
  products: { type: Array },
  registerdate: { type: Date, required: true, default: Date.now },
  ordenarP: { type: String, required: true, default: "off" },
  methodpay: { type: String, required: true },
  cuentaBancaria: { type: String },
  total: { type: Number, default: 0 },
  Recibo: { type: Array },
});
export default mongoose.model<IPedidos>("Pedido", pedidoSchema);
