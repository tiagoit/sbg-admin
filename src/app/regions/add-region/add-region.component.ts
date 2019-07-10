import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegionService } from '../region.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AppService } from 'app/services/app.service';

@Component({
  selector: 'app-add-region',
  templateUrl: './add-region.component.html',
  styleUrls: ['./add-region.component.scss']
})
export class AddRegionComponent implements OnInit {
  @ViewChild("firstInput") firstInput: ElementRef;
  fg: FormGroup;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    public appService: AppService,
    private fb: FormBuilder,
    private service: RegionService) {
      this.fg = fb.group({
        name: ['', Validators.required],
        status: [true]
    });
  }

  ngOnInit() {
    this.firstInput.nativeElement.focus();
  }

  save() {
    this.appService.startLoad('region-add');
    let data = {};
    data['name']  = this.fg.controls.name.value;
    data['status'] = this.fg.controls.status.value ? true : false;

    this.service.checkCode(this.appService.encodeToUrl(data['name'])).subscribe((result) => {
      if(result) {
        this.fg.controls.name.setErrors({});
        this.appService.stopLoad('region-add');
      } else {
        this.service.add(data).subscribe((res) => {
          this.appService.stopLoad('region-add');
          this.snackBar.open('Região adicionada com sucesso!', null, {duration: 2000});
          this.router.navigate([`/regions`]);
        })
      }
    });
  }

  backToList() {
    this.router.navigate(['/regions']);
  }
}

