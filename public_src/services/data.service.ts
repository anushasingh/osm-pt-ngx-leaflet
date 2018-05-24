import { Db } from '../database/dexiedb';
import { IPtRouteMasterNew } from '../core/ptRouteMasterNew.interface';
import { IPtWay } from '../core/ptWay.interface';
import { StorageService } from './storage.service';
import { IPtStop } from '../core/ptStop.interface';
import { IPtRelationNew } from '../core/ptRelationNew.interface';
import { Injectable } from '@angular/core';
@Injectable()
export class DataService {

  public db: Db;

  constructor(private storageSrv: StorageService) {
    this.db = new Db();
  }
  /* fetches the array of ids of platforms stored in IDB */
  getIdsPlatformsIDB(): any {
    return this.db.PtPlatforms.toCollection().primaryKeys();
  }
  /* fetches the array of ids of stops stored in IDB */
  getIdsStopsIDB(): any {
    return this.db.PtStops.toCollection().primaryKeys();
  }
  /* fetches the array of ids of routes stored in IDB */
  getIdsRoutesIDB(): any {
    return this.db.PtRoutes.toCollection().primaryKeys();
  }
  /* fetches the array of ids of master routes stored in IDB  */
  getIdsMasterRoutesIDB(): any {
    return this.db.PtRouteMasters.toCollection().primaryKeys();
  }
  /* fetches the array of ids of ways stored in IDB */
  getIdsWaysIDB(): any {
    return this.db.PtWays.toCollection().primaryKeys();
  }
  /* fetches the array of ids of completely downloaded stops stored in IDB*/
  getIdsCompletelyDownloadedStops(): any {
    return this.db.CompletelyDownloadedStops.toCollection().primaryKeys();
  }
  /* fetches the array of ids of completely downloaded platforms stored in IDB */
  getIdsCompletelyDownloadedPlatforms(): any {
    return this.db.CompletelyDownloadedPlatforms.toCollection().primaryKeys();
  }
  /* fetches the array of ids of completely downloaded completely downloaded routes
  stored in IDB and assigns them to storage service's 'completelyDownloadedRoutes' variable*/
  getIdsCompletelyDownloadedRoutes(): any {
    return this.db.CompletelyDownloadedRoutes.toCollection().primaryKeys();
  }
  // addStop(data: IPtStop): any {
  //     return this.db.PtStops.put(data).then(() => {
  //       console.log('(data s.) Added stop with id ' + data.id + ' to idb');
  //     });
  // }
  // addPlatform(data: IPtStop): any {
  //   return this.db.PtPlatforms.put(data).then(() => {
  //     console.log('(data s.) Added platform with id ' + data.id + ' to idb');
  //   });
  // }
  // addRoute(data: IPtRelationNew): any {
  //     return this.db.PtRoutes.put(data).then(() => {
  //       console.log('(data s.) Added route with id ' + data.id + ' to idb');
  //     });
  // }
  //
  // addWay(data: IPtWay): any {
  //    return this.db.PtWays.put(data).then(() => {
  //       console.log('(data s.) Added way with id ' + data.id + ' to idb');
  //     });
  // }

