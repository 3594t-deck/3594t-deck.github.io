import type {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
} from 'react-redux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type {
  FilterContents,
  SearchMode,
  FilterSelectionMode,
} from '3594t-deck';
import { setStrategiesFilterConditionAdapter } from '../Common/setConditionAdapter';
import { toggleStrategyCheckList } from '../Common/toggleCheckList';
import getSearchMode from '../Common/getSearchMode';
import type {
  StrategiesFilterCondition,
  StrategiesFilterConditionKey,
} from '../../modules/datalist';
import { datalistActions } from '../../modules/datalist';
import type { State } from '../../store';
import type {
  StateFromProps,
  DispatchFromProps,
  Props,
} from './StrategyFilter';
import DetailFilter from './StrategyFilter';

interface ContainerStateFromProps {
  searchMode: SearchMode;
  filterSelectionMode: FilterSelectionMode;
  filterCondition: StrategiesFilterCondition;
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
  filterCondition: state.datalist.filterCondition.strategies,
  filterContents: state.datalist.filterContents,
});

const mapDispatchToProps: TMapDispatchToProps = (dispatch) => ({
  setCondition: setStrategiesFilterConditionAdapter(dispatch),
  ...bindActionCreators(
    {
      setShowStrategyExplanation: datalistActions.setShowStrategyExplanation,
    },
    dispatch
  ),
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
    toggleCheckList: (key: StrategiesFilterConditionKey, value: string) => {
      actions.setCondition(
        toggleStrategyCheckList(
          filterSelectionMode,
          state.filterCondition,
          key,
          value
        )
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
