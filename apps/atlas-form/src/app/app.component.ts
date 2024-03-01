import { Component } from '@angular/core';
import { AtlasFormField, AtlasFormReadyEvent, FormComponent } from '@atlas/form';
import * as jp from 'jsonpath';
import { resolveOntology } from './ontology-resolver';

export type Schema = {
  name: string;
  id: string;
  layer: string;
  workspace: string;
  property: number;
  extra?: number;
};

export type Item = {
  name: string;
  metadata: {
    layer: string;
    property: number;
  };
};

@Component({
  standalone: true,
  imports: [FormComponent],
  selector: 'atlas-form-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  schema: AtlasFormField<Schema>[] = [
    { ui: 'text', name: 'name', defaultValue: '', jsonPath: '$.name' },
    { ui: 'text', name: 'id', defaultValue: 'bublil', ontology: 'ID' },
    { ui: 'text', name: 'layer', defaultValue: '', jsonPath: '$.metadata.layer' },
    {
      ui: 'text',
      name: 'workspace',
      defaultValue: 'bublil',
      jsonPath: '$.metadata.workspace',
    },
    {
      ui: 'number',
      name: 'property',
      defaultValue: 17,
      validators: [{ type: 'max', max: 20 }],
      jsonPath: '$.metadata.property',
    },
  ];

  item: Item = {
    name: 'name',
    metadata: {
      layer: 'layer',
      property: 6,
    },
  };

  options = { isReadOnly: false };
  value = this.getData(this.item, this.schema);

  onReady({ api }: AtlasFormReadyEvent<Schema>): void {
    const extraField: AtlasFormField<Schema> = { name: 'extra', ui: 'number', defaultValue: 12 };
    api.form.controls.property.valueChanges.subscribe((value: number) => {
      value > 10 ? api.createControl(extraField, 5) : api.removeControl(extraField);
    });
  }

  getData(item: Item, schema: AtlasFormField<Schema>[]): Schema {
    return schema.reduce((result: Schema, field: AtlasFormField<Schema>) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: fix it
      result[field.name] = this.getFieldData(item, field);
      return result;
    }, {} as Schema);
  }

  getFieldData(item: Item, field: AtlasFormField<Schema>): unknown {
    if (field.jsonPath) return jp.query(item, field.jsonPath, 1)[0];
    if (field.ontology) return resolveOntology(item, field.ontology);

    return field.defaultValue;
  }

  onChange(value: Schema): void {
    console.log(value);
  }
}
