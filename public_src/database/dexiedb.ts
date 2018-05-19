import Dexie from 'dexie';
import { IPtStopIDB } from '../core/IDBinterfaces/ptStopIDB.interface';
import { IPtRelationIDB } from '../core/IDBinterfaces/ptRelationIDB.interface';
import { IPtRouteMasterIDB } from '../core/IDBinterfaces/ptRouteMasterIDB.interface';
import { IPtWay } from '../core/ptWay.interface';
import { IDownloadedRoutes } from '../core/IDBinterfaces/downloadedRoutesIDB';
import { IDownloadedStops } from '../core/IDBinterfaces/downloadedStopsIDB';
export class Db extends Dexie {
  Stops: Dexie.Table<IPtStopIDB, string>;
  Routes: Dexie.Table<IPtRelationIDB, string>;
  RouteMasters: Dexie.Table<IPtRouteMasterIDB, string>;
  Ways: Dexie.Table<IPtWay, string>;
  DownloadedStops: Dexie.Table<IDownloadedStops, string>;
  DownloadedRoutes: Dexie.Table<IDownloadedRoutes, string>;
  constructor() {
    super('Database');
    this.version(1).stores({
      Stops: 'id',
      Routes: 'id',
      RouteMasters: 'id',
      Ways: 'id',
      DownloadedRoutes : 'id',
      DownloadedStops : 'id',
    });
  }
}
