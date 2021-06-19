export var validacion = (value: string) => {
  const regexp = /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

  return regexp.test(value);
};

export var validacionOrdenarP = (value: String) => {
  value = value.toLowerCase();
  if (value == "off" || value == "on") {
    return true;
  }
  return false;
};

//--validacion stock, price de product
export var isValueOk = (value: number) => {
  if (value > -1) {
    return true;
  }
  return false;
};
