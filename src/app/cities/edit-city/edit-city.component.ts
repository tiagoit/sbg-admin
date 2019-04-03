import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CityService } from "../city.service";
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AppService } from 'app/services/app.service';

@Component({
  selector: 'app-edit-city',
  templateUrl: './edit-city.component.html',
  styleUrls: ['./edit-city.component.scss']
})
export class EditCityComponent implements OnInit {
  @ViewChild("firstInput") firstInput: ElementRef;
  city: any;
  fg: FormGroup;


  constructor(private route: ActivatedRoute, private service: CityService, private fb: FormBuilder, private router: Router, public snackBar: MatSnackBar, public appService: AppService) {
    this.fg = fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.city = this.route.snapshot.data.city;
    this.fillForm(this.city);
    this.firstInput.nativeElement.focus();
    this.appService.stopLoad('cities-edit-load-data');
  }

  fillForm(city) {
    this.fg.controls.name.setValue(city.name);
  }

  update() {
    this.appService.startLoad('cities-edit');
    let data = {};
    data['_id'] = this.city._id;
    data['name'] = this.fg.controls.name.value;

    this.service.update(data).subscribe((res) => {
      this.appService.stopLoad('cities-edit');
      this.snackBar.open('Cidade atualizada com sucesso!', null, {duration: 2000});
      this.router.navigate([`/cities`]);
    });
  }

  backToList() {
    this.router.navigate(['/cities']);
  }

}
