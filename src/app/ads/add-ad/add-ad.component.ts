import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdService } from '../ad.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AppService } from 'app/services/app.service';
import { UploadService } from 'app/services/upload.service';
import { HttpEventType } from '@angular/common/http';
import { Ad } from '../ad.model';

@Component({
  selector: 'app-add-ad',
  templateUrl: './add-ad.component.html',
  styleUrls: ['./add-ad.component.scss']
})
export class AddAdComponent implements OnInit {
  @ViewChild("firstInput") firstInput: ElementRef;
  fg: FormGroup;
  imgPreview: any[] = [];
  files: File[] = [];
  newAd: Ad = new Ad();

  constructor(
    fb: FormBuilder,
    private service: AdService,
    private router: Router,
    public snackBar: MatSnackBar,
    public appService: AppService,
    public uploadService: UploadService) {
      this.fg = fb.group({
        title: ['', Validators.required],
        description: [''],
        type: ['', Validators.required],
        empresa: [''],
        ctaLink: [''],
        ctaLabel: [''],
        phone: [''],
        whatsapp: [''],
        instagram: [''],
        facebook: [''],
        status: [true],
        start: ['', Validators.required],
        end: ['', Validators.required],
      });
      
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.firstInput.nativeElement.focus();
  }

  save() {
    this.appService.startLoad('ads-add');
    this.newAd.title = this.fg.controls.title.value;
    this.newAd.description = this.fg.controls.description.value;
    this.newAd.type = this.fg.controls.type.value;
    this.newAd.empresa = this.fg.controls.empresa.value;
    this.newAd.ctaLink = this.fg.controls.ctaLink.value;
    this.newAd.ctaLabel = this.fg.controls.ctaLabel.value;
    this.newAd.phone = this.fg.controls.phone.value;
    this.newAd.whatsapp = this.fg.controls.whatsapp.value;
    this.newAd.instagram = this.fg.controls.instagram.value;
    this.newAd.facebook = this.fg.controls.facebook.value;
    this.newAd.status = this.fg.controls.status.value ? true : false;
    this.newAd.start = this.fg.controls.start.value;
    this.newAd.end = this.fg.controls.end.value;

    this.service.add(this.newAd).subscribe((res) => {
      this.appService.stopLoad('ads-add');
      this.snackBar.open('Anúncio adicionado com sucesso!', null, {duration: 2000});
      this.router.navigate([`/anuncios`]);
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
    this.appService.startLoad('ads-add-image-'+idx);

    this.uploadService.upload(file, 'ads').subscribe(event => {
      if(event.type === HttpEventType.Response) {
        this.newAd.image = event.body.gcsPublicUrl;
      }
    }).add(() => this.appService.stopLoad('ads-add-image-'+idx));
  }
  

  backToList() {
    this.router.navigate(['/anuncios']);
  }
}

