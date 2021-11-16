import { Component, OnInit, ViewChild } from "@angular/core";
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-winning-gallery",
  templateUrl: "./winning-gallery.component.html",
  styleUrls: ["./winning-gallery.component.css"],
})
export class WinningGalleryComponent implements OnInit {
  @ViewChild("errorModal") private errorModalRef: any;

  loading: boolean = false;
  winningGallery: any = [];

  throttle = 50;
  scrollDistance = 1;

  record_count: number = 10;
  start: number = 1;
  end: number = this.record_count;

  busy = false;
  pageno = 1;

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
    this.getWinningGallery();
  }

  onScrollDown() {
    if (this.busy) return;
    this.busy = true;

    if (this.pageno > 1) {
      this.start = this.end + 1;
      this.end = this.end + this.record_count;
    } else {
      this.start = 0;
      this.end = this.record_count;
      this.busy = true;
    }

    try {
      let headers = new HttpHeaders(REQUEST_HEADER);
      let options = {
        headers: headers,
      };

      const post: any = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "ShowWinnersGallery",
        limit_start: this.start,
        limit_end: this.end,
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { gallery } = res;
        for (let index = 0; index < gallery.length; index++) {
          this.winningGallery.push(gallery[index]);
        }
      });
      this.pageno = this.pageno + 1;
      this.busy = false;
    } catch (error) {
      this.busy = false;
    }
  }

  getWinningGallery(): void {
    try {
      this.loading = true;
      let headers = new HttpHeaders(REQUEST_HEADER);
      let options = {
        headers: headers,
      };

      const post: any = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "ShowWinnersGallery",
        limit_start: 0,
        limit_end: 10,
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { gallery } = res;
        this.winningGallery = gallery;
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
