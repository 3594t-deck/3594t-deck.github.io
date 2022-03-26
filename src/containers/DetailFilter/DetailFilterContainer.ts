import type {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
} from 'react-redux';
import { connect } from 'react-redux';
import type {
  FilterContents,
  SearchMode,
  FilterSelectionMode,
} from '3594t-deck';
import { setDetailConditionAdapter } from '../Common/setConditionAdapter';
import { toggleDetailCheckList } from '../Common/toggleCheckList';
import getSearchMode from '../Common/getSearchMode';
import type {
  DetailFilterCondition,
  DetailFilterConditionKey,
} from '../../modules/datalist';
import type { State } from '../../store';
import type { StateFromProps, DispatchFromProps, Props } from './DetailFilter';
import DetailFilter from './DetailFilter';

interface ContainerStateFromProps {
  searchMode: SearchMode;
  filterSelectionMode: FilterSelectionMode;
  filterCondition: DetailFilterCondition;
  filterContents: FilterContents;
}

type ContainerDispatchFromProps = Omit<DispatchFromProps, 'toggleCheckList'>;

type OwnProps = {};

type TMapStateToProps = MapStateToProps<
  ContainerStateFromProps,
  OwnProps,
  State
>;
type TMapDispatchToProps = MapDispatchToProps<
  ContainerDispatchFromProps,
  OwnProps
>;
type TMergeProps = MergeProps<
  ContainerStateFromProps,
  ContainerDispatchFromProps,
  OwnProps,
  Props
>;

const mapStateToProps: TMapStateToProps = (state) => ({
  searchMode: getSearchMode(state.deck, state.datalist.filterCondition),
  filterSelectionMode: state.datalist.filterSelectionMode,
  filterCondition: state.datalist.filterCondition.detail,
  filterContents: state.datalist.filterContents,
});

const mapDispatchToProps: TMapDispatchToProps = (dispatch) => ({
  setCondition: setDetailConditionAdapter(dispatch),
});

const mergeProps: TMergeProps = (state, actions) => {
  const { searchMode, filterSelectionMode, filterCondition, filterContents } =
    state;
  const sProps: StateFromProps = {
    searchMode,
    filterCondition,
    filterContents,
  };
  return {
    ...sProps,
    ...actions,
    toggleCheckList: (key: DetailFilterConditionKey, value: string) => {
      actions.setCondition(
        toggleDetailCheckList(filterSelectionMode, state, key, value)
      );
    },
  };
};

export default connect<
  StateFromProps,
  ContainerDispatchFromProps,
  OwnProps,
  Props
>(mapStateToProps, mapDispatchToProps, mergeProps, {
  areMergedPropsEqual: () => false,
})(DetailFilter);
