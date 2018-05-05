import {Component, isDevMode, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import { StorageService } from '../../services/storage.service';
import {OverpassService} from '../../services/overpass.service';

@Component({
  providers: [{ provide: CarouselConfig, useValue: { noPause: false } }],
  selector: 'app',
  styleUrls: [
    './app.component.less',
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  public advancedMode: boolean = Boolean(localStorage.getItem('advancedMode'));

  @ViewChild(ToolbarComponent) public toolbarComponent: ToolbarComponent;
  @ViewChild(AuthComponent) public authComponent: AuthComponent;
  @ViewChild('helpModal') public helpModal: ModalDirective;

  @select(['app', 'editing']) public readonly editing$: Observable<boolean>;
  public listofStops_subscription;
  public listofRelations_subscription;
  public listofStops;
  public listofRelations;
  constructor(
    private ngRedux: NgRedux<IAppState>,
    private editSrv: EditService,
    private geocodeSrv: GeocodeService,
    private loadSrv: LoadService,
    private mapSrv: MapService,
    private processSrv: ProcessService,
    private storageSrv: StorageService,
    private overpassSrv: OverpassService,

  ) {
    if (isDevMode()) {
      console.log('WARNING: Ang. development mode is ', isDevMode());
    }
    this.listofStops_subscription = ngRedux.subscribe(() => {
      this.listofStops = ngRedux.getState()['app']['listofStops'];
    });
    this.listofRelations_subscription = ngRedux.subscribe(() => {
      this.listofRelations = ngRedux.getState()['app']['listofRelations'];
    });

    this.mapSrv.markerClick.subscribe((data) => {
      const featureId = Number(data);

      if (this.storageSrv.elementsMap.has(featureId)) {
        this.processSrv.exploreStop(
          this.storageSrv.elementsMap.get(featureId),
          false,
          false,
          false,
          this.listofRelations,
        );
      }

      if (
        !this.storageSrv.elementsDownloaded.has(featureId) &&
        featureId > 0
      ) {
        console.log('LOG (overpass s.) Requesting started for ', featureId);
        this.overpassSrv.getNodeData(featureId,this.listofRelations);
        this.storageSrv.elementsDownloaded.add(featureId);
        console.log('LOG (overpass s.) Requesting finished for', featureId);
      }
    });
  }

  public ngOnInit(): any {
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
      this.processSrv.filterDataInBounds(this.listofStops);
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

  private changeMode(): void {
    localStorage.setItem('advancedMode', JSON.stringify(this.advancedMode));
  }
  ngOnDestroy(): void {
    this.listofStops_subscription.unsubscribe();
    this.listofRelations_subscription.unsubscribe();
  }
}
