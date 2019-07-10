import { NgModule, Injectable } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';

import { ListEventsComponent } from "./events/list-events/list-events.component";
import { AddEventComponent } from "./events/add-event/add-event.component";
import { EditEventComponent } from "./events/edit-event/edit-event.component";
import { EventService } from "./events/event.service";

import { ListCitiesComponent } from "./cities/list-cities/list-cities.component";
import { AddCityComponent } from "./cities/add-city/add-city.component";
import { EditCityComponent } from "./cities/edit-city/edit-city.component";
import { CityService } from './cities/city.service';

import { ListOrgsComponent } from "./orgs/list-orgs/list-orgs.component";
import { AddOrgComponent } from "./orgs/add-org/add-org.component";
import { EditOrgComponent } from "./orgs/edit-org/edit-org.component";
import { OrgService } from "./orgs/org.service";

import { ListTagsComponent } from "./tags/list-tags/list-tags.component";
import { AddTagComponent } from "./tags/add-tag/add-tag.component";
import { EditTagComponent } from "./tags/edit-tag/edit-tag.component";
import { TagService } from './tags/tag.service';

import { ListRegionsComponent } from "./regions/list-regions/list-regions.component";
import { AddRegionComponent } from "./regions/add-region/add-region.component";
import { EditRegionComponent } from "./regions/edit-region/edit-region.component";
import { RegionService } from './regions/region.service';

import { ListPartnersComponent } from "./partners/list-partners/list-partners.component";
import { AddPartnerComponent } from "./partners/add-partner/add-partner.component";
import { EditPartnerComponent } from "./partners/edit-partner/edit-partner.component";
import { PartnerService } from './partners/partner.service';

import { ListAdsComponent } from "./ads/list-ads/list-ads.component";
import { AddAdComponent } from "./ads/add-ad/add-ad.component";
import { EditAdComponent } from "./ads/edit-ad/edit-ad.component";
import { AdService } from './ads/ad.service';

import { MigrationsComponent } from './migrations/migrations.component';

const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  { path: 'events', component: ListEventsComponent, canActivate: [AuthGuard] },
  { path: 'events/add', component: AddEventComponent, canActivate: [AuthGuard] },
  { path: 'events/edit/:id', component: EditEventComponent, canActivate: [AuthGuard], resolve: { event: EventService } },

  { path: 'cities', component: ListCitiesComponent, canActivate: [AuthGuard] },
  { path: 'cities/add', component: AddCityComponent, canActivate: [AuthGuard] },
  { path: 'cities/edit/:id', component: EditCityComponent, canActivate: [AuthGuard], resolve: { city: CityService } },

  { path: 'orgs', component: ListOrgsComponent, canActivate: [AuthGuard] },
  { path: 'orgs/add', component: AddOrgComponent, canActivate: [AuthGuard] },
  { path: 'orgs/edit/:id', component: EditOrgComponent, canActivate: [AuthGuard], resolve: { org: OrgService }  },

  { path: 'tags', component: ListTagsComponent, canActivate: [AuthGuard] },
  { path: 'tags/add', component: AddTagComponent, canActivate: [AuthGuard] },
  { path: 'tags/edit/:id', component: EditTagComponent, canActivate: [AuthGuard], resolve: { tag: TagService } },

  { path: 'regions', component: ListRegionsComponent, canActivate: [AuthGuard] },
  { path: 'regions/add', component: AddRegionComponent, canActivate: [AuthGuard] },
  { path: 'regions/edit/:id', component: EditRegionComponent, canActivate: [AuthGuard], resolve: { region: RegionService } },

  { path: 'partners', component: ListPartnersComponent, canActivate: [AuthGuard] },
  { path: 'partners/add', component: AddPartnerComponent, canActivate: [AuthGuard] },
  { path: 'partners/edit/:id', component: EditPartnerComponent, canActivate: [AuthGuard], resolve: { partner: PartnerService } },

  { path: 'anuncios', component: ListAdsComponent, canActivate: [AuthGuard] },
  { path: 'anuncios/add', component: AddAdComponent, canActivate: [AuthGuard] },
  { path: 'anuncios/edit/:id', component: EditAdComponent, canActivate: [AuthGuard], resolve: { ad: AdService } },

  { path: 'migrations', component: MigrationsComponent, canActivate: [AuthGuard] },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

@NgModule({ 
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 
