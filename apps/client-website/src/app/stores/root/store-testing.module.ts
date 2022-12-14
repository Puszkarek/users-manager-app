import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';
import { EntityStoreModule } from '@front/app/stores/root';
import { UsersStore } from '@front/app/stores/users';

@NgModule({
  imports: [HttpClientTestingModule, EntityStoreModule],
  providers: [UsersStore],
})
export class StoreTestingModule {}
