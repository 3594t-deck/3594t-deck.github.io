/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'redux-query-sync' {
  import { Store } from 'redux';
  // import { History } from 'history';
  import { TypeConstant, PayloadAction } from 'typesafe-actions';

  function ReduxQuerySync<S>(options: Options<S>): () => void;

  export interface ParamsOptions<S, V = any> {
    action: (value: V) => PayloadAction<TypeConstant, any>;
    selector: (state: S) => V;
    defaultValue?: V;
    valueToString?: (value: V) => string;
    stringToValue?: (q: string) => V;
  }

  interface Options<S> {
    store: Store<S>;
    params: { [key: string]: ParamsOptions<S> };
    initialTruth: 'location' | 'store';
    replaceState?: boolean;
    // history?: History;
  }

  export default ReduxQuerySync;
}
