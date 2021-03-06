import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material';
import { HotkeyModule } from 'angular2-hotkeys';
import { JwtModule } from '@auth0/angular-jwt';

import { AngularEditorModule } from '@kolkov/angular-editor';

import { NavComponent } from './angular-material-components/nav/nav.component';
import { AngularMaterialComponentsModule } from './angular-material-components/angular-material-components.module';
import { AppComponent } from './app.component';


import { DialogConfirm } from './angular-material-components/dialog-confirm.component';

import { ListEventsComponent } from './events/list-events/list-events.component';
import { AddEventComponent } from './events/add-event/add-event.component';
import { EditEventComponent } from './events/edit-event/edit-event.component';

import { ListCitiesComponent } from './cities/list-cities/list-cities.component';
import { AddCityComponent } from './cities/add-city/add-city.component';
import { EditCityComponent } from './cities/edit-city/edit-city.component';

import { ListOrgsComponent } from './orgs/list-orgs/list-orgs.component';
import { AddOrgComponent } from './orgs/add-org/add-org.component';
import { EditOrgComponent } from './orgs/edit-org/edit-org.component';

import { ListTagsComponent } from './tags/list-tags/list-tags.component';
import { AddTagComponent } from './tags/add-tag/add-tag.component';
import { EditTagComponent } from './tags/edit-tag/edit-tag.component';

import { ListRegionsComponent } from './regions/list-regions/list-regions.component';
import { AddRegionComponent } from './regions/add-region/add-region.component';
import { EditRegionComponent } from './regions/edit-region/edit-region.component';

import { ListPartnersComponent } from './partners/list-partners/list-partners.component';
import { AddPartnerComponent } from './partners/add-partner/add-partner.component';
import { EditPartnerComponent } from './partners/edit-partner/edit-partner.component';

import { ListAdsComponent } from "./ads/list-ads/list-ads.component";
import { AddAdComponent } from "./ads/add-ad/add-ad.component";
import { EditAdComponent } from "./ads/edit-ad/edit-ad.component";
import { AdService } from './ads/ad.service';


import { UploadService } from './services/upload.service';
import { LoginComponent } from './auth/login/login.component';

import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { UtilsService } from './services/utils.service';
import { MigrationsComponent } from './migrations/migrations.component';


export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ListEventsComponent, AddEventComponent, EditEventComponent,
    ListCitiesComponent, AddCityComponent, EditCityComponent,
    ListOrgsComponent, AddOrgComponent, EditOrgComponent,
    ListTagsComponent, AddTagComponent, EditTagComponent,
    ListRegionsComponent, AddRegionComponent, EditRegionComponent,
    ListPartnersComponent, AddPartnerComponent, EditPartnerComponent,
    ListAdsComponent, AddAdComponent, EditAdComponent,
    DialogConfirm,
    LoginComponent,
    MigrationsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    FormsModule, ReactiveFormsModule,
    HotkeyModule.forRoot(),
    AngularMaterialComponentsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [
          'localhost:4200',
          'localhost:8080',
          'sulbaguia.com.br',
          'sulbaguia-stg.appspot.com'],
        blacklistedRoutes: [
          'localhost:4200/api/auth',
          'localhost:8080/api/auth',
          'sulbaguia.com.br/api/auth',
          'sulbaguia-stg.appspot.com/api/auth'
        ]
      }
    }),
    AngularEditorModule,
    
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
    UploadService,
    AuthService,
    AuthGuard,
    UtilsService
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogConfirm]
})
export class AppModule { }
