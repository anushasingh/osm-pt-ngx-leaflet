import { Component, OnDestroy, OnInit } from '@angular/core';

import { EditService } from '../../services/edit.service';
import { MapService } from '../../services/map.service';
import { ProcessService } from '../../services/process.service';
import { StorageService } from '../../services/storage.service';
import { DragulaService } from 'ng2-dragula';

import { IPtRelation } from '../../core/ptRelation.interface';
import { IPtStop } from '../../core/ptStop.interface';

import { Observable } from 'rxjs/Observable';
// import { select } from '@angular-redux/store';
import { AppActions } from '../../store/app/actions';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../store/model';

@Component({
  providers: [],
  selector: 'stop-browser',
  styleUrls: [
    './stop-browser.component.less',
    '../../styles/main.less',
  ],
  templateUrl: './stop-browser.component.html',
})
export class StopBrowserComponent implements OnInit, OnDestroy {
  public listOfStopsForRoute;
  public currentElement: any;
  public filteredView: boolean;
  @select(['app', 'editing']) public readonly editing$: Observable<boolean>;
  public listOfStops;
  public listofRelations;
  public listOfRelationsForStop;
  public subscription;
  public selectedObject_subscription;
  public listofStops_subscription;
  public listOfStopsForRoute_subscription;
  public listOfRelationsForStop_subscription;
  constructor(
    private dragulaSrv: DragulaService,
    private editSrv: EditService,
    private mapSrv: MapService,
    private processSrv: ProcessService,
    private storageSrv: StorageService,
    private appActions: AppActions,
    ngRedux: NgRedux<IAppState>,
  ) {
    dragulaSrv.drop.subscribe((value) => {
      this.onDrop(value.slice(1));
    });
    this.subscription = ngRedux.subscribe(() => {
      this.listofRelations = ngRedux.getState()['app']['listofRelations'];
    });
    this.selectedObject_subscription = ngRedux.subscribe(() => {
      this.currentElement = ngRedux.getState()['app']['selectObject'];
    });
    this.listofStops_subscription = ngRedux.subscribe(() => {
      this.listOfStops = ngRedux.getState()['app']['listofStops'];
    });
    this.listOfStopsForRoute_subscription = ngRedux.subscribe(() => {
      this.listOfStopsForRoute = ngRedux.getState()['app']['listOfStopsForRoute'];
    });
    this.listOfRelationsForStop_subscription = ngRedux.subscribe(() => {
      this.listOfRelationsForStop = ngRedux.getState()['app']['listOfRelationsForStop'];
    });
  }

  ngOnInit(): void {
    this.processSrv.showStopsForRoute$.subscribe((data) => {
      this.filteredView = data;
    });
    //
    // this.processSrv.refreshSidebarViews$.subscribe((data) => {
    //   if (data === 'stop') {
    //     this.listOfStopsForRoute = this.storageSrv.listOfStopsForRoute;
    //     this.currentElement = this.storageSrv.currentElement;
    //     console.log(this.currentElement, this.listOfStopsForRoute);
    //   } else if (data === 'tag') {
    //     this.currentElement = this.storageSrv.currentElement;
    //   } else if (data === 'cancel selection') {
    //     this.listOfStopsForRoute = undefined;
    //     delete this.listOfStopsForRoute;
    //     this.currentElement = undefined;
    //     delete this.currentElement;
    //     this.filteredView = false;
    //   }
    // });
  }

  public reorderingEnabled(): boolean {
    if (this.currentElement) {
      return this.currentElement.type === 'relation' && this.filteredView;
    } else {
      return false;
    }
  }

  private isDownloaded(nodeId: number): boolean {
    return this.storageSrv.elementsDownloaded.has(nodeId);
  }

  private reorderMembers(rel: IPtRelation): void {
    this.editSrv.reorderMembers(rel);
  }

  private createChange(): void {
    const type = 'change members';
    let elementsWithoutRole = this.currentElement['members'].filter((member) => {
      return member['role'] === '';
    });
    let change = {
      from: JSON.parse(JSON.stringify(this.currentElement['members'])),
      to: JSON.parse(
        JSON.stringify([...this.listOfStopsForRoute, ...elementsWithoutRole]),
      ),
    };
    this.editSrv.addChange(this.currentElement, type, change);
  }

  private onDrop(args: any): void {
    if (this.currentElement.type !== 'relation') {
      return alert('Current element has incorrent type. Select relation one more time please.');
    }
    this.createChange();
  }

  private cancelFilter(): void {
    this.processSrv.activateFilteredStopView(false);
  }

  private exploreStop($event: any, stop: IPtStop): void {
    let listOfRelationsForStop = this.processSrv.filterRelationsByStop(stop, this.listofRelations);
    this.appActions.actCreateListOfRelationsForStop({ newRelations: listOfRelationsForStop });
    this.processSrv.exploreStop(stop, true, true, true, this.listOfRelationsForStop);
  }

  private isSelected(relId: number): boolean {
    return this.processSrv.haveSameIds(relId, this.currentElement.id);
  }

  /**
   * NgFor track function which helps to re-render rows faster.
   *
   * @param index
   * @param item
   * @returns {number}
   */
  private trackByFn(index: number, item: any): number {
    return item.id;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.selectedObject_subscription.unsubscribe();
    this.listofStops_subscription.unsubscribe();
    this.listOfStopsForRoute_subscription.unsubscribe();
    this.listOfRelationsForStop_subscription.unsubscribe();
  }
}
