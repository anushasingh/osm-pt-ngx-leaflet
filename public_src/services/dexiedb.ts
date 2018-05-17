import Dexie from 'dexie';
import { IPtStopDB } from '../core/ptStopDB.interface';
import { IPtRelationDB } from '../core/ptRelationDB.interface';
import { IPtRouteMasterNew } from '../core/ptRouteMasterNew.interface';
import { IPtWay } from '../core/ptWay.interface';

export class Db extends Dexie {
  Stops: Dexie.Table<IPtStopDB, string>;
  Routes: Dexie.Table<IPtRelationDB, string>;
  RouteMasters: Dexie.Table<IPtRouteMasterNew, string>;
  Ways: Dexie.Table<IPtWay, string>;
  // StopsandRoutes: Dexie.Table<number, string>;
  constructor() {
    super('Database');
    this.version(1).stores({
      Stops: 'id',
      Routes: 'id,*stopmembers',
      RouteMasters: 'id',
      Ways: 'id',
      // StopsandRroutes:
    });
  }
}
