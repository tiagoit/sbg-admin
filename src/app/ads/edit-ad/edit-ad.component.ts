import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CityService } from "../ad.service";
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AppService } from 'app/services/app.service';
import { City } from 'app/models';

@Component({
  selector: 'app-edit-city',
  templateUrl: './edit-city.component.html',
  styleUrls: ['./edit-city.component.scss']
})
export class EditCityComponent implements OnInit {
  @ViewChild("firstInput") firstInput: ElementRef;
  city: any;
  fg: FormGroup;
  storedName: String;

  constructor(private route: ActivatedRoute, private service: CityService, private fb: FormBuilder, private router: Router, public snackBar: MatSnackBar, public appService: AppService) {
    this.fg = fb.group({
      name: ['', Validators.required],
      status: ['']
    });
  }

  ngOnInit() {
    this.city = this.route.snapshot.data.city;
    this.storedName = this.city.name;
    this.fillForm();
    this.firstInput.nativeElement.focus();
    this.appService.stopLoad('cities-edit-load-data');
  }

  fillForm() {
    this.fg.controls.name.setValue(this.city.name);
    this.fg.controls.status.setValue(this.city.status)
  }

  onSubmit() {
    this.appService.startLoad('cities-edit');

    if(this.fg.controls.name.value !== this.storedName) {
      this.service.checkCode(this.appService.encodeToUrl(this.fg.controls.name.value)).subscribe((result) => {
        if(result) {
          this.fg.controls.name.setErrors({});
          this.appService.stopLoad('cities-edit');
        } else {
          this.update();
        }
      });
    } else {
      this.update();
    }
  }

  update() {
    let newCity: City = new City();
    newCity._id = this.city._id;
    newCity.name = this.fg.controls.name.value;
    newCity.status = this.fg.controls.status.value;

    this.service.update(newCity, this.city.name).subscribe((res) => {
      this.appService.stopLoad('cities-edit');
      this.snackBar.open('Cidade atualizada com sucesso!', null, {duration: 2000});
      this.router.navigate([`/cities`]);
    });
  }

  backToList() {
    this.router.navigate(['/cities']);
  }

}
