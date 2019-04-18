import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrgService } from "../org.service";
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { City, Org } from '../../models';
import { CityService } from '../../cities/city.service';
import { AppService } from 'app/services/app.service';
import { UploadService } from 'app/services/upload.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  templateUrl: './edit-org.component.html',
  styleUrls: ['./edit-org.component.scss']
})
export class EditOrgComponent implements OnInit {
  @ViewChild("firstInput") firstInput: ElementRef;
  org: any;
  fg: FormGroup;
  cities: City[];
  imgPreview: any[] = [];
  files: File[] = [];

  constructor(private route: ActivatedRoute, private service: OrgService, private fb: FormBuilder, private router: Router, public snackBar: MatSnackBar, private cityService: CityService, public appService: AppService, public uploadService: UploadService) {
    this.fg = fb.group({
      name: ['', Validators.required],
      site: [''],
      mobile: [''],
      land: [''],
      email: [''],
      description: [''],
      status: [''],

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
    this.appService.startLoad('orgs-edit-load-cities');
    this.cityService.get().subscribe((cities: City[]) => {
      this.appService.stopLoad('orgs-edit-load-cities');
      this.cities = cities.filter((city) => city.status === true);
    });
    this.org = this.route.snapshot.data.org;

    this.fillForm();
    this.firstInput.nativeElement.focus();
    this.appService.stopLoad('orgs-edit-load-data');
  }

  fillForm() {
    this.fg.controls.name.setValue(this.org.name);
    this.fg.controls.site.setValue(this.org.site);
    this.fg.controls.mobile.setValue(this.org.mobile);
    this.fg.controls.land.setValue(this.org.land);
    this.fg.controls.email.setValue(this.org.email);
    this.fg.controls.description.setValue(this.org.description);
    this.fg.controls.status.setValue(this.org.status);

    this.fg.controls.city.setValue(this.org.address.city);
    this.fg.controls.neighborhood.setValue(this.org.address.neighborhood);
    this.fg.controls.street.setValue(this.org.address.street);
    this.fg.controls.number.setValue(this.org.address.number);
    this.fg.controls.complement.setValue(this.org.address.complement);
    this.fg.controls.zipCode.setValue(this.org.address.zipCode);
  
    this.fg.controls.contact_name.setValue(this.org.contacts[0].name);
    this.fg.controls.contact_email.setValue(this.org.contacts[0].email);
    this.fg.controls.contact_mobile.setValue(this.org.contacts[0].mobile);
    this.fg.controls.contact_role.setValue(this.org.contacts[0].role);
    this.fg.controls.contact_notes.setValue(this.org.contacts[0].notes);
  }

  buildOrg() {
    let org: Org = new Org();
    org._id       = this.org._id;
    org.name      = this.fg.controls.name.value;
    org.site      = this.fg.controls.site.value;
    org.mobile    = this.fg.controls.mobile.value;
    org.land      = this.fg.controls.land.value;
    org.email     = this.fg.controls.email.value;
    org.description     = this.fg.controls.description.value;
    org.status    = this.fg.controls.status.value;

    org.address.state         = 'BA';
    org.address.city          = this.fg.controls.city.value;
    org.address.neighborhood  = this.fg.controls.neighborhood.value;
    org.address.street        = this.fg.controls.street.value;
    org.address.number        = this.fg.controls.number.value;
    org.address.complement    = this.fg.controls.complement.value;
    org.address.zipCode      = this.fg.controls.zipCode.value;
  
    org.contacts[0].name    = this.fg.controls.contact_name.value;
    org.contacts[0].email   = this.fg.controls.contact_email.value;
    org.contacts[0].mobile  = this.fg.controls.contact_mobile.value;
    org.contacts[0].role    = this.fg.controls.contact_role.value;
    org.contacts[0].notes   = this.fg.controls.contact_notes.value;
    org.images = this.org.images;
    return org;
  }

  onSubmit() {
    this.appService.startLoad('orgs-edit')
    let org = this.buildOrg();
    let code = this.appService.encodeToUrl(org['name']);
    let cityCode = this.appService.encodeToUrl(org['address']['city']);

    if(this.fg.controls.name.value !== this.org.name || this.fg.controls.city.value !== this.org.address.city) {
      this.service.checkCode(code, cityCode).subscribe((result) => {      
        if(result) {
          this.fg.controls.name.setErrors({});
          this.appService.stopLoad('orgs-edit');
        } else {
          this.update(org);
        }
      });
    } else {
      this.update(org);
    }
  }

  update(org) {
    this.service.update(org, this.org.name, this.org.address.city, org.address.city).subscribe((res) => {
      this.appService.stopLoad('orgs-edit')
      this.snackBar.open('Organização atualizada com sucesso!', null, {duration: 2000});
      this.router.navigate([`/orgs`]);
    });
  }

  preview(files: File[], idx: number) {
    if (files.length === 0) return;

    this.files[idx] = files[0];

    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgPreview[idx] = reader.result;
    }

    this.upload(files[0], idx);
  }

  upload(file: File, idx: number) {
    this.appService.startLoad('orgs-edit-image-'+idx);

    let fileToDeleteUrl = this.org.images[idx];
    this.uploadService.upload(file, 'orgs').subscribe(_event => {
      if(_event.type === HttpEventType.Response) {
        this.org.images[idx] = _event.body.gcsPublicUrl;
      }
    }).add(() => this.appService.stopLoad('orgs-edit-image-'+idx));
    this.uploadService.delete(fileToDeleteUrl);
  }

  backToList() {
    this.router.navigate(['/orgs']);
  }

}
