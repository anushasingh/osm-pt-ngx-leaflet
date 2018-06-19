import { IOsmElement } from '../../core/osmElement.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SwitchLocationService } from '../../services/switch-location.service';
import { MapService } from '../../services/map.service';
import * as L from 'leaflet';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '../../store/model';

@Component({
  providers: [],
  selector: 'switch-location',
  styleUrls: [
    './switch-location.component.less',
    '../../styles/main.less',
  ],
  templateUrl: './switch-location.component.html',
})
export class SwitchLocationComponent  {
constructor(private switchlocationSrv: SwitchLocationService, mapSrv: MapService, private ngRedux: NgRedux<IAppState>,  private switchLocationSrv: SwitchLocationService) {
}
private nextLocation(): void {
this.switchlocationSrv.nextLocation();
}

private previousLocation(): void {
    this.switchlocationSrv.previousLocation();
  }
private toggleswitch(): void {
  this.switchLocationSrv.switchlocationModeOn();
  }
}
