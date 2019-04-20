import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { TagService } from '../tag.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AppService } from 'app/services/app.service';
import { Tag } from 'app/models';

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.scss']
})
export class AddTagComponent implements OnInit {
  @ViewChild("firstInput") firstInput: ElementRef;
  fg: FormGroup;
  tags: Tag[];
  tagsFormArray: FormArray;

  constructor(fb: FormBuilder, private service: TagService, private router: Router, public snackBar: MatSnackBar, public appService: AppService) {
    this.fg = fb.group({
      title: ['', Validators.required],
      status: [true],
      featured: [false],
      childrenTags: fb.array([]),
    });

    this.tagsFormArray = <FormArray>this.fg.controls.childrenTags;
  }

  ngOnInit() {
    // Get tags
    this.appService.startLoad('tags-add-load-tags');
    this.appService.getTags().subscribe((tags: Tag[]) => {
      this.tags = tags.filter(tag => {
        return tag.childrenTags === undefined || tag.childrenTags.length === 0;
      });
      this.appService.stopLoad('tags-add-load-tags');
    });

    this.firstInput.nativeElement.focus();
  }

  save() {
    this.appService.startLoad('tags-add');
    let data = {};
    data['title']  = this.fg.controls.title.value;
    data['status'] = this.fg.controls.status.value || false;
    data['featured'] = this.fg.controls.featured.value || false;
    data['childrenTags'] = this.fg.controls.childrenTags.value || false;

    this.service.checkCode(this.appService.encodeToUrl(data['title'])).subscribe((result) => {
      if(result) {
        this.fg.controls.title.setErrors({});
        this.appService.stopLoad('tags-add');
      } else {
        this.service.add(data).subscribe((res) => {
          this.appService.stopLoad('tags-add');
          this.snackBar.open('Tag adicionada com sucesso!', null, {duration: 2000});
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

