import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatTable, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { DialogConfirm } from '../../angular-material-components/dialog-confirm.component';
import { ListPartnersDataSource } from './list-partners-datasource';
import { AppService } from 'app/services/app.service';
import { PartnerService } from '../partner.service';
import { Partner } from "../partner.model";

@Component({
  selector: 'app-list-partners',
  templateUrl: './list-partners.component.html',
  styleUrls: ['./list-partners.component.scss'],
})
export class ListPartnersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  dataSource: ListPartnersDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'email', 'role', 'status', 'actions'];

  constructor(private service: PartnerService, private router: Router, public dialog: MatDialog, public snackBar: MatSnackBar, public appService: AppService) {}

  ngOnInit() { this.get() }

  get(afterDelete?: Boolean) {
    if(!afterDelete) this.appService.startLoad('partners-get');
    this.service.get().subscribe((data: Partner[]) => {
      this.dataSource = new ListPartnersDataSource(this.paginator, this.sort, data);
      if(afterDelete) {
        this.appService.stopLoad('partners-delete');
        this.snackBar.open('Parceiro removido.', null, {duration: 2000});
      } else {
        this.appService.stopLoad('partners-get');
      }
    });
  }

  edit(id: String) { 
    this.appService.startLoad('partners-edit-load-data');
    this.router.navigate([`/partners/edit/${id}`])
  }
  add() { this.router.navigate(['/partners/add'])}

  delete(id: String, title: String) {
    const dialogRef = this.dialog.open(DialogConfirm, {width: '320px', data: {title: title}});
    dialogRef.afterClosed().subscribe(res => {
      if(res) {
        this.appService.startLoad('partners-delete');
        this.service.delete(id).subscribe(() => {
          this.get(true)
        }, (e) => {
          this.snackBar.open(e.error.message, null, {duration: 5000});
          this.appService.stopLoad('partners-delete');
        });
      }
    });
  }

  getRoleNameByCode(roleCode) {
    if(!roleCode) return null;
    return this.service.roles.find(r => r.code === roleCode).name;
  }

  // filter(s: string) {
  //   this.dataSource.filter = s.trim().toLowerCase();
  // }

}
