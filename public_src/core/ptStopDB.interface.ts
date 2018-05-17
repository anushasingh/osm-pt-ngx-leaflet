import { IOsmElement } from './osmElement.interface';

export interface IPtStopDB extends IOsmElement {
  lat: number;
  lon: number;
  routes: any;
}
