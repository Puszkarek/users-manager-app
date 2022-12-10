import { Pipe, PipeTransform } from '@angular/core';
import { capitalize, map } from 'lodash-es';

@Pipe({
  name: 'list',
})
export class ListPipe implements PipeTransform {
  /**
   * Parse a array into a readable string (e.g: `['1', '2']` becomes `1, 2`)
   *
   * @param value - The array to parse
   * @returns A list in text format
   */
  public transform(value: ReadonlyArray<string>): string {
    return map(value, capitalize).join(', ');
  }
}
