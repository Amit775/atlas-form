import { CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { LayoutContainerComponent } from './layout-container/layout-container.component';
import { TabState } from './tabs-state';

@Component({
  selector: 'atlas-layout-root',
  standalone: true,
  imports: [CommonModule, LayoutContainerComponent, CdkDropListGroup, CdkDropList],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  @ViewChild(CdkDropListGroup) group!: CdkDropListGroup<CdkDropList<string>>;
  @ViewChild('window', { read: ViewContainerRef }) window!: ViewContainerRef;

  log(event: CdkDragDrop<string, string, TabState>): void {
	const index = this.group._items.size;
	console.log(this.window);
	const componentRef = this.window.createComponent(LayoutContainerComponent, { index: index - 3 });
	componentRef.setInput('lname', index);
    console.log(event);
  }
}