  addRouteMaster(data: IPtRouteMasterNew): any {
      return this.db.PtRouteMasters.put(data).then(() => {
        console.log('(data s.) Added route master with id ' + data.id + ' to idb');
      });
  }
  addToCompletelyDownloadedStops(stopId: number): any {
    return this.db.CompletelyDownloadedStops.put({ id: stopId });
  }
  addToCompletelyDownloadedPlatforms(platformId: number): any {
    return this.db.CompletelyDownloadedPlatforms.put({ id: platformId });
  }
  addToCompletelyDownloadedRoutes(routeId: number): any {
    return this.db.CompletelyDownloadedRoutes.put({ id: routeId });
  }
  addToRoutesForStop(routesarray: any, stopId: number): any {
    // // FIXME
    // let stop = stopId.toString();
    // let routeIdsArray = [];
    // // routeIdsArray.push(routeId);
    // // let obj = { routeIds: routeIdsArray };
    // // console.log(obj);
    // return this.db.RoutesForStops.get(stopId.toString()).then((data) => {
    //   if (typeof data === 'undefined') {
    //     console.log('value of data');
    //     console.log(data);
    //     this.db.RoutesForStops.add(routesarray, stopId.toString())
    //       .then((id) => {
    //       console.log('Added the first route with id' + 'for a stop with id' + stopId +
    //         'in RoutesForStop table in IDB');
    //       return Promise.resolve(stopId);
    //     }).catch((err) => {
    //       console.log('Error in adding the first route with id' + 'for a stop with id' + stopId +
    //         'in RoutesForStop table in IDB');
    //       console.log(err);
    //       // throw err;
    //     });
    //   } else {
    //     console.log('more need to be Added');
    //      this.db.RoutesForStops.where('id').equals(stopId).modify((stopRoutes) => {
    //      stopRoutes = stopRoutes.concat(routesarray);
    //     }).then(() => {
    //       console.log('Added one more route with id' +'for a stop with id' + stopId +
    //         'in RoutesForStop table in IDB');
    //     }).catch((err) => {
    //       console.log('Error in adding one more route with id' +  'for a stop with id' + stopId +
    //         'in RoutesForStop table in IDB');
    //       console.log(err);
    //       // throw err;
    //     });
    //   }
    //   });


    // return  this.db.RoutesForStops.add(routesarray, stopId.toString())
      // .then((id) => {
      //   console.log('Added the first route with id' + stopId +  'for a stop with id' + stopId +
      //     'in RoutesForStop table in IDB');
      // });

    return  this.db.RoutesForStops.add(routesarray, stopId.toString());
  }
  addToRoutesForPlatform(routesarray: any, platformId: number): any {
    // FIXME
    // let platform = platformId.toString();
    // let routeIdsArray = [];
    // routeIdsArray.push(routeId);
    // let obj = { routeIds: routeIdsArray };
    // console.log(obj);
    // return this.db.RoutesForPlatforms.get(platformId.toString()).then((data) => {
      // if (typeof data === 'undefined') {
      //   console.log('value of data');
      //   console.log(data);
    // return  this.db.RoutesForPlatforms.add(routesarray, platformId.toString())
          // .then((id) => {
          //   console.log('Added the first route with id' + 'for a platform with id' + platformId +
          //     'in RoutesForPlatform table in IDB');
          //   // return Promise.resolve(platformId);
          // });
        // .catch((err) => {
        //   console.log('Error in adding the first route with id' + 'for a platform with id' + platformId +
        //     'in RoutesForStop table in IDB');
        //   console.log(err);
        //   // throw err;
        // });
      // } else {
      //   console.log('more need to be Added');
      //   this.db.RoutesForStops.where('id').equals(platformId).modify((platformRoutes) => {
      //     platformRoutes = platformRoutes.concat(routesarray);
      //   }).then(() => {
      //     console.log('Added one more route with id' + 'for a platform with id' + platformId +
      //       'in RoutesForStop table in IDB');
      //   }).catch((err) => {
      //     console.log('Error in adding one more route with id' +  'for a platform with id' + platformId +
      //       'in RoutesForPlatform table in IDB');
      //     console.log(err);
      //     // throw err;
      //   });
      // }
    // });
    return  this.db.RoutesForPlatforms.add(routesarray, platformId.toString());

  }

  getRoutesForStop(stopId: number): any {
    return this.db.transaction('rw', this.db.RoutesForStops, this.db.PtRoutes, () => {
      let filteredRoutes = [];
      return this.db.RoutesForStops.get(stopId.toString()).then((data) => {
        if (data) {
          let routeIds = data;
          return this.db.PtRoutes.each((route) => {
            if (routeIds.includes(route.id)) {
              filteredRoutes.push(route);
            }
          }).then(() => {
            console.log('this is what i got after filtering');
            console.log(filteredRoutes);
            return Promise.resolve(filteredRoutes);
          });
        } else {
          return Promise.resolve(filteredRoutes);
        }
      });
    });
  }
  getRoutesForPlatform(platformId: number): any {
    return this.db.transaction('rw', this.db.RoutesForPlatforms, this.db.PtRoutes, () => {
      let filteredRoutes = [];
      return this.db.RoutesForPlatforms.get(platformId.toString()).then((data) => {
        if (data) {
        let routeIds = data;
        return this.db.PtRoutes.each((route) => {
          if (routeIds.includes(route.id)) {
            filteredRoutes.push(route);
          }
        }).then(() => {
          return Promise.resolve(filteredRoutes);
        });
        } else {
          return Promise.resolve(filteredRoutes);
        }
      });
    });
  }

