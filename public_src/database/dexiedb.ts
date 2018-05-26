import Dexie from 'dexie';
import { IPtWay } from '../core/ptWay.interface';
import { IDownloadedRoutes } from '../core/IDBinterfaces/downloadedRoutesIDB';
import { IDownloadedStops } from '../core/IDBinterfaces/downloadedStopsIDB';
import { IPtStop } from '../core/ptStop.interface';
import { IPtRelationNew } from '../core/ptRelationNew.interface';
import { IPtRouteMasterNew } from '../core/ptRouteMasterNew.interface';
import { IRoutesForStopIDB } from '../core/IDBinterfaces/RoutesForStop';
export class Db extends Dexie {
  PtStops:  Dexie.Table<IPtStop, number>;
  PtPlatforms: Dexie.Table<IPtStop, number>;
  PtRoutes: Dexie.Table<IPtRelationNew, number>;
  PtRouteMasters: Dexie.Table<IPtRouteMasterNew, number>;
  PtWays: Dexie.Table<IPtWay, number>;
  CompletelyDownloadedStops: Dexie.Table<IDownloadedStops, number>;
  CompletelyDownloadedPlatforms: Dexie.Table<IDownloadedStops, number>;
  CompletelyDownloadedRoutes: Dexie.Table<IDownloadedRoutes, number>;
  RoutesForStops: Dexie.Table<IRoutesForStopIDB, number>;
  RoutesForPlatforms: Dexie.Table<IRoutesForStopIDB, number>;
  QueriedRoutesForMasters: Dexie.Table<IDownloadedStops, number>;
  constructor() {
    super('Database');
    this.version(1).stores({
      PtStops: 'id',
      PtPlatforms: 'id',
      PtRoutes: 'id',
      PtRouteMasters: 'id',
      PtWays: 'id',
      CompletelyDownloadedStops: 'id',
      CompletelyDownloadedPlatforms: 'id',
      CompletelyDownloadedRoutes: 'id',
      RoutesForPlatforms : '',
      RoutesForStops : '',
      QueriedRoutesForMasters: 'id',
    });
  }
}
