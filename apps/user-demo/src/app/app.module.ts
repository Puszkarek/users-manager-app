import { OverlayModule } from '@angular/cdk/overlay';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderModule } from '@front/app/components/header';
import { NavBarModule } from '@front/app/components/nav-bar';
import { TokenInterceptor } from '@front/app/interceptors/token';
import { EntityStoreModule } from '@front/app/stores/root';
import { environment } from '@front/environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HeaderModule,
    NavBarModule,
    ReactiveFormsModule,
    OverlayModule,
    // * NgRx/Data
    EntityStoreModule,
    EffectsModule.forRoot([]),
    StoreModule.forRoot({}, {}),
    StoreDevtoolsModule.instrument({
      logOnly: environment.production,
      maxAge: 25,
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
})
export class AppModule {}
