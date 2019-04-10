import { Component } from '@angular/core';
import { MigrationsService } from './migrations.service';

@Component({
  selector: 'app-migrations',
  templateUrl: './migrations.component.html'
})
export class MigrationsComponent {
  migCount;

  constructor(private service: MigrationsService) {
    this.service.getCount().subscribe(res => this.migCount = res['migCount']);
  }

  execute(migCode: String) {
    this.service.execute(migCode).subscribe((res) => {
      console.log('res: ', res)
    }) ;
  }

  createRange(number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
       items.push(i);
    }
    return items;
  }

}
