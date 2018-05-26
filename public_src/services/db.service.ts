import { Db } from '../database/dexiedb';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
@Injectable()
export class DbService {

  public db: Db;

  constructor(private storageSrv: StorageService) {
    this.db = new Db();
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
  getIdsQueriedRoutesForMaster(): any {
    return this.db.QueriedRoutesForMasters.toCollection().primaryKeys();
  }
  addRouteMasters(masterRoutes: any): any {
      return this.db.PtRouteMasters.bulkPut(masterRoutes).then(() => {
        console.log('(data s.) Added route masters with id ' + masterRoutes.map((masterRoute) => {
          return masterRoute.id;
        }).join(',') + ' to IDB');
      });
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
  addToQueriedRoutesforMasters(routeIds: Array<number>): any {
    return this.db.transaction('rw', this.db.QueriedRoutesForMasters, () => {
      routeIds.forEach((routeId) => {
        return this.db.QueriedRoutesForMasters.put({ id: routeId });
      });
    });
  }

  /**
   * Adds Overpass API 's response to IndexedDb
   * @param response
   * @param id
   * @param {string} type
   * @returns {any}
   */
  public addResponseToIDB(response: any, id: any, type: string): Promise<any> {
    let routeIds = [];
    let routes = [];
    let platforms = [];
    let stops = [];
    let routeMasters = [];
    let ways = [];
    for (let i = 0; i < response.elements.length; i++) {
      let element = response.elements[i];
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
    return this.db.transaction('rw', [this.db.RoutesForPlatforms, this.db.PtRoutes, this.db.PtStops,
      this.db.PtPlatforms, this.db.PtWays, this.db.RoutesForStops, this.db.PtRouteMasters,
      this.db.CompletelyDownloadedStops, this.db.CompletelyDownloadedPlatforms,
      this.db.CompletelyDownloadedRoutes], () => {
       if (platforms.length !== 0) {
        this.db.PtPlatforms.bulkPut(platforms).then(() => {
          console.log('LOG (db s.) Added platforms : [ ' + platforms.map((platform) => {
            return platform.id;
          }).join(',') + ' ] to IDB for Overpass API \'s response of :' + id);
        }).catch((err) => {
          console.log('LOG (db s.) Error in adding platforms to IDB');
          console.log(err);
          throw err;
        });
      }
       if (stops.length !== 0) {
        this.db.PtStops.bulkPut(stops).then(() => {
          console.log('LOG (db s.) Added stops : [ ' + stops.map((stop) => {
            return stop.id;
          }).join(',') + ' ] to IDB for overpass API \'s response of : ' + id);
        }).catch((err) => {
          console.log('LOG (db s.) Error in adding stops to IDB');
          console.log(err);
          throw err;
        });
      }
       if (ways.length !== 0) {
        this.db.PtWays.bulkPut(ways).then(() => {
          console.log('LOG (db s.) Added ways : [ ' + ways.map((way) => {
            return way.id;
          }).join(',') + ' ] to IDB for overpass API \'s Overpass API \'s response of : ' + id);
        }).catch((err) => {
          console.log('LOG (db s.) Error in adding ways to IDB');
          console.log(err);
          throw err;
        });
      }
       if (routeMasters.length !== 0) {
        this.db.PtRouteMasters.bulkPut(routeMasters).then(() => {
          console.log('LOG (db s.) Added route masters : [ ' + routeMasters.map((routeMaster) => {
            return routeMaster.id;
          }).join(',') + ' ] to IDB for overpass API \'s Overpass API \'s response of :' + id);
        }).catch((err) => {
          console.log('LOG (db s.) Error in adding route_masters to IDB');
          console.log(err);
          throw err;
        });
      }
       if (routes.length !== 0) {
        this.db.PtRoutes.bulkPut(routes).then(() => {
          console.log('LOG (db s.) Added routes : [ ' + routes.map((route) => {
            return route.id;
          }).join(',') + ' ] to IDB for Overpass API \'s response of :' + id);
        }).catch((err) => {
          console.log('LOG (db s.) Error in adding routes to IDB');
          console.log(err);
          throw err;
        });
      }

    }).then(() => {
      if (type === 'stop_position') {
        if (routeIds.length !== 0) {
          this.db.RoutesForStops.add(routeIds).then((stopId) => {
            console.log('LOG (db s.) Added routeIds : [ ' + routeIds.map((routeId) => {
              return routeId;
            })
              .join(',') + ' ] for stop with id :' + stopId + 'to IDB for overpass API \'s response of :' + id);
          }).catch((err) => {
            console.log('LOG (db s.) Error in adding routeIds : [ ' + routeIds.map((routeId) => {
              return routeId;
            })
              .join(',') + ' ] for stop with id : : ' + id + 'to IDB for overpass API \'s response of :' + id);
            /* transaction will not be aborted and previous operations will not be
            rolled back as error is caught */
            console.log(err);
          });
        }
        this.db.CompletelyDownloadedStops.put({ id }).then(() => {
          this.storageSrv.completelyDownloadedStopsIDB.add(id);
          console.log('LOG (db s.) Added stop with id : ' + id + ' to completely downloaded stops in' +
            ' IDB for overpass API \'s response of : ' + id);
        }).catch((err) => {
          console.log('LOG (db s.) Error in adding stop with id : ' + id + 'to completely downloaded stops ' +
            'in IDB for overpass API \'s response of :' + id);
          /* transaction will not be aborted and previous operations will not be
          rolled back as error is caught */
          console.log(err);
        });
      }
      if (type === 'platform') {
        if (routeIds.length !== 0) {
          this.db.RoutesForPlatforms.add(routeIds, id).then((platformId) => {
            console.log('LOG (db s.) Added routeIds : [ ' + routeIds.map((routeId) => {
                return routeId;
              })
                .join(',') + ' ] for platform with id : ' + platformId + 'to IDB for ' +
              'Overpass API \'s response of :' + id);
          }).catch((err) => {
            console.log('LOG (db s.) Error in adding routeIds for platform to IDB ' +
              'for overpass API \'s response of :' + id);
            /* transaction will not be aborted and previous operations will not be
            rolled back as error is caught */
            console.log(err);
          });
        }
        this.db.CompletelyDownloadedPlatforms.put({ id }).then(() => {
          this.storageSrv.completelyDownloadedPlatformsIDB.add(id);
          console.log('LOG (db s.) Added platform with id : ' + id + ' to completely downloaded platforms in IDB ' +
            'for overpass API \'s response of : ' + id);
        }).catch((err) => {
          console.log('LOG (db s.) Error in adding platform with id : ' + id + ' to completely downloaded platforms ' +
            'in IDB for overpass API \'s response of :' + id);
          /* transaction will not be aborted and previous operations will not be
          rolled back as error is caught */
          console.log(err);
        });
      }
      if (type === 'route') {
        this.db.CompletelyDownloadedRoutes.put({ id }).then(() => {
          this.storageSrv.completelyDownloadedRoutesIDB.add(id);
          console.log('LOG (db s.) Added route with id :' + id + ' to completely downloaded routes in' +
            ' IDB for overpass API \'s response of :' + id);
        }).catch((err) => {
          console.log('LOG (db s.) Error in adding route with id : ' + id + ' to completely downloaded routes in IDB' +
            ' for overpass API \'s response of' + id);
          /* transaction will not be aborted and previous operations will not be
          rolled back as error is caught */
          console.log(err);
        });
      }
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
      console.log(routesObject);
      return Promise.resolve(routesObject);
    });
  }

}
