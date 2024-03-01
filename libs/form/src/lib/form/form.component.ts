import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControlStatus, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldComponent } from './field/field.component';
import { FormAPI } from './form-api.service';
import { FormStore } from './form-store.service';
import { AtlasFormField, AtlasFormOptions } from './models';
import { AtlasFormReadyEvent } from './models/atlas-form-event';
import { AtlasFormControls, buildForm } from './utils/build-form';
import { toHashMap } from './utils/to-hash-map';

@Component({
  selector: 'atlas-form',
  standalone: true,
  imports: [CommonModule, FieldComponent, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [FormAPI],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent<TSchema> implements OnInit {
  private destroyRef = inject(DestroyRef);
  private service: FormAPI<TSchema> = inject(FormAPI);
  private store = inject(FormStore<TSchema>);
  private fb = inject(FormBuilder);

  public schema$ = this.service.query.selectAll();

  get form(): FormGroup<AtlasFormControls<TSchema>> {
    return this.service.form;
  }

  set form(form: FormGroup<AtlasFormControls<TSchema>>) {
    this.service.form = form;
  }

  @Input() set schema(fields: AtlasFormField<TSchema>[]) {
    this.store.set(toHashMap(fields, 'name'));
  }

  @Input() value!: TSchema;
  @Input() set options(value: AtlasFormOptions) {
    this.store.update((state) => {
      state.options = value;
    });
  }

  @Output() valueChange = new EventEmitter<TSchema>();
  @Output() statusChange = new EventEmitter<FormControlStatus>();
  @Output() ready = new EventEmitter<AtlasFormReadyEvent<TSchema>>();

  ngOnInit(): void {
    this.form = buildForm(this.service.query.getAll(), this.value);
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.valueChange.emit(value as TSchema));

    this.form.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((status) => this.statusChange.emit(status));

    this.ready.emit({ api: this.service });
  }

  fieldName(_: number, field: AtlasFormField<TSchema>): string {
    return field.name;
  }
}
