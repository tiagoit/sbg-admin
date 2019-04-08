import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TagService } from "../tag.service";
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AppService } from 'app/services/app.service';

@Component({
  selector: 'app-edit-tag',
  templateUrl: './edit-tag.component.html',
  styleUrls: ['./edit-tag.component.scss']
})
export class EditTagComponent implements OnInit {
  @ViewChild("firstInput") firstInput: ElementRef;
  tag: any;
  fg: FormGroup;
  storedTitle: String;

  constructor(private route: ActivatedRoute, private service: TagService, private fb: FormBuilder, private router: Router, public snackBar: MatSnackBar, public appService: AppService) {
    this.fg = fb.group({
      title: ['', Validators.required],
      status: ['']
    });
  }

  ngOnInit() {
    this.tag = this.route.snapshot.data.tag;
    this.storedTitle = this.tag.title;
    this.fillForm();
    this.firstInput.nativeElement.focus();
    this.appService.stopLoad('tags-edit-load-data');
  }

  fillForm() {
    this.fg.controls.title.setValue(this.tag.title);
    this.fg.controls.status.setValue(this.tag.status)
  }

  onSubmit() {
    this.appService.startLoad('tags-edit');

    if(this.fg.controls.title.value !== this.storedTitle) {
      this.service.checkCode(this.appService.encodeToUrl(this.fg.controls.title.value)).subscribe((result) => {
        if(result) {
          this.fg.controls.title.setErrors({});
          this.appService.stopLoad('tags-edit');
        } else {
          this.update();
        }
      });
    } else {
      this.update();
    }
  }

  update() {
    let data = {};
    data['_id'] = this.tag._id;
    data['title'] = this.fg.controls.title.value;
    data['status'] = this.fg.controls.status.value;

    this.service.update(data).subscribe((res) => {
      this.appService.stopLoad('tags-edit');
      this.snackBar.open('Tag atualizada com sucesso!', null, {duration: 2000});
      this.router.navigate([`/tags`]);
    });
  }

  backToList() {
    this.router.navigate(['/tags']);
  }

}
