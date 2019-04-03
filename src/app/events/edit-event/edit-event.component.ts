import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Event, Org } from '../../models';
import { OrgService } from '../../orgs/org.service';
import { UploadService } from '../../services/upload.service';
import { EventService } from "../event.service";
import { AppService } from 'app/services/app.service';

@Component({
  selector: 'app-edit-event',
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

  constructor(private route: ActivatedRoute, private service: EventService, private fb: FormBuilder, private router: Router, public snackBar: MatSnackBar, private orgService: OrgService, public uploadService: UploadService, public appService: AppService) {
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
    this.appService.startLoad('events-edit-load-orgs');
    this.orgService.get().subscribe((orgs: Org[]) => {
      this.appService.stopLoad('events-edit-load-orgs');
      this.orgs = orgs;
    });
    this.event = this.route.snapshot.data.event;
    this.fillForm(this.event);
    this.firstInput.nativeElement.focus();
    this.appService.stopLoad('events-edit-load-data');
  }

  fillForm(storedEvent) {
    this.fg.controls.start.setValue(storedEvent.start);
    this.fg.controls.startTime.setValue(new Date(storedEvent.start).getUTCHours());
    this.fg.controls.org.setValue(storedEvent.org);
    this.fg.controls.title.setValue(storedEvent.title);
    this.fg.controls.description.setValue(storedEvent.description);
    this.fg.controls.featured.setValue(storedEvent.featured);
  }

  update() {
    this.appService.startLoad('events-edit');
    let event: Event = new Event();

    let dateWithTime: Date = new Date(this.fg.controls.start.value);
    dateWithTime.setHours(this.fg.controls.startTime.value);
    event.start = dateWithTime;

    this.orgs.forEach(org => {
      if(org.name === this.fg.controls.org.value) {
        event.org = org.name;
        event.city = org.address.city;
      }
    });

    event._id       = this.event._id;
    event.title     = this.fg.controls.title.value;
    event.description     = this.fg.controls.description.value;
    event.featured  = this.fg.controls.featured.value;

    event.images = this.event.images;

    this.service.update(event).subscribe((res) => {
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
    this.uploadService.upload(file).subscribe(event => {
      if(event.type === HttpEventType.Response) {
        this.event.images[idx] = event.body.gcsPublicUrl;
      }
    }).add(() => this.appService.stopLoad('events-edit-image-'+idx));
    this.uploadService.delete(fileToDeleteUrl);
  }

  cancel() {
    this.router.navigate(['/events']);
  }



}
