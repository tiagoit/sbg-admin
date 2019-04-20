import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatTable, MatSnackBar } from '@angular/material';
import { ListTagsDataSource } from './list-tags-datasource';
import { TagService } from '../tag.service';
import { Router } from '@angular/router';
import { Tag } from "../../models";
import { DialogConfirm } from '../../angular-material-components/dialog-confirm.component';
import { AppService } from 'app/services/app.service';

@Component({
  selector: 'app-list-tags',
  templateUrl: './list-tags.component.html',
  styleUrls: ['./list-tags.component.scss'],
})
export class ListTagsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  dataSource: ListTagsDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['title', 'childrenTags', 'status', 'featured', 'actions'];

  constructor(private service: TagService, private router: Router, public dialog: MatDialog, public snackBar: MatSnackBar, public appService: AppService) {}

  ngOnInit() { this.get() }

  get(afterDelete?: Boolean) {
    if(!afterDelete) this.appService.startLoad('tags-get');
    this.service.get().subscribe((data: Tag[]) => {
      this.dataSource = new ListTagsDataSource(this.paginator, this.sort, data);
      if(afterDelete) {
        this.appService.stopLoad('tags-delete');
        this.snackBar.open('Tag removida.', null, {duration: 2000});
      } else {
        this.appService.stopLoad('tags-get');
      }
    });
  }

  edit(id: String) { 
    this.appService.startLoad('tags-edit-load-data');
    this.router.navigate([`/tags/edit/${id}`])
  }
  add() { this.router.navigate(['/tags/add'])}

  delete(id: String, title: String) {
    const dialogRef = this.dialog.open(DialogConfirm, {width: '320px', data: {title: title}});
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.appService.startLoad('tags-delete');
        this.service.delete(id).subscribe(() => this.get(true));
      }
    });
  }

  // filter(s: string) {
  //   this.dataSource.filter = s.trim().toLowerCase();
  // }

}
