import { EventEmitter, TemplateRef } from '@angular/core';

export type IDropdownComponent = {
  readonly templateRef: TemplateRef<unknown>;
  readonly closed: EventEmitter<void>;
};
