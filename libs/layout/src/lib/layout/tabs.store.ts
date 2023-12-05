import { Injectable } from '@angular/core';
import { EntityStore, QueryEntity } from '@datorama/akita';
import { produce } from 'immer';
import { TabState, TabsState, initialState } from './tabs-state';

@Injectable()
export class TabsStore {
  public store!: EntityStore<TabsState, TabState, string>;
  public query!: QueryEntity<TabsState, TabState, string>;

  public init(name: string): void {
    this.store = new EntityStore<TabsState, TabState, string>(initialState(), { name: `tabs-${name}`, producerFn: produce, idKey: 'id' });
    this.query = new QueryEntity<TabsState, TabState, string>(this.store);
  }
}
