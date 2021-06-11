import RoutesController from "./routeController/RoutesController";
import { Express } from "express";
class Routes {
  private routesController: RoutesController;
  private routeparent: string;
  constructor(routeparent: string, app: Express) {
    this.routesController = new RoutesController();
    this.routeparent = routeparent;
    this.configureRoutes(app);
  }

  private configureRoutes(app: Express) {
    app
      .route(`${this.routeparent}/client`)
      .post(this.routesController.createClient);

    app
      .route(`${this.routeparent}/client`)
      .get(this.routesController.getClient);

    app
      .route(`${this.routeparent}/client/tipo/:date`) //buscar tipo de cliente regular o potencial
      .get(this.routesController.getTypeClient);

    app
      .route(`${this.routeparent}/client/:tipo/:name`) //buscar por nombre de cliente regular
      .get(this.routesController.getNameClientR);

    app
      .route(`${this.routeparent}/client/:id`)
      .put(this.routesController.updateClient);
    app
      .route(`${this.routeparent}/client/:id`)
      .delete(this.routesController.removeClients);

    app
      .route(`${this.routeparent}/clientSendPhoto/:id`)
      .post(this.routesController.uploadPortrait);
    app
      .route(`${this.routeparent}/clientgetportrait/:id`)
      .get(this.routesController.clientgetportrait);
  }
}

export default Routes;
