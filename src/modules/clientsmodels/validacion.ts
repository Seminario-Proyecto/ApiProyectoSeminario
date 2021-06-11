import BusinessClient from "./businessController/BussinessClients";
import { IClients } from "./models/Clients";

export var validacion = (value: string) => {
  const regexp = /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

  return regexp.test(value);
};

export const validacionphone = (value: string) => {
  const regexp = /^\(?(\d{3})\)?[-]?(\d{3})[-]?(\d{4})$/; //https://voximplant.com/blog/javascript-regular-expression-para-verificacion-de-numeros-de-telefono
  return regexp.test(value);
};

export const validacionprob = (value: number) => {
  if (value > -1 && value < 101) {
    return true;
  }
  return false;
};
/*
export const validacionZona = (value: string) => {
  const regexp = /^(?![_.])(?!.*[_.]{2})$/;
  return regexp.test(value);
};*/
