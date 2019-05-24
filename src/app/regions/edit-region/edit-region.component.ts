import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegionService } from "../region.service";
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AppService } from 'app/services/app.service';
import { Region } from '../region.model';

@Component({
  selector: 'app-edit-region',
  templateUrl: './edit-region.component.html',
  styleUrls: ['./edit-region.component.scss']
})
export class EditRegionComponent implements OnInit {
  @ViewChild("firstInput") firstInput: ElementRef;
  region: any;
  fg: FormGroup;
  storedName: String;

  constructor(
    private route: ActivatedRoute,
    private service: RegionService,
    private fb: FormBuilder,
    private router: Router,
    public snackBar: MatSnackBar,
    public appService: AppService
  ) {
    this.fg = fb.group({
      name: ['', Validators.required],
      status: ['']
    });
  }

  ngOnInit() {
    this.region = this.route.snapshot.data.region;
    console.log('region', this.region);
    this.storedName = this.region.name;
    this.fillForm();
    this.firstInput.nativeElement.focus();
    this.appService.stopLoad('regions-edit-load-data');
  }

  fillForm() {
    this.fg.controls.name.setValue(this.region.name);
    this.fg.controls.status.setValue(this.region.status)
  }

  onSubmit() {
    this.appService.startLoad('regions-edit');

    if(this.fg.controls.name.value !== this.storedName) {
      this.service.checkCode(this.appService.encodeToUrl(this.fg.controls.name.value)).subscribe((result) => {
        if(result) {
          this.fg.controls.name.setErrors({});
          this.appService.stopLoad('regions-edit');
        } else {
          this.update();
        }
      });
    } else {
      this.update();
    }
  }

  update() {
    let newRegion: Region = new Region();
    newRegion._id = this.region._id;
    newRegion.name = this.fg.controls.name.value;
    newRegion.status = this.fg.controls.status.value;

    this.service.update(newRegion, this.region.name).subscribe((res) => {
      this.appService.stopLoad('regions-edit');
      this.snackBar.open('Cidade atualizada com sucesso!', null, {duration: 2000});
      this.router.navigate([`/regions`]);
    });
  }

  backToList() {
    this.router.navigate(['/regions']);
  }

}
