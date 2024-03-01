import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { guid, transaction } from '@datorama/akita';
import { Observable } from 'rxjs';
import { TabState } from '../tabs-state';
import { TabsStore } from '../tabs.store';

@Component({
  selector: 'atlas-layout-container',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatIconModule],
  templateUrl: './layout-container.component.html',
  styleUrls: ['./layout-container.component.scss'],
  providers: [TabsStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutContainerComponent implements OnInit {
  @Input({ required: true }) lname!: string;

  private _store = inject(TabsStore);
  public tabs$!: Observable<TabState[]>;
  public selectedTab$!: Observable<TabState | undefined>;

  ngOnInit(): void {
    this._store.init(this.lname);
    this.tabs$ = this._store.query.selectAll();
    this.selectedTab$ = this._store.query.selectActive();
  }

  @transaction()
  public addTab(): void {
    const count = this._store.query.getCount();
    const id = guid();
    this._store.store.add({ id, name: `Tab ${count} - ${this.lname}`, content: `Tab ${count} - ${this.lname} content` });
    this._store.store.setActive(id);
  }

  isActive(tab: TabState): boolean {
    return this._store.query.getActiveId() === tab.id;
  }

  setActive(tab: TabState): void {
    this._store.store.setActive(tab.id);
  }

  @transaction()
  closeTab(tab: TabState): void {
    this._store.store.remove(tab.id);
  }

  addOrMoveTab(event: CdkDragDrop<string, string, TabState>): void {
    console.log('list', event, this.lname);
    const { previousContainer, container } = event;
    const isNew = previousContainer.data !== container.data;
    if (isNew) {
      this._store.store.add(event.item.data);
    }

    const { previousIndex, currentIndex } = event;
    this._store.store.move(isNew ? this._store.query.getCount() - 1 : previousIndex, currentIndex);
  }

  removeTab(event: CdkDragDrop<string, string, TabState>): void {
    console.log('item', event, this.lname);

    const { previousContainer, container } = event;
    if (previousContainer.data !== container.data) {
      this._store.store.remove(event.item.data.id);
    }
  }

  id = (_: number, tab: TabState) => tab.id;
}
