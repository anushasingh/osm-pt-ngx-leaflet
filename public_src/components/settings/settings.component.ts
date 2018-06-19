import { Component } from '@angular/core';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { AppActions } from '../../store/app/actions';
import {SwitchLocationService} from '../../services/switch-location.service';

@Component({
  selector: 'settings',
  styleUrls: ['./settings.component.less'],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  @select(['app', 'advancedExpMode']) public readonly advancedExpMode$: Observable<boolean>;
  @select(['app', 'goodConnectMode']) public readonly goodConnectMode$: Observable<boolean>;

  constructor(
    public appActions: AppActions,
    private switchLocationSrv: SwitchLocationService,
  ) {
    //
  }

  public changeConnMode(goodConnectMode: boolean): void {
    this.appActions.actSetGoodConnectMode(goodConnectMode);
    localStorage.setItem('goodConnectMode', JSON.stringify(goodConnectMode));
  }

  public changeExpMode(advancedExpMode: boolean): void {
    this.appActions.actSetAdvancedExpMode(advancedExpMode);
    localStorage.setItem('advancedMode', JSON.stringify(advancedExpMode));
  }
  private toggleSwitch() : void {
    this.switchLocationSrv.switchlocationModeOn();
  }
}
