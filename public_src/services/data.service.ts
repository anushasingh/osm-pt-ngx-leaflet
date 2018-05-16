import { Db } from './dexiedb';
import { IPtStop } from '../core/ptStop.interface';
import { IPtRelationNew } from '../core/ptRelationNew.interface';
import { IPtRouteMasterNew } from '../core/ptRouteMasterNew.interface';
import { IPtWay } from '../core/ptWay.interface';
export class DataService {

  public db: Db;

  constructor() {
    this.db = new Db();
  }
  addStop(data: IPtStop): any {

   return this.db.transaction('rw', this.db.Stops, () => {
     return this.db.Stops.add(data).then((lastKey) => {
        console.log('(data s.) Added stop to idb');
    });
  });
  }
  addRoute(data: IPtRelationNew): any {

    return this.db.transaction('rw', this.db.Routes, () => {
      return this.db.Routes.add(data).then((lastKey) => {
        console.log('(data s.) Added route to idb');
      });
    });
  }
  addWay(data: IPtWay): any {

    return this.db.transaction('rw', this.db.Ways, () => {
      return this.db.Ways.add(data).then((lastKey) => {
        console.log('(data s.) Added way to idb');
      });
    });
  }
  addRouteMaster(data: IPtRouteMasterNew): any {

    return this.db.transaction('rw', this.db.RouteMasters, () => {
      return this.db.RouteMasters.add(data).then((lastKey) => {
        console.log('(data s.) Added route_master to idb');
      });
    });
  }
  getStop(id: string): any{
    return this.db.transaction('r', this.db.Stops, () => {
      return this.db.Stops.get(id,(stop) => {
        console.log('(data s.) got stop from idb');
        console.log(stop);
      });
    });
  }
}
