import { EventEmitter, TemplateRef } from '@angular/core';

export type DropdownPanel = {
  readonly templateRef: TemplateRef<unknown>;
  readonly closed: EventEmitter<void>;
};
