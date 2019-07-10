import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { AppService } from 'app/services/app.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  moduleTitles = {
    'login': 'Login',
    'events': 'Eventos',
    'regions': 'Regiões',
    'cities': 'Cidades',
    'partners': 'Parceiros',
    'orgs': 'Organizações',
    'tags': 'Tags',
    'migrations': 'Migrações',
    'anuncios': 'Anúncios',
  }

  constructor(private router: Router, private breakpointObserver: BreakpointObserver, public auth: AuthService, public appService: AppService, private titleService: Title) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }

  getModuleTitle() {
    let moduleName = this.moduleTitles[this.router.url.split('/')[1]];
    this.titleService.setTitle(`Sul BA Guia | ` + moduleName);
    return moduleName;
  }

  navClick(drawer, isHandset) {
    isHandset.subscribe(isHandset => {
      if(isHandset) drawer.toggle()
    });
  }
}
