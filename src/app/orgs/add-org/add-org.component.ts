import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrgService } from '../org.service';
import { Router } from '@angular/router';
import { MatSnackBar, DateAdapter } from '@angular/material';
import { Org, City } from "../../models";
import { CityService } from '../../cities/city.service';
import { AppService } from 'app/services/app.service';
import { UploadService } from 'app/services/upload.service';
import { HttpEventType } from '@angular/common/http';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  templateUrl: './add-org.component.html',
  styleUrls: ['./add-org.component.scss']
})
export class AddOrgComponent implements OnInit {
  @ViewChild("firstInput") firstInput: ElementRef;

  fg: FormGroup;
  cities: City[];
  imgPreview: any[] = [];
  files: File[] = [];
  org: Org = new Org();
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '240px',
    minHeight: '120px',
    placeholder: 'Descrição...',
    translate: 'no',
    showToolbar: false
  };

  constructor(fb: FormBuilder, private service: OrgService, private router: Router, public snackBar: MatSnackBar, private cityService: CityService, public appService: AppService, public uploadService: UploadService) {
    this.fg = fb.group({
      name: ['', Validators.required],
      site: [''],
      mobile: [''],
      land: [''],
      email: [''],
      description: [''],
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
    this.appService.startLoad('orgs-add-load-cities');
    this.cityService.get().subscribe((cities: City[]) => {
      this.appService.stopLoad('orgs-add-load-cities');
      this.cities = cities.filter((city) => city.status === true);
    });
    this.firstInput.nativeElement.focus();
  }

  buildOrg() {
    this.org.name = this.fg.controls.name.value;
    this.org.site = this.fg.controls.site.value;
    this.org.mobile = this.fg.controls.mobile.value;
    this.org.land = this.fg.controls.land.value;
    this.org.email = this.fg.controls.email.value;
    this.org.description = this.fg.controls.description.value;
    this.org.status = this.fg.controls.status.value ? true : false;

    this.org.address.state = 'BA';
    this.org.address.city = this.fg.controls.city.value;
    this.org.address.neighborhood = this.fg.controls.neighborhood.value;
    this.org.address.street = this.fg.controls.street.value;
    this.org.address.number = this.fg.controls.number.value;
    this.org.address.complement = this.fg.controls.complement.value;
    this.org.address.zipCode = this.fg.controls.zipCode.value;
  
    this.org.contacts[0].name = this.fg.controls.contact_name.value;
    this.org.contacts[0].email = this.fg.controls.contact_email.value;
    this.org.contacts[0].mobile = this.fg.controls.contact_mobile.value;
    this.org.contacts[0].role = this.fg.controls.contact_role.value;
    this.org.contacts[0].notes = this.fg.controls.contact_notes.value;
  }

  save() {
    this.appService.startLoad('orgs-add');
    this.buildOrg();
    let code = this.appService.encodeToUrl(this.org['name']);
    let cityCode = this.appService.encodeToUrl(this.org['address']['city']);
    this.service.checkCode(code, cityCode).subscribe((result) => {      
      if(result) {
        this.fg.controls.name.setErrors({});
        this.appService.stopLoad('orgs-add');
      } else {
        this.service.add(this.org).subscribe((res) => {
          this.appService.stopLoad('orgs-add');
          this.snackBar.open('Organização adicionada com sucesso!', null, {duration: 2000});
          this.router.navigate([`/orgs`]);
        })
      }
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
    this.appService.startLoad('orgs-add-image-'+idx);

    this.uploadService.upload(file, 'orgs').subscribe(event => {
      if(event.type === HttpEventType.Response) {
        this.org.images[idx] = event.body.gcsPublicUrl;
      }
    }).add(() => this.appService.stopLoad('orgs-add-image-'+idx));
  }

  removeImage(idx: number) {
    this.imgPreview[idx] = null;
    this.files[idx] = null;
  }

  backToList() {
    this.router.navigate([`/orgs`]);
  }
}

