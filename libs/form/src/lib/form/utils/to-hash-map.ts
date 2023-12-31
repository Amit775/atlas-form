import { HashMap } from '@datorama/akita';

export function toHashMap<T>(array: T[], key: keyof T): HashMap<T> {
  return array.reduce((result: HashMap<T>, item: T) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: fix it
    result[item[key]] = item;
    return result;
  }, {} as HashMap<T>);
}
