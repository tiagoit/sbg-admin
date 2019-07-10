import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatTable, MatSnackBar } from '@angular/material';
import { ListAdsDataSource } from './list-ads.datasource';
import { AdService } from '../ad.service';
import { Router } from '@angular/router';
import { Ad } from "../ad.model";
import { DialogConfirm } from '../../angular-material-components/dialog-confirm.component';
import { AppService } from 'app/services/app.service';

@Component({
  selector: 'app-list-ads',
  templateUrl: './list-ads.component.html',
  styleUrls: ['./list-ads.component.scss'],
})
export class ListAdsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  dataSource: ListAdsDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['title', 'type', 'status', 'actions'];

  constructor(private service: AdService, private router: Router, public dialog: MatDialog, public snackBar: MatSnackBar, public appService: AppService) {}

  ngOnInit() { this.get() }

  get(afterDelete?: Boolean) {
    if(!afterDelete) this.appService.startLoad('ads-get');
    this.service.get().subscribe((data: Ad[]) => {
      this.dataSource = new ListAdsDataSource(this.paginator, this.sort, data);
      if(afterDelete) {
        this.appService.stopLoad('ads-delete');
        this.snackBar.open('Anúncio removido.', null, {duration: 2000});
      } else {
        this.appService.stopLoad('ads-get');
      }
    });
  }

  edit(id: String) { 
    this.appService.startLoad('ads-edit-load-data');
    this.router.navigate([`/anuncios/edit/${id}`])
  }
  add() { this.router.navigate(['/anuncios/add'])}

  delete(id: String, title: String) {
    const dialogRef = this.dialog.open(DialogConfirm, {width: '320px', data: {title: title}});
    dialogRef.afterClosed().subscribe(res => {
      if(res) {
        this.appService.startLoad('ads-delete');
        this.service.delete(id).subscribe(() => {
          this.get(true)
        }, (e) => {
          this.snackBar.open(e.error.message, null, {duration: 5000});
          this.appService.stopLoad('ads-delete');
        });
      }
    });
  }
}
