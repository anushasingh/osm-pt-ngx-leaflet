import { Db } from './dexiedb';
import { IPtStopDB } from '../core/ptStopDB.interface';
import { IPtRelationDB } from '../core/ptRelationDB.interface';
import { IPtRouteMasterNew } from '../core/ptRouteMasterNew.interface';
import { IPtWay } from '../core/ptWay.interface';
export class DataService {

  public db: Db;

  constructor() {
    this.db = new Db();
  }

  addStop(data: IPtStopDB): any {

    return this.db.transaction('rw', this.db.Stops, () => {
      return this.db.Stops.put(data).then((lastKey) => {
        console.log('(data s.) Added stop with id ' + data.id + ' to idb');
      });
    });
  }

  addRoute(data: IPtRelationDB): any {

    return this.db.transaction('rw', this.db.Routes, () => {
      return this.db.Routes.put(data).then((lastKey) => {
        console.log('(data s.) Added route with id ' + data.id + ' to idb');
      });
    });
  }

  addWay(data: IPtWay): any {

    return this.db.transaction('rw', this.db.Ways, () => {
      return this.db.Ways.put(data).then((lastKey) => {
        console.log('(data s.) Added way with id ' + data.id + ' to idb');
      });
    });
  }

  addRouteMaster(data: IPtRouteMasterNew): any {

    return this.db.transaction('rw', this.db.RouteMasters, () => {
      return this.db.RouteMasters.put(data).then((lastKey) => {
        console.log('(data s.) Added route master with id ' + data.id + ' to idb');
      });
    });
  }


  // push routeid to the routes array of a given stop
  addtoRoutesofStop(stopid: number, routeid: number): any {

    return this.db.transaction('rw', this.db.Stops, () => {
      return this.db.Stops.where('id').equals(stopid).modify((x) => {
        x.routes.push(routeid);
      });
    });

  }

  getallstops(): any {
    return this.db.transaction('rw', this.db.Stops, () => {
      this.db.Stops.each((stop) => {
      });
    });
  }

  getStopsForRoute(routeid: number): any {
    return this.db.transaction('rw', this.db.Stops, this.db.Routes, () => {
      let nodemembers = [];
      let stops = [];
      return this.db.Routes.get({id: routeid}).then((route) => {
        nodemembers = route['nodemembers'];
      }).then(() => {
        return this.db.Stops.each((stop) => {
          if (nodemembers.includes(stop.id)) {
            stops.push(stop);
          }
        }).then(() => {
          return Promise.resolve(stops);
        });
      });
    });
  }

  // gets route relations for a given node id
  getRoutesforNode(stopid: number): any {
    return this.db.transaction('rw', this.db.Stops, this.db.Routes, () => {
      return this.db.Stops.get({id: stopid}).then((stop) => {
        let arrayofroutes = stop.routes; // contains only ids
        let filteredroutes = [];
        return this.db.Routes.each((route) => {
          if (arrayofroutes.includes(route.id)) {
            filteredroutes.push(route);
          }
        }).then(() => {
          return Promise.resolve(filteredroutes);
        });
      });
    });
  }

  addToDownloadedRoutes(relid: number): any {
    return this.db.DownloadedRoutes.put({id: relid});
  }
  addToDownloadedStops(stopid: number): any {
    return this.db.DownloadedStops.put({ id: stopid });
  }

}
