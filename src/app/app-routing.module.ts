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

  { path: 'migrations', component: MigrationsComponent, canActivate: [AuthGuard] },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

@NgModule({ 
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 
