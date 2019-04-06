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
  

  removeAcentos(str: String): String {                        
    str = str.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
    str = str.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
    str = str.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
    str = str.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
    str = str.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
    str = str.replace(new RegExp('[Ç]','gi'), 'c');
    str = str.replace('\'', '-');
    return str;
  }

  public encodeToUrl(str: String): String {
    str = str.toLowerCase().replace(/ /g , '-');
    return this.removeAcentos(str);
  }
}
