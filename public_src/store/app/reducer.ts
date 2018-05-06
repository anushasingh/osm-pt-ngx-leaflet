import { Action, AnyAction } from 'redux';
import { IAppState, IRootAppState } from '../model';
import { AppActions } from './actions';

export const INITIAL_STATE: IAppState = {
  editing: false,
  selectObject: null,
  listOfStopsForRoute: [],
  cancelSelectElement: false,
  listofStops: [],
  listofRelations: [],
  listOfMasters: [],
  listOfVariants: [],
  listOfRelationsForStop: [],
};

export function appReducer(state: IAppState = INITIAL_STATE, action: AnyAction): any {
  switch (action.type) {
    case AppActions.TOGGLE_EDITING:
      return {
        ...state,
        editing: !state.editing,
      };
    case AppActions.SELECT_ELEMENT:
      return {
        ...state,
        selectObject: action.payload,
        listOfStopsForRoute : [],
      };

    case AppActions.EDIT_TAGVALUE:
      return {
        ...state,
        selectObject: {
          ...state.selectObject,
          tags: {
            ...state.selectObject.tags,
            [action.payload.key] : action.payload.newValue},
        },
      };

    case AppActions.EDIT_TAGKEY:
      let renameProp = (
        oldProp,
        newProp,
        { [oldProp]: old, ...others },
      ) => ({
        [newProp]: old,
        ...others,
      });
      let newTags = renameProp(action.payload.oldvaluea , action.payload.newvaluea, state.selectObject.tags);

      return {
        ...state,
        selectObject: {
          ...state.selectObject,
          tags: newTags,
         },
       };
      case AppActions.ADD_TAG:
        return{
          ...state,
          selectObject :
          {
        ...state.selectObject,
        tags: {
          ...state.selectObject.tags,
          [action.payload.newkey]: action.payload.newvalue,
         },
      },
    };
    case AppActions.REMOVE_TAG:
    let removeByKey = (myObj, deleteKey) => {
      return Object.keys(myObj)
        .filter((key) => key !== deleteKey)
        .reduce((result, current) => {
          result[current] = myObj[current];
          return result;
        }, {});
    };
    let afterRemoveTags = removeByKey(state.selectObject.tags, action.payload.key);
    return{
        ...state,
        selectObject :
          {
            ...state.selectObject,
            tags: afterRemoveTags,
          },
  };
    case AppActions.CREATE_LISTOFSTOPSFORROUTE:
      return {
        ...state,
        listOfStopsForRoute :  action.payload.relations,
   };
    case AppActions.CANCEL_SELECT_ELEMENT:
      return {
        ...state,
        cancelSelectElement : true,
        listOfStopsForRoute: null,
        selectedObject: null,
      };
    case AppActions.ADD_TO_LISTOFSTOPS:
      return {
        ...state,
        listofStops : [...state.listofStops.concat(action.payload.newStops)],
      };
    case AppActions.ADD_TO_LISTOFRELATIONS:
      return {
        ...state,
        listofRelations : [...state.listofRelations.concat(action.payload.newRelations)],
      };
    case AppActions.POP_LISTOFRELATIONS:
      return {
        ...state,
        listofRelations : [...state.listofRelations.slice(0, state.listofRelations.length - 2)],
      };
    case AppActions.ADD_TO_LISTOFMASTERS:
      return {
        ...state,
        listOfMasters : [...state.listOfMasters.concat(action.payload.newMasters)],
      };
    case AppActions.POP_LISTOFMASTERS:
      return {
        ...state,
        listOfMasters : [...state.listOfMasters.slice(0, state.listOfMasters.length - 2)],
      };
    case AppActions.CREATE_LISTOFVARIANTS:
      return {
        ...state,
        listOfVariants : action.payload.newVariants,
      };
    case AppActions.CREATE_LISTOFRELATIONSFORSTOP:
      return {
        ...state,
        listOfRelationsForStop : action.payload.newRelations,
      };
       default:
  // We don't care about any other actions right now.
  return state;
}
}
