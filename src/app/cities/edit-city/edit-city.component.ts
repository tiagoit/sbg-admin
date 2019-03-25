import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CityService } from "../city.service";
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-edit-city',
  templateUrl: './edit-city.component.html',
  styleUrls: ['./edit-city.component.scss']
})
export class EditCityComponent implements OnInit {
  @ViewChild("firstInput") firstInput: ElementRef;
  city: any;
  fg: FormGroup;

  constructor(private route: ActivatedRoute, private service: CityService, private fb: FormBuilder, private router: Router, public snackBar: MatSnackBar) {
    this.fg = fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.service.getById(p.id).subscribe(city => {
        this.city = city;
        this.fillForm(city);
        this.firstInput.nativeElement.focus();
      })
    });
  }

  fillForm(city) {
    this.fg.controls.name.setValue(city.name);
  }

  update() {
    let data = {};
    data['_id']       = this.city._id;
    data['name']  = this.fg.controls.name.value;

    this.service.update(data).subscribe((res) => {
      this.snackBar.open('Cidade atualizada com sucesso!', null, {duration: 2000});
      this.router.navigate([`/cities`]);
    });
  }

  cancel() {
    this.router.navigate(['/cities']);
  }

}
