import { Action, AnyAction } from 'redux';
import { IAppState, IRootAppState } from '../model';
import { AppActions } from './actions';

export const INITIAL_STATE: IAppState = {
  editing: false,
  selectObject: null,
  selectedObjectRoutes: [],
  cancelSelectElement: false,
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
        selectedObjectRoutes : [],
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
    case AppActions.GET_NODE_RELATIONS:
      return {
        ...state,
        selectedObjectRoutes : [...state.selectedObjectRoutes, action.payload.relation],
   };
    case AppActions.CANCEL_SELECT_ELEMENT:
      return {
        ...state,
        cancelSelectElement : true,
      };
       default:
  // We don't care about any other actions right now.
  return state;
}
}
