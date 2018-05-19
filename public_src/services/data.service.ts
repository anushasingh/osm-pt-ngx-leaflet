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
      return this.db.Stops.add(data).then((lastKey) => {
        console.log('(data s.) Added stop to idb');
      });
    });
  }

  addRoute(data: IPtRelationDB): any {

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

  // getStop(id: number): any {
  //   return this.db.transaction('r', this.db.Stops, () => {
  //     console.log(id);
  //     return this.db.Stops.get({id: id}).then ((firstFriend) => {
  //       console.log("Friend with id 1: " + firstFriend.id);
  //       return firstFriend;
  //     });
  //   });
  // }

  // addStopsRouteTable(stopid: number, routeid: number){
  //
  // }

  // getRoutesforStop(): any{
  //   return this.db.Routes.where();
  //
  // }

  // add to relations of a stop
  addtoroutes(stopid: number, routeid: number): any {

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
    return this.db.transaction('rw', this.db.Stops,  this.db.Routes,() => {
      let nodemembers =[];
      let stops = [];
      return this.db.Routes.get({ id: routeid }).then((route) => {
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
      return this.db.Stops.get({ id: stopid }).then((stop) => {
       let arrayofroutes = stop.routes; // contains only ids
       let filteredroutes = [];
       return this.db.Routes.each((route) => {
          if (arrayofroutes.includes(route.id)) {
             filteredroutes.push(route); }
        }).then(() => {
          return Promise.resolve(filteredroutes);
        });
      });
    });
  }

}
