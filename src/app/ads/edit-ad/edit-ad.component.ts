import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdService } from "../ad.service";
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AppService } from 'app/services/app.service';
import { Ad } from '../ad.model';
import { UploadService } from 'app/services/upload.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-edit-ad',
  templateUrl: './edit-ad.component.html',
  styleUrls: ['./edit-ad.component.scss']
})
export class EditAdComponent implements OnInit {
  @ViewChild("firstInput") firstInput: ElementRef;
  ad: any;
  fg: FormGroup;
  imgPreview: any;
  files: File[] = [];

  constructor(
    private route: ActivatedRoute,
    private service: AdService,
    private fb: FormBuilder,
    private router: Router,
    public snackBar: MatSnackBar,
    public appService: AppService,
    public uploadService: UploadService) {
    this.fg = fb.group({
      title: ['', Validators.required],
      description: [''],
      type: [''],
      empresa: [''],
      ctaLink: [''],
      ctaLabel: [''],
      phone: [''],  
      whatsapp: [''],
      instagram: [''],
      facebook: [''],
      status: [''],
      image: [''],
      start: ['', Validators.required],
      end: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.ad = this.route.snapshot.data.ad;
    this.fillForm();
    this.firstInput.nativeElement.focus();
    this.appService.stopLoad('ads-edit-load-data');
  }

  fillForm() {
    this.fg.controls.title.setValue(this.ad.title);
    this.fg.controls.description.setValue(this.ad.description);
    this.fg.controls.type.setValue(this.ad.type);
    this.fg.controls.empresa.setValue(this.ad.empresa);
    this.fg.controls.ctaLink.setValue(this.ad.ctaLink);
    this.fg.controls.ctaLabel.setValue(this.ad.ctaLabel);
    this.fg.controls.phone.setValue(this.ad.phone);
    this.fg.controls.whatsapp.setValue(this.ad.whatsapp);
    this.fg.controls.instagram.setValue(this.ad.instagram);
    this.fg.controls.facebook.setValue(this.ad.facebook);
    this.fg.controls.status.setValue(this.ad.status);
    this.fg.controls.start.setValue(this.ad.start);
    this.fg.controls.end.setValue(this.ad.end);
  }

  onSubmit() {
    this.appService.startLoad('ads-edit');
    let newAd: Ad = new Ad();
    newAd._id = this.ad._id;
    newAd.title = this.fg.controls.title.value;
    newAd.description = this.fg.controls.description.value;
    newAd.type = this.fg.controls.type.value;
    newAd.empresa = this.fg.controls.empresa.value;
    newAd.ctaLink = this.fg.controls.ctaLink.value;
    newAd.ctaLabel = this.fg.controls.ctaLabel.value;
    newAd.phone = this.fg.controls.phone.value;
    newAd.whatsapp = this.fg.controls.whatsapp.value;
    newAd.instagram = this.fg.controls.instagram.value;
    newAd.facebook = this.fg.controls.facebook.value;
    newAd.start = this.fg.controls.start.value;
    newAd.end = this.fg.controls.end.value;
    newAd.image = this.ad.image;

    this.service.update(newAd).subscribe((res) => {
      this.appService.stopLoad('ads-edit');
      this.snackBar.open('Anúncio atualizado com sucesso!', null, {duration: 2000});
      this.router.navigate([`/anuncios`]);
    });
  }


  preview(files: File[], idx: number) {
    if (files.length === 0) return;

    this.files[idx] = files[0];

    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgPreview = reader.result;
    }

    this.upload(files[0], idx);
  }

  upload(file: File, idx: number) {
    this.appService.startLoad('ads-edit-image-'+idx);
    console.log('upload 1');

    let fileToDeleteUrl = this.ad.image;
    this.uploadService.upload(file, 'ads').subscribe(event => {
      console.log('upload 2');
      if(event.type === HttpEventType.Response) {
        this.ad.image = event.body.gcsPublicUrl;
        console.log('upload 3', event.body.gcsPublicUrl);
      }
    }).add(() => this.appService.stopLoad('ads-edit-image-'+idx));
    this.uploadService.delete(fileToDeleteUrl);
  }


  backToList() {
    this.router.navigate(['/anuncios']);
  }

}
