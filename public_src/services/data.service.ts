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

  getStop(id: number): any {
    return this.db.transaction('r', this.db.Stops, () => {
      console.log(id);
      return this.db.Stops.get({id: id}).then ((firstFriend) => {
        console.log("Friend with id 1: " + firstFriend.id);
        return firstFriend;
      });
    });
  }

  // addStopsRouteTable(stopid: number, routeid: number){
  //
  // }

  // getRoutesforStop(): any{
  //   return this.db.Routes.where();
  //
  // }

  //add to relations of a stop
  addtoroutes(stopid: number, routeid: number): any {

    return this.db.transaction('rw', this.db.Stops, () => {
      return this.db.Stops.where('id').equals(stopid).modify((x) => {
        console.log(x);
        x.routes.push(routeid);
        console.log('this is x');
        console.log(x);
      });
    });

  }

  tempfunction(): any{
    return this.db.transaction('rw', this.db.Stops, this.db.Routes, () => {


    });
  }



  getwholenoderesponse(stopid: number): any{

    return this.db.transaction('rw', this.db.Stops, this.db.Routes, () => {
      return this.db.Stops.get({id: stopid}).then((stop) => {
       let arrayofroutes = stop.routes;
       console.log('this is stop');
       console.log(stop);
       console.log('this is arrayofroutes');
       console.log(arrayofroutes);
       let filteredroutes = [];
       this.db.Routes.each((route) => {
          if (arrayofroutes.includes(route.id)) {
            filteredroutes.push(route);
          }
        }).then(() => {
          console.log(filteredroutes);
          return Promise.resolve(filteredroutes);
        });

      });
    });
  }

}


