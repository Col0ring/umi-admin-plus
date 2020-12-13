import { Action, AnyAction, Reducer } from 'redux';
import { EffectsMapObject, SubscriptionsMapObject, ReducerEnhancer } from 'dva';

type ReducerAction<T = any> = AnyAction &
  Partial<
    {
      [P in keyof T]: T[P];
    }
  >;

type ReducersMapObject<State, A extends Action = ReducerAction<State>> = {
  [key: string]: Reducer<State, A>;
};

type ReducersMapObjectWithEnhancer<State> = [
  ReducersMapObject<State>,
  ReducerEnhancer,
];

export interface Model<S = {}> {
  namespace: string;
  state?: S;
  reducers?: ReducersMapObject<S> | ReducersMapObjectWithEnhancer<S>;
  effects?: EffectsMapObject;
  subscriptions?: SubscriptionsMapObject;
}
