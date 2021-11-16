import { Component, OnInit, OnDestroy, ViewEncapsulation } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import {
  REQUEST_HEADER,
  AUTH_USERNAME,
  AUTH_PASSWORD,
  API,
} from "src/environments/api";
import { AuthService } from "src/app/service/auth.service";
import { CommonService } from "src/app/service/common.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-cms",
  templateUrl: "./cms.component.html",
  styleUrls: ["./cms.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class CmsComponent implements OnInit, OnDestroy {
  @ViewChild("errorModal") private errorModalRef: any;

  cms: any = {};
  navigationSubscription: any;
  loading: boolean = false;
  errorMsg: any = "";

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    public common: CommonService,
    public actRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
  }

  initialiseInvites() {
    this.getCms();
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.getCms();
  }

  getCms(): void {
    try {
      this.loading = true;

      let headers = new HttpHeaders(REQUEST_HEADER);
      let options = {
        headers: headers,
      };

      const cms_id: any = this.actRoute.snapshot.params.cms_id;

      const post = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "CMS_Content",
        cms_id,
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        this.cms = res;
        this.loading = false;
      });
    } catch (error) {
      this.errorMsg = error;
      this.loading = false;
      this.modalService.open(this.errorModalRef, {
        windowClass: "dark-modal",
      });
      this.loading = false;
    }
  }
}
