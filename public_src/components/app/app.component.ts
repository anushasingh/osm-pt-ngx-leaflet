import { Component, isDevMode, ViewChild } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { CarouselConfig, ModalDirective } from 'ngx-bootstrap';

import * as L from 'leaflet';

import { Observable } from 'rxjs/Observable';

import { EditService } from '../../services/edit.service';
import { GeocodeService } from '../../services/geocode.service';
import { LoadService } from '../../services/load.service';
import { MapService } from '../../services/map.service';
import { ProcessService } from '../../services/process.service';

import { AuthComponent } from '../auth/auth.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

import { IAppState } from '../../store/model';
import { AppActions } from '../../store/app/actions';
import { DataService } from '../../services/data.service';
import { StorageService } from '../../services/storage.service';

@Component({
  providers: [{ provide: CarouselConfig, useValue: { noPause: false } }],
  selector: 'app',
  styleUrls: [
    './app.component.less',
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  public advancedMode: boolean = Boolean(localStorage.getItem('advancedMode'));

  @ViewChild(ToolbarComponent) public toolbarComponent: ToolbarComponent;
  @ViewChild(AuthComponent) public authComponent: AuthComponent;
  @ViewChild('helpModal') public helpModal: ModalDirective;

  @select(['app', 'editing']) public readonly editing$: Observable<boolean>;

  constructor(
    public appActions: AppActions,
    private ngRedux: NgRedux<IAppState>,
    private editSrv: EditService,
    private geocodeSrv: GeocodeService,
    private loadSrv: LoadService,
    private mapSrv: MapService,
    private processSrv: ProcessService,
    private dataSrv: DataService,
    private storageSrv: StorageService,
  ) {
    if (isDevMode()) {
      console.log('WARNING: Ang. development mode is ', isDevMode());
    }
  }

  public ngOnInit(): any {
    this.dataSrv.db.Routes.orderBy('id').keys((keys) => {
      let routeSet = new Set(keys.map((item) => item));
      this.storageSrv.routesIDB = routeSet;
      console.log('(app comp.) ids of routes in IDB:');
      console.log(this.storageSrv.routesIDB);
    });
    this.dataSrv.db.RouteMasters.orderBy('id').keys((keys) => {
      let routemastersSet = new Set(keys.map((item) => item));
      this.storageSrv.routeMastersIDB = routemastersSet;
      console.log('(app comp.) ids of route masters in IDB:')
      console.log(this.storageSrv.routeMastersIDB);
    });
    this.dataSrv.db.Ways.orderBy('id').keys((keys) => {
      let waysSet = new Set(keys.map((item) => item));
      this.storageSrv.waysIDB = waysSet;
      console.log('(app comp.) ids of ways in IDB:');
      console.log(this.storageSrv.waysIDB);

    });
    this.dataSrv.db.Stops.orderBy('id').keys((keys) => {
      let stopsSet = new Set(keys.map((item) => item));
      this.storageSrv.stopsIDB = stopsSet;
      console.log('(app comp.) ids of stops in IDB:');
      console.log(this.storageSrv.stopsIDB);
    });
    this.dataSrv.db.DownloadedRoutes.orderBy('id').keys((keys) => {
      let DownloadedRoutesSet = new Set(keys.map((item) => item));
      this.storageSrv.completelyDownloadedRoutesIDB = DownloadedRoutesSet;
      console.log('(app comp.) ids of completely downloaded routes in IDB:');
      console.log(this.storageSrv.completelyDownloadedRoutesIDB);
    });
    this.dataSrv.db.DownloadedStops.orderBy('id').keys((keys) => {
      let DownloadedStopsSet = new Set(keys.map((item) => item));
      this.storageSrv.completelyDownloadedNodesIDB = DownloadedStopsSet;
      console.log('(app comp.) ids of completely downloaded stops in IDB:');
      console.log(this.storageSrv.completelyDownloadedNodesIDB);
    });

    const map = L.map('map', {
      center: L.latLng(49.686, 18.351),
      layers: [this.mapSrv.baseMaps.CartoDB_light],
      maxZoom: 22,
      minZoom: 4,
      zoom: 14,
      zoomAnimation: false,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);
    L.control.layers(this.mapSrv.baseMaps).addTo(map);
    L.control.scale().addTo(map);

    this.mapSrv.map = map;
    this.mapSrv.map.on('zoomend moveend', () => {
      this.processSrv.filterDataInBounds();
      this.processSrv.addPositionToUrlHash();
    });
    if (
      window.location.hash !== '' && this.processSrv.hashIsValidPosition()
    ) {
      this.mapSrv.zoomToHashedPosition();
    } else {
      this.geocodeSrv.getCurrentLocation();
    }
    this.toolbarComponent.Initialize();
  }

  public isLoading(): boolean {
    return this.loadSrv.isLoading();
  }

  public hideHelpModal(): void {
    this.helpModal.hide();
  }

  private showHelpModal(): void {
    this.helpModal.show();
  }
}
