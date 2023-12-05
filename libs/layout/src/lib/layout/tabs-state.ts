import { EntityState } from '@datorama/akita';

export type TabState = {
  name: string;
  id: string;
  content: string;
};

export type TabsState = EntityState<TabState, string> & {
  active: string | undefined;
};

export const initialState = (): TabsState => ({
  active: undefined,
});
