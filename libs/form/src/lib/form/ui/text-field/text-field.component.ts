import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseFieldComponent } from '../base-field.component';

@Component({
  selector: 'atlas-form-field-text',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextFieldComponent<TSchema> extends BaseFieldComponent<TSchema, string> {}
