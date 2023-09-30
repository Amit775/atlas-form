import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseFieldComponent } from '../base-field.component';

@Component({
  selector: 'lib-number',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberComponent<TSchema> extends BaseFieldComponent<TSchema, number> {}
