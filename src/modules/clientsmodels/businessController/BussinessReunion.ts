import ReunionModel, { IReunion } from "../models/Agenda";
import ClientModel, { IClients } from "../models/Clients";

class BussinessReunion {
  public async createReunion(dates: IReunion) {
    try {
      let ReunionDb = new ReunionModel(dates);
      let result = await ReunionDb.save();
      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  public async readReunion(): Promise<Array<IReunion>>;
  public async readReunion(id: string): Promise<IReunion>;
  public async readReunion(
    query: any,
    skip: number,
    limit: number
  ): Promise<Array<IReunion>>;

  public async readReunion(
    params1?: string | any,
    params2?: number,
    params3?: number
  ): Promise<Array<IReunion> | IReunion> {
    try {
      if (params1 && typeof params1 == "string") {
        var result: IReunion = await ReunionModel.findOne({
          _id: params1,
        });

        return result;
      } else if (params1) {
        let skip = params2 ? params2 : 0;
        let limit = params3 ? params3 : 1;
        let listreunion: Array<IReunion> = await ReunionModel.find(params1)
          .skip(skip)
          .limit(limit);
        return listreunion;
      } else {
        let listreunion: Array<IReunion> = await ReunionModel.find();
        return listreunion;
      }
    } catch (err) {
      return err;
    }
  }

  public async updateReunion(id: string, reunion: any) {
    try {
      let result = await ReunionModel.update({ _id: id }, { $set: reunion });
      return result;
    } catch (err) {
      return err;
    }
  }

  public async deleteReunion(id: string) {
    try {
      let result = await ReunionModel.remove({ _id: id });
      return result;
    } catch (err) {
      return err;
    }
  }

  public async addReu(idUs: string, idRol: string) {
    let client = await ClientModel.findOne({ _id: idUs });
    if (client != null) {
      var reunion = await ReunionModel.findOne({ _id: idRol });
      if (reunion != null) {
        client.reunion.push(reunion);
        return await client.save();
      }
      return null;
    }
    return null;
  }

  public async removeReu(idCl: string, idReu: string) {
    let client = await ClientModel.findOne({ _id: idCl });
    var reunion = await ReunionModel.findOne({ _id: idReu });

    if (client != null && reunion != null) {
      let newreunion: Array<IReunion> = client.reunion.filter(
        (item: IReunion) => {
          if (item._id.toString() == reunion._id.toString()) {
            //si no utilizo el toString() no funciona...esta raro
            return false;
          }

          return true;
        }
      );
      client.reunion = newreunion;
      try {
        return await client.save();
      } catch (err) {
        return err;
      }
    }
    return null;
  }
}

export default BussinessReunion;
