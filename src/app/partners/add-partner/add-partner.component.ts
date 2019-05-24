import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AppService } from 'app/services/app.service';
import { PartnerService } from '../partner.service';
import { Region } from 'app/regions/region.model';
import { RegionService } from 'app/regions/region.service';

@Component({
  selector: 'app-add-partner',
  templateUrl: './add-partner.component.html',
  styleUrls: ['./add-partner.component.scss']
})
export class AddPartnerComponent implements OnInit {
  @ViewChild("firstInput") firstInput: ElementRef;
  fg: FormGroup;
  regions: Region[];

  constructor(fb: FormBuilder,
    private service: PartnerService,
    private router: Router,
    public snackBar: MatSnackBar,
    public appService: AppService,
    public regionService: RegionService) {
    this.fg = fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      pass: ['', Validators.required],
      regionID: [''],
      role: ['', Validators.required],
      status: [true]
    });
  }

  ngOnInit() {
    this.firstInput.nativeElement.focus();
    this.regionService.get().subscribe((regions: Region[]) => this.regions = regions);
  }

  save() {
    this.appService.startLoad('partners-add');
    let data = {};
    data['name']  = this.fg.controls.name.value;
    data['email']  = this.fg.controls.email.value;
    data['pass']  = this.fg.controls.pass.value;
    data['regionID']  = this.fg.controls.regionID.value;
    data['role']  = this.fg.controls.role.value;
    data['status'] = this.fg.controls.status.value ? true : false;

    this.service.checkEmail(this.appService.encodeToUrl(data['email'])).subscribe((result) => {
      if(result) {
        this.fg.controls.email.setErrors({});
        this.appService.stopLoad('partners-add');
      } else {
        this.service.add(data).subscribe((res) => {
          this.appService.stopLoad('partners-add');
          this.snackBar.open('Parceiro adicionada com sucesso!', null, {duration: 2000});
          this.router.navigate([`/partners`]);
        })
      }
    });
  }

  backToList() {
    this.router.navigate(['/partners']);
  }
}

