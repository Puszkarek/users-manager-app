import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';
import { EntityStoreModule } from '@front/stores/root';
import { UsersStore } from '@front/stores/users/users.store';

const stores = [UsersStore];

@NgModule({
  imports: [HttpClientTestingModule, EntityStoreModule],
  providers: [...stores],
})
export class StoreTestingModule {}
