import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatTable, MatSnackBar } from '@angular/material';
import { ListRegionsDataSource } from './list-regions.datasource';
import { RegionService } from '../region.service';
import { Router } from '@angular/router';
import { Region } from "../region.model";
import { DialogConfirm } from '../../angular-material-components/dialog-confirm.component';
import { AppService } from 'app/services/app.service';

@Component({
  selector: 'app-list-regions',
  templateUrl: './list-regions.component.html',
  styleUrls: ['./list-regions.component.scss'],
})
export class ListRegionsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  dataSource: ListRegionsDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'status', 'actions'];

  constructor(private service: RegionService, private router: Router, public dialog: MatDialog, public snackBar: MatSnackBar, public appService: AppService) {}

  ngOnInit() { this.get() }

  get(afterDelete?: Boolean) {
    if(!afterDelete) this.appService.startLoad('regions-get');
    this.service.get().subscribe((data: Region[]) => {
      this.dataSource = new ListRegionsDataSource(this.paginator, this.sort, data);
      if(afterDelete) {
        this.appService.stopLoad('regions-delete');
        this.snackBar.open('Cidade removida.', null, {duration: 2000});
      } else {
        this.appService.stopLoad('regions-get');
      }
    });
  }

  edit(id: String) { 
    this.appService.startLoad('regions-edit-load-data');
    this.router.navigate([`/regions/edit/${id}`])
  }
  add() { this.router.navigate(['/regions/add'])}

  delete(id: String, title: String) {
    const dialogRef = this.dialog.open(DialogConfirm, {width: '320px', data: {title: title}});
    dialogRef.afterClosed().subscribe(res => {
      if(res) {
        this.appService.startLoad('regions-delete');
        this.service.delete(id).subscribe(() => {
          this.get(true)
        }, (e) => {
          this.snackBar.open(e.error.message, null, {duration: 5000});
          this.appService.stopLoad('regions-delete');
        });
      }
    });
  }

  // filter(s: string) {
  //   this.dataSource.filter = s.trim().toLowerCase();
  // }

}
