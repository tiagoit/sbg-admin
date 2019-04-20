import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Event, Org, Tag } from '../../models';
import { OrgService } from '../../orgs/org.service';
import { UploadService } from '../../services/upload.service';
import { EventService } from "../event.service";
import { AppService } from 'app/services/app.service';
import * as moment from 'moment';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {
  @ViewChild("firstInput") firstInput: ElementRef;
  event: any;
  fg: FormGroup;
  timeOptions = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
  orgs: Org[];
  imgPreview: any[] = [];
  files: File[] = [];
  tags: Tag[];
  tagsFormArray: FormArray;
  eventOrg: Org;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '240px',
    minHeight: '120px',
    placeholder: 'Descrição...',
    translate: 'no',
    showToolbar: false
  };
  
  constructor(private route: ActivatedRoute, private service: EventService, private fb: FormBuilder, private router: Router, public snackBar: MatSnackBar, private orgService: OrgService, public uploadService: UploadService, public appService: AppService) {
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
    // Get orgs.
    this.appService.startLoad('events-edit-load-orgs');
    this.orgService.get().subscribe((orgs: Org[]) => {
      this.appService.stopLoad('events-edit-load-orgs');
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
    this.event = this.route.snapshot.data.event;

    this.fillForm();
    this.appService.stopLoad('events-edit-load-data');
  }

  fillForm() {
    this.fg.controls.start.setValue(this.event.start);
    this.fg.controls.startTime.setValue(new Date(this.event.start).getUTCHours());
    this.fg.controls.org.setValue(this.event.cityCode+'|||'+this.event.orgCode);
    this.fg.controls.title.setValue(this.event.title);
    this.fg.controls.size.setValue(this.event.size);
    this.fg.controls.site.setValue(this.event.site);
    this.fg.controls.description.setValue(this.event.description);
    this.fg.controls.featured.setValue(this.event.featured);
    this.event.tags.forEach((tagCode: string) => {
      this.tagsFormArray.push(new FormControl(tagCode));
    });
  }

  buildEvent(): Event {
    let newEvent: Event = new Event();

    let dateWithTime: Date = new Date(this.fg.controls.start.value);
    dateWithTime.setHours(this.fg.controls.startTime.value);
    newEvent.start = dateWithTime;

    newEvent._id = this.event._id;
    newEvent.title = this.fg.controls.title.value;
    newEvent.size = this.fg.controls.size.value;
    newEvent.site = this.fg.controls.site.value;
    newEvent.description = this.fg.controls.description.value;
    newEvent.featured  = this.fg.controls.featured.value;
    newEvent.tags    = this.fg.controls.tags.value;
    newEvent.images = this.event.images;

    newEvent.code = this.appService.encodeToUrl(newEvent.title).trim() + 
                    moment(newEvent.start).format('-DD-MM-YYYY');

    this.orgs.forEach(org => {
      if((org.cityCode+'|||'+org.code) === this.fg.controls.org.value) {
        this.eventOrg = org;
        newEvent.orgCode = org.code;
        newEvent.orgName = org.name;
        newEvent.cityCode = org.cityCode;
        newEvent.cityName = org.address.city;
      }
    });
    return newEvent;
  }

  changedCode(newEvent: Event) {
    return newEvent.code !== this.event.code;
  }

  changedOrg(newEvent: Event) {
    return newEvent.cityCode !== this.event.cityCode || newEvent.orgCode !== this.event.orgCode;
  }

  onSubmit() {
    this.appService.startLoad('events-edit');
    let newEvent = this.buildEvent();

    this.eventOrg.images.forEach(image => {
      if(image) newEvent.images.push(image);
    });

    if(newEvent.title !== this.event.title || this.changedOrg(newEvent) || this.changedCode(newEvent)) {
      this.service.checkCode(newEvent.code, newEvent.orgCode, newEvent.cityCode).subscribe((result) => {
        if(result) {
          this.fg.controls.title.setErrors({});
          this.appService.stopLoad('events-edit');
        } else {
          this.update(newEvent);
        }
      });
    } else {
      this.update(newEvent);
    }
  }

  update(newEvent: Event) {
    this.service.update(newEvent).subscribe((res) => {
      this.appService.stopLoad('events-edit');
      this.snackBar.open('Evento atualizado com sucesso!', null, {duration: 2000});
      this.router.navigate([`/events`]);
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
    this.appService.startLoad('events-edit-image-'+idx);

    let fileToDeleteUrl = this.event.images[idx];
    this.uploadService.upload(file, 'events').subscribe(event => {
      if(event.type === HttpEventType.Response) {
        this.event.images[idx] = event.body.gcsPublicUrl;
      }
    }).add(() => this.appService.stopLoad('events-edit-image-'+idx));
    this.uploadService.delete(fileToDeleteUrl);
  }

  backToList() {
    this.router.navigate(['/events']);
  }

  tagsOnChange(tagCode:string, isChecked: boolean) { 
    let index = this.tagsFormArray.controls.findIndex(x => x.value == tagCode)
    if(isChecked) {
      if(index === -1) {
        this.tagsFormArray.push(new FormControl(tagCode));
      }
    } else {
      this.tagsFormArray.removeAt(index);
    }
  }

  checkTag(tagCode: String): Boolean {
    return this.tagsFormArray.controls.findIndex(x => x.value === tagCode) !== -1
  }
}
