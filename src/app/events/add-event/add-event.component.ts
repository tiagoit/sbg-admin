import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { EventService } from '../event.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { UploadService } from '../../services/upload.service';
import { OrgService } from '../../orgs/org.service';
import { Org, Event, Tag } from '../../models';
import { AppService } from 'app/services/app.service';
import * as moment from 'moment';

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
  tags: Tag[];
  newEvent: Event = new Event();
  eventOrg: Org;
  tagsFormArray: FormArray;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '240px',
    minHeight: '120px',
    placeholder: 'Descrição...',
    translate: 'no',
    showToolbar: false
  };


  constructor(fb: FormBuilder, private service: EventService, private router: Router, public snackBar: MatSnackBar,
    private orgService: OrgService, private http: HttpClient, private el: ElementRef, public uploadService: UploadService, public appService: AppService) {
    this.fg = fb.group({
      start: ['', Validators.required],
      startTime: ['', Validators.required],
      size: ['', Validators.required],
      org: ['', Validators.required],
      title: ['', Validators.required],
      site: [''],
      description: [''],
      tags: fb.array([]),
      featured: ['']
    });

    this.tagsFormArray = <FormArray>this.fg.controls.tags;
  }

  ngOnInit() {
    // Get orgs
    this.appService.startLoad('events-add-load-orgs');
    this.orgService.get().subscribe((orgs: Org[]) => {
      this.appService.stopLoad('events-add-load-orgs');
      this.orgs = orgs.filter((org) => org.status === true);
    });

    // Get tags
    this.appService.startLoad('events-add-load-tags');
    this.appService.getTags().subscribe((tags: Tag[]) => {
      this.tags = tags.filter(tag => {
        return tag.childrenTags === undefined || tag.childrenTags.length === 0;
      });
      this.appService.stopLoad('events-add-load-tags');
    });

    this.firstInput.nativeElement.focus();
  }

  buildEvent() {
    let dateWithTime: Date = new Date(this.fg.controls.start.value);
    dateWithTime.setHours(this.fg.controls.startTime.value);
    this.newEvent.start = dateWithTime;

    this.newEvent.title       = this.fg.controls.title.value;
    this.newEvent.site        = this.fg.controls.site.value;
    this.newEvent.size        = this.fg.controls.size.value;
    this.newEvent.description = this.fg.controls.description.value;
    this.newEvent.featured    = this.fg.controls.featured.value || false;
    this.newEvent.tags        = this.fg.controls.tags.value || false;

    this.newEvent.code = this.appService.encodeToUrl(this.newEvent.title).trim() + 
                          moment(this.newEvent.start).format('-DD-MM-YYYY');

    this.orgs.forEach(org => {
      if((org.cityCode+'|||'+org.code) === this.fg.controls.org.value) {
        this.eventOrg = org;
        this.newEvent.orgCode = org.code;
        this.newEvent.orgName = org.name;
        this.newEvent.orgImage = org.images[0];
        this.newEvent.cityCode = org.cityCode;
        this.newEvent.cityName = org.address.city;
      }
    });
  }

  save() {
    this.appService.startLoad('events-add');
    this.buildEvent();
    
    this.eventOrg.images.forEach(image => {
      if(image) this.newEvent.images.push(image);
    });

    this.service.checkCode(this.newEvent.code, this.newEvent.orgCode, this.newEvent.cityCode).subscribe((result) => {
      if(result) {
        this.fg.controls.title.setErrors({});
        this.appService.stopLoad('events-add');
      } else {
        this.service.add(this.newEvent).subscribe((res) => {
          this.appService.stopLoad('events-add');
          this.snackBar.open('Evento adicionada com sucesso!', null, {duration: 2000});
          this.router.navigate([`/events`]);
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
    this.appService.startLoad('events-add-image-'+idx);

    this.uploadService.upload(file, 'events').subscribe(event => {
      if(event.type === HttpEventType.Response) {
        this.newEvent.images[idx] = event.body.gcsPublicUrl;
      }
    }).add(() => this.appService.stopLoad('events-add-image-'+idx));
  }
  
  removeImage(idx: number) {
    this.imgPreview[idx] = null;
    this.files[idx] = null;
  }

  backToList() {
    this.router.navigate([`/events`]);
  }

  tagsOnChange(tagCode:string, isChecked: boolean) { 
    let index = this.tagsFormArray.controls.findIndex(x => x.value == tagCode);
    if(isChecked) {
      if(index === -1) {
        this.tagsFormArray.push(new FormControl(tagCode));
      }
    } else {
      this.tagsFormArray.removeAt(index);
    }
  }
}

