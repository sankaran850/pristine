import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";

import * as moment from "moment";

import { AuthService } from "src/app/service/auth.service";
import { CommonService } from "src/app/service/common.service";

import {
  AUTH_USERNAME,
  AUTH_PASSWORD,
  REQUEST_HEADER,
  API,
} from "src/environments/api";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ViewChild } from "@angular/core";

@Component({
  selector: "app-competitions-listing",
  templateUrl: "./competitions-listing.component.html",
  styleUrls: ["./competitions-listing.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class CompetitionsListingComponent implements OnInit {
  @ViewChild("errorModal") private errorModalRef: any;

  competionList: any = [];
  days: any = [];
  hours: any = [];
  minutes: any = [];
  seconds: any = [];

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
    this.authService.authenticateUser();
    this.getCompetitionsList();
  }

  x(date: any, i: any): void {
    setInterval(() => {
      const now = moment();
      const expirydate = moment(date);
      const diffr: any = moment.duration(expirydate.diff(now));
      if (diffr > 0) {
        const days: any = parseInt(diffr.asDays());
        const hours: any = parseInt(diffr.asHours()) - days * 24;
        const minutes: any = parseInt(diffr.minutes());
        const seconds: any = parseInt(diffr.seconds());

        this.days[i] = days < 10 ? "0" + days : days;
        this.hours[i] = hours < 10 ? "0" + hours : hours;
        this.minutes[i] = minutes < 10 ? "0" + minutes : minutes;
        this.seconds[i] = seconds < 10 ? "0" + seconds : seconds;
      } else {
        this.days[i] = "00";
        this.hours[i] = "00";
        this.minutes[i] = "00";
        this.seconds[i] = "00";
      }
      //this.date[i] = hours * 60 * 60 + minutes * 60 + seconds;
    });
  }

  getCompetitionsList(): void {
    try {
      this.loading = true;
      let headers = new HttpHeaders(REQUEST_HEADER);
      let options = {
        headers: headers,
      };

      const post: any = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "CompetitionsList",
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { result } = res;
        this.competionList = result;
        this.loading = false;
        for (let index = 0; index < result.length; index++) {
          this.x(result[index].end_date, index);
        }
      });
    } catch (error) {
      this.errorMsg = error.message;
      this.loading = false;
      setTimeout(() => {
        this.modalService.open(this.errorModalRef, {
          windowClass: "dark-modal",
        });
      }, 1000);
    }
  }

  competitionDetail(pro_id: any): void {
    this.router.navigate(["view-competition", pro_id]);
  }
}
