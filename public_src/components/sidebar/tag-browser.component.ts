import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';

import { Observable } from 'rxjs/Observable';

import { EditService } from '../../services/edit.service';
import { ProcessService } from '../../services/process.service';
import { StorageService } from '../../services/storage.service';

import { IOsmElement } from '../../core/osmElement.interface';

import { AppActions } from '../../store/app/actions';
import { IAppState } from '../../store/model';


@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [],
  selector: 'tag-browser',
  styleUrls: [
    './tag-browser.component.less',
    '../../styles/main.less',
  ],
  templateUrl: './tag-browser.component.html',
})
export class TagBrowserComponent implements OnInit, OnDestroy {
  @Input() public tagKey: string = '';
  @Input() public tagValue: string = '';
  public currentElement: IOsmElement;
  @select(['app', 'editing']) public readonly editing$: Observable<boolean>;
  public subscription;
  public expectedKeys = [
    'ascent',
    'bench',
    'building',
    'bus',
    'colour',
    'covered',
    'descent',
    'description',
    'distance',
    'highway',
    'layer',
    'level',
    'name',
    'network',
    'operator',
    'public_transport',
    'public_transport:version',
    'railway',
    'ref',
    'roundtrip',
    'route',
    'route_ref',
    'shelter',
    'surface',
    'symbol',
    'tactile_paving',
    'type',
    'uic_name',
    'uic_ref',
  ];
  public expectedValues = [
    'aerialway',
    'backward',
    'bus',
    'bus_stop',
    'coach',
    'ferry',
    'forward',
    'gate',
    'limited',
    'monorail',
    'no',
    'platform',
    'public_transport',
    'route',
    'route_master',
    'share_taxi',
    'station',
    'stop',
    'stop_area',
    'stop_position',
    'subway',
    'taxi',
    'train',
    'tram',
    'trolleybus',
    'yes',
  ];

  constructor(ngRedux: NgRedux<IAppState> , private cd: ChangeDetectorRef, private editSrv: EditService, private processSrv: ProcessService, private storageSrv: StorageService, private appActions: AppActions) {
    this.subscription = ngRedux.subscribe(() => {
      this.currentElement = ngRedux.getState()['app']['selectObject'];
    });
  }

  ngOnInit(): void {
    // this.processSrv.refreshSidebarViews$.subscribe((data) => {
    //   if (data === 'tag') {
    //     console.log(
    //       'LOG (tag-browser) Current selected element changed - ',
    //       data,
    //       this.currentElement,
    //       this.storageSrv.currentElement,
    //     );
    //     delete this.currentElement;
    //     this.currentElement = this.storageSrv.currentElement;
    //   } else if (data === 'cancel selection') {
    //     this.currentElement = undefined;
    //     delete this.currentElement;
    //   }
    // });
  }

  private checkUnchanged(change: any): boolean {
    return (
      change.from.key === change.to.key && change.from.value === change.to.value
    );
  }

  private createChange(type: string, key?: string, value?: string, event?: any): void {
    let change: object;
    if (type === 'change tag') {
      // handles changes from one of two input text areas
      switch (event.target['dataset'].type) {
        case 'key':
          change = {
            from: {
              key,
              value,
            },
            to: {
              key: event.target.value,
              value,
            },
          };
          if (this.checkUnchanged(change)) {
            return;
          }
          this.appActions.actEditTagKey({ oldvaluea: key, newvaluea: event.target.value });
          break;
        case 'value':
          change = {
            from: {
              key,
              value: this.currentElement.tags[key],
            },
            to: {
              key,
              value: event.target.value,
            },
          };
          if (this.checkUnchanged(change)) {
            return;
          }
          this.appActions.actEditTagValue({
            key,
            newValue: event.target.value });          // delete this.currentElement.tags[key];
          break;
        default:
          alert('form type not found');
      }
    } else if (type === 'add tag') {
      console.log(
        'LOG (tag-browser) Added tags are',
        key,
        this.currentElement.tags[key],
        ' for object: ',
        this.currentElement,
      );
      this.appActions.actAddTag({ newkey: this.tagKey, newvalue : this.tagValue});
      change = {
        key: this.tagKey,
        value: this.tagValue,
      };
      this.tagKey = this.tagValue = '';
    } else if (type === 'remove tag') {
      console.log(
        'LOG (tag-browser) Removed tags are', key, this.currentElement.tags[key],
        ' for object: ', this.currentElement);
      change = {
        key,
        value: this.currentElement.tags[key],
      };

      this.appActions.actRemoveTag({key});
    }

    this.editSrv.addChange(this.currentElement, type, change);
    this.cd.detectChanges();
    this.cd.markForCheck();
  }

  private updateKey(value: string): void {
    this.tagKey = value;
  }

  private toggleType(key: string): void {
    let change;
    if (Object.keys(this.currentElement.tags).indexOf(key) === -1) {
      this.currentElement.tags[key] = 'yes';
      change = { key, value: 'yes' };
      this.editSrv.addChange(this.currentElement, 'add tag', change);
    } else if (this.currentElement.tags[key] === 'yes') {
      change = { key, value: this.currentElement.tags[key] };
      delete this.currentElement.tags[key];
      delete this.storageSrv.currentElement['tags'][key];
      this.editSrv.addChange(this.currentElement, 'remove tag', change);
    } else {
      return alert(
        'Problem occured - unknown problem in toggle ' +
        JSON.stringify(this.currentElement),
      );
    }
  }

  private updateValue(value: string): void {
    this.tagValue = value;
  }

  private isUnchanged(): boolean {
    return !this.tagKey || !this.tagValue;
  }

  private keyChange($event: any): void {
    console.log('LOG (tag-browser)', $event);
  }

  private valueChange($event: any): void {
    console.log('LOG (tag-browser)', $event);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
