import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AcronymPipe } from './acronym';
import { ListPipe } from './list';

@NgModule({
  declarations: [ListPipe, AcronymPipe],
  exports: [ListPipe, AcronymPipe],
  imports: [CommonModule],
})
export class TextTransformPipesModule {}
