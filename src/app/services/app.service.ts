import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  url = `${environment.API_URL}/app`;

  constructor(private http: HttpClient) { }

  /* LOADING */
  private loadingArray: String[] = [];
  isLoading(): Boolean { return !!this.loadingArray.length; }
  startLoad(id: String): void { if(!this.loadingArray.includes(id)) this.loadingArray.push(id); }
  stopLoad(id: String): void { this.loadingArray = this.loadingArray.filter(_id => _id !== id); }



  getTags() {
    return this.http.get(`${this.url}/tags`);
  }
  
}
