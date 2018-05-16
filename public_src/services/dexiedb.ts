import Dexie from 'dexie';
import { IPtStop } from '../core/ptStop.interface';
import { IPtRelationNew } from '../core/ptRelationNew.interface';
import { IPtRouteMasterNew } from '../core/ptRouteMasterNew.interface';
import { IPtWay } from '../core/ptWay.interface';

export class Db extends Dexie {
  Stops: Dexie.Table<IPtStop, string>;
  Routes: Dexie.Table<IPtRelationNew, string>;
  RouteMasters: Dexie.Table<IPtRouteMasterNew, string>;
  Ways: Dexie.Table<IPtWay, string>;
  constructor() {
    super('Database');
    this.version(1).stores({
      Stops: 'id,type',
      Routes: 'id',
      RouteMasters: 'id',
      Ways: 'id',
    });
  }
}
