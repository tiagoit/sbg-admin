import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrgService } from '../org.service';
import { Router } from '@angular/router';
import { MatSnackBar, DateAdapter } from '@angular/material';
import { Org, City } from "../../models";
import { CityService } from '../../cities/city.service';

@Component({
  selector: 'app-add-org',
  templateUrl: './add-org.component.html',
  styleUrls: ['./add-org.component.scss']
})
export class AddOrgComponent implements OnInit {
  fg: FormGroup;
  cities: City[];
  @ViewChild("firstInput") firstInput: ElementRef;

  constructor(fb: FormBuilder, private service: OrgService, private router: Router, public snackBar: MatSnackBar, private cityService: CityService) {
    this.fg = fb.group({
      name: ['', Validators.required],
      mobile: [''],
      land: [''],
      email: [''],
      notes: [''],
      status: [true],

      city: ['', Validators.required],
      neighborhood: [''],
      street: [''],
      number: [''],
      complement: [''],
      zipCode: [''],
    
      contact_name: [''],
      contact_email: [''],
      contact_mobile: [''],
      contact_role: [''],
      contact_notes: ['']
    });
  }

  ngOnInit() { 
    this.cityService.get().subscribe((cities: City[]) => this.cities = cities);
    this.firstInput.nativeElement.focus();
  }

  save() {
    let org: Org = new Org();
    org.name = this.fg.controls.name.value;
    org.mobile = this.fg.controls.mobile.value;
    org.land = this.fg.controls.land.value;
    org.email = this.fg.controls.email.value;
    org.notes = this.fg.controls.notes.value;
    org.status = this.fg.controls.status.value ? true : false;

    org.address.state = 'BA';
    org.address.city = this.fg.controls.city.value;
    org.address.neighborhood = this.fg.controls.neighborhood.value;
    org.address.street = this.fg.controls.street.value;
    org.address.number = this.fg.controls.number.value;
    org.address.complement = this.fg.controls.complement.value;
    org.address.zipCode = this.fg.controls.zipCode.value;
  
    org.contacts[0].name = this.fg.controls.contact_name.value;
    org.contacts[0].email = this.fg.controls.contact_email.value;
    org.contacts[0].mobile = this.fg.controls.contact_mobile.value;
    org.contacts[0].role = this.fg.controls.contact_role.value;
    org.contacts[0].notes = this.fg.controls.contact_notes.value;
    
    this.service.add(org).subscribe((res) => {
      this.snackBar.open('Organização adicionada com sucesso!', null, {duration: 2000});
      this.router.navigate([`/orgs`]);
    })
  }
}

