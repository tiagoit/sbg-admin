import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PartnerService } from "../partner.service";
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AppService } from 'app/services/app.service';
import { Partner } from '../partner.model';
import { Region } from 'app/regions/region.model';
import { RegionService } from 'app/regions/region.service';

@Component({
  selector: 'app-edit-partner',
  templateUrl: './edit-partner.component.html',
  styleUrls: ['./edit-partner.component.scss']
})
export class EditPartnerComponent implements OnInit {
  @ViewChild("firstInput") firstInput: ElementRef;
  partner: any;
  fg: FormGroup;
  storedEmail: String;
  regions: Region[];

  constructor(
    private route: ActivatedRoute,
    private service: PartnerService,
    private fb: FormBuilder,
    private router: Router,
    public snackBar: MatSnackBar,
    public appService: AppService,
    private regionService: RegionService) {
    this.fg = fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      pass: ['', Validators.required],
      regionID: [''],
      role: ['', Validators.required],
      status: ['']
    });
  }

  ngOnInit() {
    this.partner = this.route.snapshot.data.partner;
    this.storedEmail = this.partner.email;
    this.regionService.get().subscribe((regions: Region[]) => {
      this.regions = regions
      this.fillForm();
    });
    this.firstInput.nativeElement.focus();
    this.appService.stopLoad('partners-edit-load-data');
  }

  fillForm() {
    this.fg.controls.name.setValue(this.partner.name);
    this.fg.controls.email.setValue(this.partner.email);
    this.fg.controls.pass.setValue(this.partner.pass);
    this.fg.controls.regionID.setValue(this.partner.regionID);
    this.fg.controls.role.setValue(this.partner.role);
    this.fg.controls.status.setValue(this.partner.status)
  }

  onSubmit() {
    this.appService.startLoad('partners-edit');

    if(this.fg.controls.email.value !== this.storedEmail) {
      this.service.checkEmail(this.appService.encodeToUrl(this.fg.controls.email.value)).subscribe((result) => {
        console.log(result)
        if(result) {
          this.fg.controls.email.setErrors({});
          this.appService.stopLoad('partners-edit');
        } else {
          this.update();
        }
      });
    } else {
      this.update();
    }
  }

  update() {
    let newPartner: Partner = new Partner();
    newPartner._id = this.partner._id;
    newPartner.name = this.fg.controls.name.value;
    newPartner.email = this.fg.controls.email.value;
    newPartner.pass = this.fg.controls.pass.value;
    newPartner.regionID = this.fg.controls.regionID.value;
    newPartner.role = this.fg.controls.role.value;
    newPartner.status = this.fg.controls.status.value;

    this.service.update(newPartner, this.partner.name).subscribe((res) => {
      this.appService.stopLoad('partners-edit');
      this.snackBar.open('Parceiro atualizado com sucesso!', null, {duration: 2000});
      this.router.navigate([`/partners`]);
    });
  }

  backToList() {
    this.router.navigate(['/partners']);
  }

}
