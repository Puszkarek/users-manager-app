import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'acronym',
})
export class AcronymPipe implements PipeTransform {
  /**
   * Create an acronym with the given value (e.g: `Big Name` will becomes `BN`)
   *
   * @param value - The name to transform
   * @returns An parsed name
   */
  public transform(value: string): string {
    return (
      value
        // Split compound name (e.g: `Big Name` => `['Big','Name']`)
        .split(' ')
        // Get the acronym from string
        .map(splittedValue => splittedValue.slice(0, 1))
        // Join the array into a string again
        .join('')
        .toUpperCase()
    );
  }
}
