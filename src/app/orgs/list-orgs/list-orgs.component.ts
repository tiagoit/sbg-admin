import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatTable, MatSnackBar } from '@angular/material';
import { ListOrgsDataSource } from './list-orgs-datasource';
import { OrgService } from '../org.service';
import { Router } from '@angular/router';
import { Org } from "../../models";
import { DialogConfirm } from '../../angular-material-components/dialog-confirm.component';
import { AppService } from 'app/services/app.service';

@Component({
  selector: 'app-list-orgs',
  templateUrl: './list-orgs.component.html',
  styleUrls: ['./list-orgs.component.scss'],
})
export class ListOrgsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  dataSource: ListOrgsDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'city', 'mobile', 'status', 'actions'];

  constructor(private service: OrgService, private router: Router, public dialog: MatDialog, public snackBar: MatSnackBar, public appService: AppService) {}

  ngOnInit() { this.get() }

  get(afterDelete?: Boolean) {
    if(!afterDelete) this.appService.startLoad('orgs-get');
    this.service.get().subscribe((data: Org[]) => {
      this.dataSource = new ListOrgsDataSource(this.paginator, this.sort, data);
      if(afterDelete) {
        this.appService.stopLoad('orgs-delete');
        this.snackBar.open('Organização removida.', null, {duration: 2000});
      } else {
        this.appService.stopLoad('orgs-get');
      }
    });
  }

  edit(id: String) { 
    this.appService.startLoad('orgs-edit-load-data');
    this.router.navigate([`/orgs/edit/${id}`]);
  }
  add() { this.router.navigate(['/orgs/add'])}

  delete(id: String, title: String) {
    const dialogRef = this.dialog.open(DialogConfirm, {width: '320px', data: {title: title}});
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.appService.startLoad('orgs-delete');
        this.service.delete(id).subscribe(() => {
          this.get(true)
        }, (e) => {
          this.snackBar.open(e.error.message, null, {duration: 5000});
          this.appService.stopLoad('orgs-delete');
        });
      }
    });
  }

  // filter(s: string) {
  //   this.dataSource.filter = s.trim().toLowerCase();
  // }

}
