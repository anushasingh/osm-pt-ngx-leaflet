// Initial state is the place you define all initial values for the Redux store of the feature.
// In the 'standard' way, initialState is defined in reducers: http://redux.js.org/docs/basics/Reducers.html

import {IPtMember} from '../core/ptMember';
import { IPtRelationNew } from '../core/ptRelationNew.interface';

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
  listOfStopsForRoute: object[];
  cancelSelectElement: boolean;
  listofStops: object[];
  listofRelations: object[];
  listOfRelationsForStop: object[];
}
