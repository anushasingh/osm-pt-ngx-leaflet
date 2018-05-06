import { Injectable } from '@angular/core';
import { dispatch, NgRedux } from '@angular-redux/store';
import { Action } from 'redux';
import { IAppState } from '../model';

@Injectable()
export class AppActions {
  constructor(
    private ngRedux: NgRedux<IAppState>,
  ) {
    //
  }

  static readonly TOGGLE_EDITING = 'TOGGLE_EDITING';
  static readonly SELECT_ELEMENT = 'SELECT_ELEMENT';
  static readonly EDIT_TAGKEY = 'EDIT_TAGKEY';
  static readonly EDIT_TAGVALUE = 'EDIT_TAGVALUE';
  static readonly ADD_TAG = 'ADD_TAG';
  static readonly REMOVE_TAG = 'REMOVE_TAG';
  static readonly UPDATE_LISTOFSTOPSFORROUTE = 'UPDATE_LISTOFSTOPSFORROUTE';
  static readonly CANCEL_SELECT_ELEMENT = 'CANCEL_SELECT_ELEMENT';
  static readonly ADD_TO_LISTOFSTOPS = 'ADD_TO_LISTOFSTOPS';
  static readonly ADD_TO_LISTOFRELATIONS = 'ADD_TO_LISTOFRELATIONS';
  static readonly ADD_TO_LISTOFRELATIONSFORSTOP = 'ADD_TO_LISTOFRELATIONSFORSTOP';
  // basic sync action
  public actToggleEditing = (): Action => {
    return this.ngRedux.dispatch({
      type: AppActions.TOGGLE_EDITING,
    });
  }

  // basic sync action
  public actSelectElement = (args): Action => {
    const { element } = args;
    return this.ngRedux.dispatch({
      type: AppActions.SELECT_ELEMENT,
      payload: element,
    });
  }
  public actEditTagKey = (args): Action => {
    const {oldvaluea, newvaluea} = args;
    return this.ngRedux.dispatch({
      type: AppActions.EDIT_TAGKEY,
      payload: {
        oldvaluea,
        newvaluea,
      },
    });
  }
  public actEditTagValue = (args): Action => {
    const {key, newValue} = args;
    return this.ngRedux.dispatch({
      type: AppActions.EDIT_TAGVALUE,
      payload: {
        key,
        newValue,
      },
    });
  }
  public actAddTag = (args): Action => {
    const {newkey, newvalue} = args;
    return this.ngRedux.dispatch({
      type: AppActions.ADD_TAG,
      payload: {
        newkey,
        newvalue,
      },
    });

  }
  public actRemoveTag = (args): Action => {
    const {key} = args;
    return this.ngRedux.dispatch({
      type: AppActions.REMOVE_TAG,
      payload: {
        key,
      },
    });
  }
  public actUpdateListofStopsforRoute = (args): Action => {
      const { relations } = args;
      return this.ngRedux.dispatch({
        type: AppActions.UPDATE_LISTOFSTOPSFORROUTE,
        payload: {
          relations,
        },
      });
  }
  public actCancelSelectElement = (): Action => {
    return this.ngRedux.dispatch({
      type: AppActions.CANCEL_SELECT_ELEMENT,
    });
  }
  public actAddToListOfStops = (args): Action => {
    console.log('ac add to list of stops');
    const { newStop } = args;
    return this.ngRedux.dispatch({
      type: AppActions.ADD_TO_LISTOFSTOPS,
      payload : {
        newStop,
      },
    });
  }
  public actAddToListOfRelations = (args): Action => {
    const { newRelation } = args;
    return this.ngRedux.dispatch({
      type: AppActions.ADD_TO_LISTOFRELATIONS,
      payload : {
        newRelation,
      },
    });
  }
  public actAddToListOfRelationsForStop = (args): Action => {
    const { newRelation } = args;
    return this.ngRedux.dispatch({
      type: AppActions.ADD_TO_LISTOFRELATIONSFORSTOP,
      payload : {
        newRelation,
      },
    });
  }
}
