import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";

import { AuthService } from "src/app/service/auth.service";
import { CommonService } from "src/app/service/common.service";

import {
  AUTH_USERNAME,
  AUTH_PASSWORD,
  REQUEST_HEADER,
  API,
} from "src/environments/api";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-entry-list",
  templateUrl: "./entry-list.component.html",
  styleUrls: ["./entry-list.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class EntryListComponent implements OnInit {
  @ViewChild("errorModal") private errorModalRef: any;

  entryList: any = [];

  loading: boolean = false;
  errorMsg: any = "";

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    public common: CommonService,
    public actRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getEntryList();
  }

  getEntryList(): void {
    try {
      this.loading = true;
      let headers = new HttpHeaders(REQUEST_HEADER);
      let options = {
        headers: headers,
      };

      const post: any = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "EntryList",
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { comps } = res;
        this.entryList = comps;
        this.loading = false;
      });
    } catch (error) {
      this.errorMsg = error;
      this.loading = false;
      setTimeout(() => {
        this.modalService.open(this.errorModalRef, {
          windowClass: "dark-modal",
        });
      }, 1000);
    }
  }
}
