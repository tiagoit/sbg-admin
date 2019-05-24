import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Partner } from './partner.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartnerService implements Resolve<Partner> {
  url = `${environment.API_URL}/partners`;
  roles = [
    { code: 'superadmin', name: 'Super Admin' },
    { code: 'admin', name: 'Admin' },
    { code: 'regionalPartner', name: 'Parceiro regional' }
  ];

  // Resolver for `/edit/:id` route.
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    return this.getById(route.params.id);
  }

  constructor(private http: HttpClient) { }
  
  get() {
    return this.http.get(this.url);
  }
  
  getById(id: String) {
    return this.http.get(`${this.url}/${id}`);
  }
  
  update(data, oldName) {
    data['oldName'] = oldName;
    return this.http.put(`${this.url}/${data._id}`, data);
  }
  
  add(data) {
    return this.http.post(this.url, data);
  }
  
  delete(id: String) {
    return this.http.delete(`${this.url}/${id}`);
  }

  checkEmail(email: String) {
    return this.http.get(`${this.url}/check-email/${email}`);
  }
}