  public addResponseToIDB(response: any, id: any, type: string): any {
    let routeIds = [];
    let routes = [];
    let platforms = [];
    let stops = [];
    let routeMasters = [];
    let ways = [];
    for (let i = 0 ; i < response.elements.length; i++) {
          let element = response.elements[i];
          if ((!this.storageSrv.stopsIDB.has(element.id)) &&
        (!this.storageSrv.waysIDB.has(element.id))
        && (!this.storageSrv.routeMastersIDB.has(element.id)) &&
        (!this.storageSrv.routesIDB.has(element.id))
      ) {
          switch (element.type) {
          case 'node':
            if (element.tags.public_transport === 'platform') {
              platforms.push(element);
            }
            if (element.tags.bus === 'yes' || element.tags.public_transport === 'stop_position') {
              stops.push(element);
            }
            break;
          case 'relation':
            if (element.tags.type === 'route') {
              routes.push(element);
              if (type === 'stop_position') {
                routeIds.push(element.id);
              }
              if (type === 'platform') {
                routeIds.push(element.id);
              }
            }
            if (element.tags.type === 'route_master') {
              routeMasters.push(element);
            }
            break;
          case 'way':
            ways.push(element);
            break;
        }
      }
    }
    return this.db.transaction('rw', [this.db.RoutesForPlatforms, this.db.PtRoutes, this.db.PtStops,
      this.db.PtPlatforms, this.db.PtWays, this.db.RoutesForStops, this.db.PtRouteMasters,
      this.db.CompletelyDownloadedStops, this.db.CompletelyDownloadedPlatforms,
      this.db.CompletelyDownloadedRoutes], () => {

      if (platforms.length !== 0) {
        this.db.PtPlatforms.bulkPut(platforms).then(() => {
         console.log('Added platforms : ' + platforms.map((platform) => {return platform.id;
         }).join(',') + ' to IDB for overpass API \'s response of :' + id);
        }).catch((err) => {
          console.log('error in adding platforms to idb');
          console.log(err);
          throw err;
        });
      }
      if (stops.length !== 0) {
        this.db.PtStops.bulkPut(stops).then(() => {
          console.log('Added stops : ' + stops.map((stop) => {return stop.id;
          }).join(',') + ' to IDB for overpass API \'s response of :' + id);
        }).catch((err) => {
          console.log('error in adding stops to idb');
          console.log(err);
          throw err;
        });
      }
      if (ways.length !== 0) {
        this.db.PtWays.bulkPut(ways).then(() => {
          console.log('Added ways : ' + ways.map((way) => {return way.id;
          }).join(',') + ' to IDB for overpass API \'s response of :' + id);
        }).catch((err) => {
          console.log('error in adding ways to idb');
          console.log(err);
          throw err;
        });
      }
      if (routeMasters.length !== 0) {
        this.db.PtRouteMasters.bulkPut(routeMasters).then(() => {
          console.log('Added route masters : ' + routeMasters.map((routeMaster) => {return routeMaster.id;
          }).join(',') + ' to IDB for overpass API \'s response of :' + id);
        }).catch((err) => {
          console.log('error in adding route masters to idb');
          console.log(err);
          throw err;
        });
      }
      if (routes.length !== 0) {
        this.db.PtRoutes.bulkPut(routes).then(() => {
          console.log('Added routes : ' + routes.map((route) => {return route.id;
          }).join(',') + ' to IDB for overpass API \'s response of :' + id);
        }).catch((err) => {
          console.log('error in adding routes to idb');
          console.log(err);
          throw err;
        });
      }

    }).then(() => {
      if (type === 'stop_position') {
        if (routeIds.length !== 0) {
          this.addToRoutesForStop(routeIds, id).then((stopId) => {
            console.log('Added routeIds : ' + routeIds.map((routeId) => {
              return routeId; })
              .join(',') + ' for stop' + stopId + 'to IDB for overpass API \'s response of :' + id);
          }).catch((err) => {
            console.log('Could not add routeIds : ' + routeIds.map((routeId) => {
              return routeId; })
              .join(',') + ' for stop' + id + 'to IDB for overpass API \'s response of :' + id);
            console.log(err);
          });
        }
        this.storageSrv.completelyDownloadedStopsIDB.add(id);
        this.addToCompletelyDownloadedStops(id).then(() => {
          console.log('Added stop with id : ' + id + ' to completely downloaded stops in' +
            ' IDB for overpass API \'s response of :' + id);
        }).catch((err) => {
          console.log('Could not add stop with id : ' + id + 'to completely downloaded stops ' +
            'in IDB for overpass API \'s response of :' + id);
          console.log(err);
        });
      }
      if (type === 'platform') {
        if (routeIds.length !== 0) {
          this.addToRoutesForPlatform(routeIds, id).then((platformId) => {
            console.log('Added routeIds : ' + routeIds.map((routeId) => {
              return routeId; })
              .join(',') + ' for platform' + platformId + 'to IDB for ' +
              'overpass API \'s response of :' + id);
          }).catch((err) => {
            console.log('Could not add routeIds for platform to IDB ' +
              'for overpass API \'s response of :' + id);
            console.log(err);
          });
        }
        this.storageSrv.completelyDownloadedPlatformsIDB.add(id);
        this.addToCompletelyDownloadedPlatforms(id).then(() => {
          console.log('Added platform with id : ' + id + ' to completely downloaded platforms in IDB ' +
            'for overpass API \'s response of : ' + id);
        }).catch((err) => {
          console.log('Could not add platform with id : ' + id + ' to completely downloaded platforms ' +
            'in IDB for overpass API \'s response of :' + id);
          console.log(err);
        });
      }
      if (type === 'route') {
        this.storageSrv.completelyDownloadedRoutesIDB.add(id);
        this.addToCompletelyDownloadedRoutes(id).then(() => {
          console.log('Added route with id :' + id + ' to completely downloaded routes in' +
            ' IDB for overpass API \'s response of :' + id);
        }).catch((err) => {
          console.log('Could not add route with id : ' + id + ' to completely downloaded routes in IDB' +
            ' for overpass API \'s response of' + id);
          console.log(err);
        });
      }
    }).catch((err) => {
      console.log('Could not complete transaction successfully for addition of overpass API \'s response of' + id +
      ', All previous additions for this transaction will be rolled back');
      console.log(err);
    });
}

