import { Dispatch } from 'redux';
import { SearchMode } from '3594t-deck';
import type {
  BasicFilterCondition,
  DetailFilterCondition,
  StrategiesFilterCondition,
} from '../../modules/datalist';
import { datalistActions } from '../../modules/datalist';

let handleId: NodeJS.Timeout;
const delayTime = 500;

export function setSearchModeAdapter(
  dispatch: Dispatch
): (searchMode: SearchMode) => void {
  return (searchMode: SearchMode): void => {
    dispatch(datalistActions.setSearchMode(searchMode));
    clearTimeout(handleId);
    handleId = setTimeout(() => {
      dispatch(datalistActions.applyCondition());
    }, delayTime);
  };
}

export function setBasicConditionAdapter(
  dispatch: Dispatch
): (condition: Partial<BasicFilterCondition>) => void {
  return (condition: Partial<BasicFilterCondition>): void => {
    dispatch(datalistActions.setBasicCondition(condition));
    clearTimeout(handleId);
    handleId = setTimeout(() => {
      dispatch(datalistActions.applyCondition());
    }, delayTime);
  };
}

export function setDetailConditionAdapter(
  dispatch: Dispatch
): (condition: Partial<DetailFilterCondition>) => void {
  return (condition: Partial<DetailFilterCondition>): void => {
    dispatch(datalistActions.setDetailCondition(condition));
    clearTimeout(handleId);
    handleId = setTimeout(() => {
      dispatch(datalistActions.applyCondition());
    }, delayTime);
  };
}

export function setStrategiesFilterConditionAdapter(
  dispatch: Dispatch
): (condition: Partial<StrategiesFilterCondition>) => void {
  return (condition: Partial<StrategiesFilterCondition>): void => {
    dispatch(datalistActions.setStrategiesCondition(condition));
    clearTimeout(handleId);
    handleId = setTimeout(() => {
      dispatch(datalistActions.applyCondition());
    }, delayTime);
  };
}
