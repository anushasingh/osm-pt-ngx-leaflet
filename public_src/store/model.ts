// Initial state is the place you define all initial values for the Redux store of the feature.
// In the 'standard' way, initialState is defined in reducers: http://redux.js.org/docs/basics/Reducers.html

import {IPtMember} from '../core/ptMember';

export interface IRootAppState {
  // app: IAppState;
  routes?: any;
}
export interface IAppState {
  editing: boolean;
  selectObject: {
    type: string;
    id: number;
    timestamp: string;
    version: number;
    changeset: number;
    user: string;
    uid: number;
    tags: {};
  };
  selectedObjectRoutes: object[];
  cancelSelectElement: boolean;
}
