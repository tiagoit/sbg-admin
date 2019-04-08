import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TagService } from '../tag.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AppService } from 'app/services/app.service';

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.scss']
})
export class AddTagComponent implements OnInit {
  @ViewChild("firstInput") firstInput: ElementRef;
  fg: FormGroup;

  constructor(fb: FormBuilder, private service: TagService, private router: Router, public snackBar: MatSnackBar, public appService: AppService) {
    this.fg = fb.group({
      title: ['', Validators.required],
      status: [true]
    });
  }

  ngOnInit() {
    this.firstInput.nativeElement.focus();
  }

  save() {
    this.appService.startLoad('tags-add');
    let data = {};
    data['title']  = this.fg.controls.title.value;
    data['status'] = this.fg.controls.status.value ? true : false;

    this.service.checkCode(this.appService.encodeToUrl(data['title'])).subscribe((result) => {
      if(result) {
        this.fg.controls.title.setErrors({});
        this.appService.stopLoad('tags-add');
      } else {
        this.service.add(data).subscribe((res) => {
          this.appService.stopLoad('tags-add');
          this.snackBar.open('Cidade adicionada com sucesso!', null, {duration: 2000});
          this.router.navigate([`/tags`]);
        })
      }
    });


    // this.service.add(data).subscribe((res) => {
    //   this.appService.stopLoad('tags-add');
    //   this.snackBar.open('Tag adicionada com sucesso!', null, {duration: 2000});
    //   this.router.navigate([`/tags`]);
    // })
  }

  backToList() {
    this.router.navigate(['/tags']);
  }
}