  getMembersForRoute(relId: number): any {
    return this.db.transaction('rw', this.db.PtStops, this.db.PtRoutes, () => {
      let memberIds = [];
      let stops = [];
      let platforms = [];
      return this.db.PtRoutes.get(relId.toString()).then((route) => {
      for (let member in route.members) {

        if (route.members.hasOwnProperty(member)) {
          memberIds.push(member['ref']);
        }
      }
      return this.db.transaction('rw', this.db.PtStops, this.db.PtRoutes, () => {
       this.db.PtStops.each((stop) => {

         if (memberIds.includes(stop.id)) {
                     stops.push(stop);
                  }
                });
       this.db.PtPlatforms.each((platform) => {

         if (memberIds.includes(platform.id)) {
                       platforms.push(platform);
                     }
                   });
              }).then(() => {
                Promise.resolve(stops.concat(platforms));
      });
     });
    });
  }
  // // push route id to the routes array of a given stop
  // addtoRoutesofStop(stopId: number, routeId: number): any {
  //   return this.db.transaction('rw', this.db.Stops, () => {
  //     return this.db.Stops.where('id').equals(stopid).modify((x) => {
  //       x.routes.push(routeid);
  //     });
  //   });
  // }
  // getStopsForRoute(routeid: number): any {
  //   return this.db.transaction('rw', this.db.Stops, this.db.Routes, () => {
  //     let nodemembers = [];
  //     let stops = [];
  //     return this.db.Routes.get({ id: routeid }).then((route) => {
  //       nodemembers = route['nodemembers'];
  //     }).then(() => {
  //       return this.db.Stops.each((stop) => {
  //         if (nodemembers.includes(stop.id)) {
  //           stops.push(stop);
  //         }
  //       }).then(() => {
  //         return Promise.resolve(stops);
  //       });
  //     });
  //   });
  // }

  // // gets route relations for a given node id
  // getRoutesforNode(stopid: number): any {
  //   return this.db.transaction('rw', this.db.Stops, this.db.Routes, () => {
  //     return this.db.Stops.get({ id: stopid }).then((stop) => {
  //       let arrayofroutes = stop.routes; // contains only ids
  //       let filteredroutes = [];
  //       return this.db.Routes.each((route) => {
  //         if (arrayofroutes.includes(route.id)) {
  //           filteredroutes.push(route);
  //         }
  //       }).then(() => {
  //         return Promise.resolve(filteredroutes);
  //       });
  //     });
  //   });
  // }
  // // downloaded elements
  // addToDownloadedRoutes(relId: number): any {
  //   return this.db.DownloadedRoutes.put({ id: relId });
  // }
  //
  // addToDownloadedStops(stopId: number): any {
  //   return this.db.DownloadedStops.put({ id: stopId });
  // }
}
