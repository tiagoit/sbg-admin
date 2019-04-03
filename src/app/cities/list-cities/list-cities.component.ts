import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatTable, MatSnackBar } from '@angular/material';
import { ListCitiesDataSource } from './list-cities-datasource';
import { CityService } from '../city.service';
import { Router } from '@angular/router';
import { City } from "../../models";
import { DialogConfirm } from '../../angular-material-components/dialog-confirm.component';
import { AppService } from 'app/services/app.service';

@Component({
  selector: 'app-list-cities',
  templateUrl: './list-cities.component.html',
  styleUrls: ['./list-cities.component.scss'],
})
export class ListCitiesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  dataSource: ListCitiesDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'actions'];

  constructor(private service: CityService, private router: Router, public dialog: MatDialog, public snackBar: MatSnackBar, public appService: AppService) {}

  ngOnInit() { this.get() }

  get(afterDelete?: Boolean) {
    if(!afterDelete) this.appService.startLoad('cities-get');
    this.service.get().subscribe((data: City[]) => {
      this.dataSource = new ListCitiesDataSource(this.paginator, this.sort, data);
      if(afterDelete) {
        this.appService.stopLoad('cities-delete');
        this.snackBar.open('Cidade removida.', null, {duration: 2000});
      } else {
        this.appService.stopLoad('cities-get');
      }
    });
  }

  edit(id: String) { 
    this.appService.startLoad('cities-edit-load-data');
    this.router.navigate([`/cities/edit/${id}`])
  }
  add() { this.router.navigate(['/cities/add'])}

  delete(id: String, title: String) {
    const dialogRef = this.dialog.open(DialogConfirm, {width: '320px', data: {title: title}});
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.appService.startLoad('cities-delete');
        this.service.delete(id).subscribe(() => this.get(true));
      }
    });
  }

  // filter(s: string) {
  //   this.dataSource.filter = s.trim().toLowerCase();
  // }

}
