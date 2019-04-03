import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() { }

  /* LOADING */
  private loadingArray: String[] = [];
  isLoading(): Boolean { return !!this.loadingArray.length; }
  startLoad(id: String): void { if(!this.loadingArray.includes(id)) this.loadingArray.push(id); }
  stopLoad(id: String): void { this.loadingArray = this.loadingArray.filter(_id => _id !== id); }

  
}
