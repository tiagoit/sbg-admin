import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { TagService } from "../tag.service";
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AppService } from 'app/services/app.service';
import { Tag } from 'app/models';

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
  tags: Tag[];
  tagsFormArray: FormArray;

  constructor(private route: ActivatedRoute, private service: TagService, private fb: FormBuilder, private router: Router, public snackBar: MatSnackBar, public appService: AppService) {
    this.fg = fb.group({
      title: ['', Validators.required],
      status: [''],
      featured: [''],
      chidrenTags: fb.array([]),
    });

    this.tagsFormArray = <FormArray>this.fg.controls.chidrenTags;
  }

  ngOnInit() {
    this.tag = this.route.snapshot.data.tag;

    // Get tags
    this.appService.startLoad('events-add-load-tags');
    this.appService.getTags().subscribe((tags: Tag[]) => {
      this.tags = tags.filter(tag => {
        return tag.code !== this.tag.code &&
               tag.childrenTags === undefined || tag.childrenTags.length === 0;;

      });
      this.appService.stopLoad('events-add-load-tags');
    });

    this.storedTitle = this.tag.title;
    this.fillForm();
    this.firstInput.nativeElement.focus();
    this.appService.stopLoad('tags-edit-load-data');
  }

  fillForm() {
    this.fg.controls.title.setValue(this.tag.title);
    this.fg.controls.status.setValue(this.tag.status)
    this.fg.controls.featured.setValue(this.tag.featured)

    this.tag.childrenTags.forEach((tagCode: string) => {
      this.tagsFormArray.push(new FormControl(tagCode));
    });
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
    data['featured'] = this.fg.controls.featured.value;
    data['childrenTags'] = this.fg.controls.chidrenTags.value;

    this.service.update(data).subscribe((res) => {
      this.appService.stopLoad('tags-edit');
      this.snackBar.open('Tag atualizada com sucesso!', null, {duration: 2000});
      this.router.navigate([`/tags`]);
    });
  }

  backToList() {
    this.router.navigate(['/tags']);
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
