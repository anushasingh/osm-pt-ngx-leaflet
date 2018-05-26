import { Db } from '../database/dexiedb';
import { IPtRouteMasterNew } from '../core/ptRouteMasterNew.interface';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
@Injectable()
export class DataService {

  public db: Db;

  constructor(private storageSrv: StorageService) {
    this.db = new Db();
  }
  // these are never used?
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

  addRouteMasters(masterRoutes: any): any {
      return this.db.PtRouteMasters.bulkPut(masterRoutes).then(() => {
        console.log('(data s.) Added route masters with id ' + masterRoutes.map((masterRoute) => {
          return masterRoute.id;
        }).join(',') + ' to IDB');
      });
  }

  addToCompletelyDownloadedStops(stopId: number): any {
    return this.db.CompletelyDownloadedStops.put({ id: stopId });
  }

  addToCompletelyDownloadedPlatforms(platformId: number): any {
    return this.db.CompletelyDownloadedPlatforms.put({ id: platformId });
  }

  addToCompletelyDownloadedRoutes(routeId: number): any {
    console.log('trying to add' + routeId);
    return this.db.CompletelyDownloadedRoutes.put({ id: routeId });
  }
  getRoutesForStop(stopId: number): any {
    return this.db.transaction('rw', this.db.RoutesForStops, this.db.PtRoutes, () => {
      let filteredRoutes = [];
      return this.db.RoutesForStops.get(stopId).then((data) => {
        if (data) {
          let routeIds = data;
          return this.db.PtRoutes.each((route) => {
            if (routeIds.includes(route.id)) {
              filteredRoutes.push(route);
            }
          }).then(() => {
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
      return this.db.RoutesForPlatforms.get(platformId).then((data) => {
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
    for (let i = 0; i < response.elements.length; i++) {
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
            if (element.tags.public_transport === 'stop_position') {
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
          console.log('Added platforms : ' + platforms.map((platform) => {
            return platform.id;
          }).join(',') + ' to IDB for overpass API \'s response of :' + id);
        }).catch((err) => {
          console.log('error in adding platforms to idb');
          console.log(err);
          throw err;
        });
      }
      if (stops.length !== 0) {
        this.db.PtStops.bulkPut(stops).then(() => {
          console.log('Added stops : ' + stops.map((stop) => {
            return stop.id;
          }).join(',') + ' to IDB for overpass API \'s response of :' + id);
        }).catch((err) => {
          console.log('error in adding stops to idb');
          console.log(err);
          throw err;
        });
      }
      if (ways.length !== 0) {
        this.db.PtWays.bulkPut(ways).then(() => {
          console.log('Added ways : ' + ways.map((way) => {
            return way.id;
          }).join(',') + ' to IDB for overpass API \'s response of :' + id);
        }).catch((err) => {
          console.log('error in adding ways to idb');
          console.log(err);
          throw err;
        });
      }
      if (routeMasters.length !== 0) {
        this.db.PtRouteMasters.bulkPut(routeMasters).then(() => {
          console.log('Added route masters : ' + routeMasters.map((routeMaster) => {
            return routeMaster.id;
          }).join(',') + ' to IDB for overpass API \'s response of :' + id);
        }).catch((err) => {
          console.log('error in adding route masters to idb');
          console.log(err);
          throw err;
        });
      }
      if (routes.length !== 0) {
        this.db.PtRoutes.bulkPut(routes).then(() => {
          console.log('Added routes : ' + routes.map((route) => {
            return route.id;
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
          this.db.RoutesForStops.add(routeIds, id).then((stopId) => {
            console.log('Added routeIds : ' + routeIds.map((routeId) => {
              return routeId;
            })
              .join(',') + ' for stop' + stopId + 'to IDB for overpass API \'s response of :' + id);
          }).catch((err) => {
            console.log('Could not add routeIds : ' + routeIds.map((routeId) => {
              return routeId;
            })
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
          this.db.RoutesForPlatforms.add(routeIds, id).then((platformId) => {
            console.log('Added routeIds : ' + routeIds.map((routeId) => {
                return routeId;
              })
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

  public getMembersForRoute(relId: number): any {
    return this.db.transaction('rw', this.db.PtStops, this.db.PtRoutes, this.db.PtPlatforms, () => {
      let memberIds = [];
      let stops = [];
      let platforms = [];
      return this.db.PtRoutes.get(relId).then((route) => {
        for (let member of route.members) {
          memberIds.push(member['ref']);
        }
        return this.db.transaction('rw', this.db.PtStops, this.db.PtRoutes, this.db.PtPlatforms, () => {
          this.db.PtStops.where('id').anyOf(memberIds).each((stop) => {
            stops.push(stop);
          }).then(() => {
            console.log('Matching stops from IDB : ' + stops.map((stop) => { return stop.id;
            }).join(' , '));
          });
          this.db.PtPlatforms.where('id').anyOf(memberIds).each((platform) => {
            platforms.push(platform);
          }).then(() => {
            console.log('Matching platforms from IDB : ' + platforms.map((platform) => { return platform.id;
            }).join(' , '));
          });
        }).then(() => {
          let object = {
            elements : stops.concat(platforms),
          };
          return Promise.resolve(object);
        });
      });
    });
  }
  getRoutesForMasterRoute(routeIds: Array<number>): any {
    let filteredMasters = [];
    return this.db.PtRouteMasters.each((routeMaster) => {
     routeMaster['members'].forEach((element) => {
       if (routeIds.includes(element['ref'])) {
        filteredMasters.push(routeMaster);
     }
     });
    }).then(() => {
      let routesObject = {
        elements: filteredMasters,
      };
      console.log('made routes object');
      console.log(routesObject);
      return Promise.resolve(routesObject);
    });
  }
  addToQueriedRoutesforMasters(routeIds: Array<number>): any {
    return this.db.transaction('rw', this.db.QueriedRoutesforMasters, () => {
      routeIds.forEach((routeId) => {
        return this.db.QueriedRoutesforMasters.put({ id: routeId });
      });
    });
  }
}
