import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CityService } from '../service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AppService } from 'app/services/app.service';

@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.scss']
})
export class AddCityComponent implements OnInit {
  @ViewChild("firstInput") firstInput: ElementRef;
  fg: FormGroup;

  constructor(fb: FormBuilder, private service: CityService, private router: Router, public snackBar: MatSnackBar, public appService: AppService) {
    this.fg = fb.group({
      name: ['', Validators.required],
      status: [true]
    });
  }

  ngOnInit() {
    this.firstInput.nativeElement.focus();
  }

  save() {
    this.appService.startLoad('cities-add');
    let data = {};
    data['name']  = this.fg.controls.name.value;
    data['status'] = this.fg.controls.status.value ? true : false;

    this.service.checkCode(this.appService.encodeToUrl(data['name'])).subscribe((result) => {
      if(result) {
        this.fg.controls.name.setErrors({});
        this.appService.stopLoad('cities-add');
      } else {
        this.service.add(data).subscribe((res) => {
          this.appService.stopLoad('cities-add');
          this.snackBar.open('Cidade adicionada com sucesso!', null, {duration: 2000});
          this.router.navigate([`/cities`]);
        })
      }
    });
  }

  backToList() {
    this.router.navigate(['/cities']);
  }
}

