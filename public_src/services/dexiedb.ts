import Dexie from 'dexie';
import { IPtStopDB } from '../core/ptStopDB.interface';
import { IPtRelationDB } from '../core/ptRelationDB.interface';
import { IPtRouteMasterNew } from '../core/ptRouteMasterNew.interface';
import { IPtWay } from '../core/ptWay.interface';
import { IDownloadedRoutes } from '../core/downloadedRoutesIDB';
import { IDownloadedStops } from '../core/downloadedStopsIDB';


export class Db extends Dexie {
  Stops: Dexie.Table<IPtStopDB, string>;
  Routes: Dexie.Table<IPtRelationDB, string>;
  RouteMasters: Dexie.Table<IPtRouteMasterNew, string>;
  Ways: Dexie.Table<IPtWay, string>;
  DownloadedStops: Dexie.Table<IDownloadedStops, string>;
  DownloadedRoutes: Dexie.Table<IDownloadedRoutes, string>;
  constructor() {
    super('Database');
    this.version(1).stores({
      Stops: 'id',
      Routes: 'id,*stopmembers',
      RouteMasters: 'id',
      Ways: 'id',
      DownloadedRoutes : 'id',
      DownloadedStops : 'id',
    });
  }
}
