import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventService } from '../event.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';

import { UploadService } from '../../services/upload.service';
import { OrgService } from '../../orgs/org.service';
import { Org, Event } from '../../models';
import { AppService } from 'app/services/app.service';

@Component({
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
  @ViewChild("firstInput") firstInput: ElementRef;

  fg: FormGroup;
  timeOptions = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
  imgPreview: any[] = [];
  files: File[] = [];
  orgs: Org[];
  newEvent: Event = new Event();

  constructor(fb: FormBuilder, private service: EventService, private router: Router, public snackBar: MatSnackBar,
    private orgService: OrgService, private http: HttpClient, private el: ElementRef, public uploadService: UploadService, public appService: AppService) {
    this.fg = fb.group({
      start: ['', Validators.required],
      startTime: [],
      org: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      featured: ['']
    });
  }

  ngOnInit() {
    this.appService.startLoad('events-add-load-orgs');
    this.orgService.get().subscribe((orgs: Org[]) => {
      this.appService.stopLoad('events-add-load-orgs');
      this.orgs = orgs;
    });
    this.firstInput.nativeElement.focus();
  }

  save() {
    this.appService.startLoad('events-add');
    let dateWithTime: Date = new Date(this.fg.controls.start.value);
    dateWithTime.setHours(this.fg.controls.startTime.value);
    this.newEvent.start = dateWithTime;

    this.orgs.forEach(org => {
      if(org.name === this.fg.controls.org.value) {
        this.newEvent['org'] = org.name;
        this.newEvent['city'] = org.address.city;
        this.newEvent['city'] = org.address.city;
      }
    });

    this.newEvent.title       = this.fg.controls.title.value;
    this.newEvent.description = this.fg.controls.description.value;
    this.newEvent.featured    = this.fg.controls.featured.value || false;

    this.service.add(this.newEvent).subscribe((res) => {
      this.appService.stopLoad('events-add');
      this.snackBar.open('Evento adicionado com sucesso!', null, {duration: 2000});
      this.router.navigate([`/events`]);
    })
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
    this.appService.startLoad('events-add-image-'+idx);

    this.uploadService.upload(file).subscribe(event => {
      if(event.type === HttpEventType.Response) {
        this.newEvent.images[idx] = event.body.gcsPublicUrl;
      }
    }).add(() => this.appService.stopLoad('events-add-image-'+idx));
  }
  
  backToList() {
    this.router.navigate([`/events`]);
  }
}

