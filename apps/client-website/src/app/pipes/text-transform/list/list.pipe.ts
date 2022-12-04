import { Pipe, PipeTransform } from '@angular/core';
import { capitalize, map } from 'lodash-es';

@Pipe({
  name: 'list',
})
export class ListPipe implements PipeTransform {
  public transform(value: ReadonlyArray<string>): string {
    return map(value, capitalize).join(', ');
  }
}
