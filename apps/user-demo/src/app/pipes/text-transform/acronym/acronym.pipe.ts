import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'acronym',
})
export class AcronymPipe implements PipeTransform {
  public transform(value: string): string {
    return (
      value
        // Split compound name (e.g `Big Name` => `['Big','Name']`)
        .split(' ')
        // Get the acronym from string
        .map(splittedValue => splittedValue.slice(0, 1))
        // Join the array into a string again
        .join('')
        .toUpperCase()
    );
  }
}
