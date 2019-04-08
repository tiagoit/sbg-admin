import { Injectable, ModuleWithComponentFactories } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Event, Tag } from 'app/models';
import { Observable } from 'rxjs';
import { UtilsService } from 'app/services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class EventService implements Resolve<Event>{
  url = `${environment.API_URL}/events`;

  // Resolver for `/edit/:id` route.
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    return this.getById(route.params.id);
  }

  constructor(private http: HttpClient, private utilsService: UtilsService) { }
  
  get() {
    return this.http.get(this.url);
  }
  
  getById(id: String) {
    return this.http.get(`${this.url}/${id}`);
  }
  
  update(data) {
    return this.http.put(`${this.url}/${data._id}`, data);
  }
  
  add(data) {
    return this.http.post(this.url, data);
  }
  
  delete(id: String) {
    return this.http.delete(`${this.url}/${id}`);
  }

  checkCode(code: String, orgCode: String, cityCode: String) {
    return this.http.get(`${this.url}/check-code/${code}/${orgCode}/${cityCode}`);
  }
}
