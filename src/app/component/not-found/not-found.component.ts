import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NotFoundComponent implements OnInit {
  @ViewChild('noInternetModal') private noInternetModalRef: any;

  constructor(public common: CommonService) {}

  ngOnInit(): void {}
}
