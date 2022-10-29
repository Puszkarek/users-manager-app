import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'acronym',
})
export class AcronymPipe implements PipeTransform {
  public transform(value: string): string {
    return value.slice(0, 1);
  }
}
