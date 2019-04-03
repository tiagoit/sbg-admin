import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatTable, MatSnackBar } from '@angular/material';
import { ListEventsDataSource } from './list-events-datasource';
import { EventService } from '../event.service';
import { Router } from '@angular/router';
import { Event } from "../../models";
import { DialogConfirm } from '../../angular-material-components/dialog-confirm.component';
import { AppService } from 'app/services/app.service';

@Component({
  selector: 'app-list-events',
  templateUrl: './list-events.component.html',
  styleUrls: ['./list-events.component.scss'],
})
export class ListEventsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  dataSource: ListEventsDataSource;
  
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['start', 'org', 'city', 'title', 'actions'];

  constructor(private service: EventService, private router: Router, public dialog: MatDialog, public snackBar: MatSnackBar, public appService: AppService) {}

  ngOnInit() { this.get() }

  get(afterDelete?: Boolean) {
    if(!afterDelete) this.appService.startLoad('events-get');
    this.service.get().subscribe((data: Event[]) => {
      this.dataSource = new ListEventsDataSource(this.paginator, this.sort, data);
      if(afterDelete) {
        this.appService.stopLoad('events-delete');
        this.snackBar.open('Evento removido.', null, {duration: 2000});
      } else {
        this.appService.stopLoad('events-get');
      }
    });
  }

  edit(id: String) { 
    this.appService.startLoad('events-edit-load-data');
    this.router.navigate([`/events/edit/${id}`])
  }
  add() { this.router.navigate(['/events/add'])}

  delete(id: String, title: String) {
    const dialogRef = this.dialog.open(DialogConfirm, {width: '320px', data: {title: title}});
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.appService.startLoad('events-delete');
        this.service.delete(id).subscribe(() => this.get(true));
      }
    });
  }

  // filter(s: string) {
  //   this.dataSource.filter = s.trim().toLowerCase();
  // }

}