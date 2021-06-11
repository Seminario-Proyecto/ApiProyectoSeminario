import { Request, Response } from "express";
import BussinessClient from "../businessController/BussinessClients";
import { IClients } from "../models/Clients";
import validator from "validator";
import { validacion, validacionphone, validacionprob } from "../validacion";
import isEmpty from "is-empty";
import path from "path";
import sha1 from "sha1";
class RoutesController {
  public async createClient(request: Request, response: Response) {
    var client: BussinessClient = new BussinessClient();
    var clientData = request.body;
    var ClientD: IClients = clientData;
    try {
      if (
        validator.isEmail(ClientD.email) &&
        validacion(ClientD.firtsname) &&
        validacion(ClientD.lastname) &&
        validacionphone(ClientD.telephone) &&
        validacionprob(ClientD.probability)
      ) {
        ClientD["registerdate"] = new Date();
        let result = await client.addClient(ClientD);
        response.status(201).json({ serverResponse: result });
        return;
      } else {
        return response.status(404).json({
          serverResponse: "Intruduzca parametros de registro correctos",
        });
      }
    } catch (err) {
      console.log(err);
      return response.status(404).json({
        serverResponse: "Es necesario parametros",
        err,
      });
    }
  }

  public async getClient(request: Request, response: Response) {
    let client: BussinessClient = new BussinessClient();
    try {
      let clientData: Array<IClients> = await client.readClients();
      response.status(200).json({ serverResponse: clientData });
    } catch (err) {
      return response.status(300).json({ serverResponse: err });
    }
  }

  public async getTypeClient(request: Request, response: Response) {
    let client: BussinessClient = new BussinessClient();
    let date: string = request.params.date;
    //console.log(date);
    try {
      let clientData: Array<IClients> | IClients = await client.getTypeClient(
        date
      );
      response.status(200).json({ serverResponse: clientData });
    } catch (err) {
      return response.status(300).json({ serverResponse: err });
    }
  }

  public async getNameClientR(request: Request, response: Response) {
    let client: BussinessClient = new BussinessClient();
    let tipo: string = request.params.tipo;
    let name: string = request.params.name;
    console.log(tipo);
    console.log(name);
    try {
      if (tipo && (tipo == "Potencial" || tipo == "Regular")) {
        let clientData: Array<IClients> | IClients =
          await client.getNamesClientR(name, tipo);
        response.status(200).json({ serverResponse: clientData });
      } else {
        return response
          .status(404)
          .json({ serverResponse: "Coloque tipo de cliente valido" });
      }
    } catch (err) {
      return response.status(300).json({ serverResponse: err });
    }
  }

  public async updateClient(request: Request, response: Response) {
    var user: BussinessClient = new BussinessClient();
    let id: string = request.params.id;
    var params = request.body;

    try {
      var result = await user.updateClient(id, params);
      response.status(200).json({ serverResponse: result });
      return;
    } catch (err) {
      return response.status(300).json({ serverResponse: err });
    }
  }

  public async removeClients(request: Request, response: Response) {
    var user: BussinessClient = new BussinessClient();
    let id: string = request.params.id;
    try {
      let result = await user.deleteClients(id);
      response.status(200).json({ serverResponse: result });
    } catch (err) {
      response.status(404).json({ serverResponse: err });
    }
  }

  public async uploadPortrait(request: Request, response: Response) {
    var id: string = request.params.id;
    try {
      if (!id) {
        response
          .status(300)
          .json({ serverResponse: "El id es necesario para subir una foto" });
        return;
      }
      var client: BussinessClient = new BussinessClient();
      var clientToUpdate: IClients = await client.readClients(id);
      if (!clientToUpdate) {
        response.status(300).json({ serverResponse: "El cliente no existe!" });
        return;
      }
    } catch (err) {
      return response
        .status(300)
        .json({ serverResponse: "Hubo algun error intente de nuevo" });
    }
    if (isEmpty(request.files)) {
      response
        .status(300)
        .json({ serverResponse: "No existe una imagen adjunto" });
      return;
    }
    var dir = `${__dirname}/../../../../avatarclientsfiles`;
    var absolutepath = path.resolve(dir);
    var files: any = request.files;

    var key: Array<string> = Object.keys(files);

    var copyDirectory = (totalpath: string, file: any) => {
      return new Promise((resolve, reject) => {
        file.mv(totalpath, (err: any, success: any) => {
          if (err) {
            resolve(false);
            return;
          }
          resolve(true);
          return;
        });
      });
    };
    var subidas: number = 0;
    var nosubidas: number = 0;
    function getFileExtension(filename: string) {
      return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined; //verificamos su extensión
    }
    for (var i = 0; i < key.length; i++) {
      var file: any = files[key[i]];
      if (
        getFileExtension(file.name) === "jpg" ||
        getFileExtension(file.name) === "png" ||
        getFileExtension(file.name) === "gif" ||
        getFileExtension(file.name) === "jpeg"
      ) {
        var filehash: string = sha1(new Date().toString()).substr(0, 7);
        var newname: string = `${filehash}_${file.name}`;
        var totalpath = `${absolutepath}/${newname}`;
        await copyDirectory(totalpath, file);
        clientToUpdate.uriphoto = "/client/clientgetportrait/" + id;
        clientToUpdate.pathphoto = totalpath;
        try {
          var userResult: IClients = await clientToUpdate.save();
          response.status(201).json({ serverResponse: "Imagen subida" });
          subidas += 1;
        } catch (err) {
          return response.status(300).json({ serverResponse: err });
        }
      } else {
        nosubidas += 1;
      }
      //return response.status(300).json({ serverResponse: "err" });
    }
    return response.status(200).json({
      serverResponse:
        "Petición finalizada, se subido " +
        subidas +
        " imagenes y " +
        nosubidas +
        " no se pudo subir porque no eran formato imagen",
    });
  }

  public async clientgetportrait(request: Request, response: Response) {
    var id: string = request.params.id;
    try {
      if (!id) {
        response
          .status(300)
          .json({ serverResponse: "Identificador no encontrado" });
        return;
      }

      var client: BussinessClient = new BussinessClient();
      var clientData: IClients = await client.readClients(id);

      if (!clientData) {
        response
          .status(300)
          .json({ serverResponse: "Error no existe el client" });
        return;
      }
    } catch (err) {
      return response.status(300).json({ serverResponse: "Hubo algun error" });
    }
    if (clientData.pathphoto == null) {
      response.status(300).json({ serverResponse: "No existe portrait " });
      return;
    }
    response.sendFile(clientData.pathphoto);
  }
}
export default RoutesController;
