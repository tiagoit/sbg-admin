import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AppService } from 'app/services/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  public username: string;
  public password: string;
  public error: string;

  constructor(private router: Router, private auth: AuthService, private appService: AppService) { }

  public submit() {
    this.appService.startLoad('login');
    this.auth.login(this.username, this.password)
      .pipe(first())
      .subscribe(
        result => this.router.navigate(['events']),
        err => this.error = 'Could not authenticate'
      )
      .add(async () => {
        this.appService.stopLoad('login');
      });
  }
}
