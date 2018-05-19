import { IOsmElement } from '../osmElement.interface';

export interface IPtStopIDB extends IOsmElement {
  lat: number;
  lon: number;
  routes: any;
}
