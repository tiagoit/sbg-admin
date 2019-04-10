import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MigrationsService {
  url = `${environment.API_URL}/migrations`;

  constructor(private http: HttpClient) { }
  
  getCount() {
    return this.http.get(`${this.url}/mig-count`);
  }

  execute(migCode: String) {
    return this.http.get(`${this.url}/${migCode}`);
  }
}
