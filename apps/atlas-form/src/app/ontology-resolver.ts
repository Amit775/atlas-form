import { Item } from './app.component';

export function resolveOntology(item: Item, ontology: string): unknown | undefined {
  switch (ontology) {
    case 'ID':
      return resolveId(item);
    default:
      return undefined;
  }
}

function resolveId(item: Item): string {
  return JSON.stringify(item);
}
