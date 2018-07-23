import { IPtStop } from './ptStop.interface';

import * as L from 'leaflet';

export interface INameErrorObject {
  stop: IPtStop;
  corrected: string;
}

export interface IRefErrorObject {
  stop: IPtStop;
  corrected: string;
  totalConnectedRefs: number;
  missingConnectedRefs: number;
}

export interface IWayErrorObject {
  stop: IPtStop;
  corrected: string;
  wayIDs: number[];
}

export interface IPTPairErrorObject {
  stop: IPtStop;
  corrected: string;
}
