import { Component } from '@angular/core';
import { MigrationsService } from './migrations.service';

@Component({
  selector: 'app-migrations',
  templateUrl: './migrations.component.html'
})
export class MigrationsComponent {

  constructor(private service: MigrationsService) { }

  execute(migCode: String) {
    this.service.execute(migCode).subscribe((res) => {
      console.log('res: ', res)
    }) ;
  }

}
