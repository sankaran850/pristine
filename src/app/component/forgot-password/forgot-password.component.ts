import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "src/app/service/auth.service";
import { CommonService } from "src/app/service/common.service";

import {
  REQUEST_HEADER,
  AUTH_USERNAME,
  AUTH_PASSWORD,
  API,
} from "src/environments/api";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ForgotPasswordComponent implements OnInit {
  @ViewChild("errorModal") private errorModalRef: any;

  emailId: string = "";

  inValidEmailId: boolean = false;

  unUseEmailId: boolean = true;

  status: any = "";
  message: any = "";

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

  ngOnInit(): void {}

  onKeyUp(event: any, property: string): void {
    if (property === "emailId") {
      if (!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(event.target.value)) {
        this.emailId = "";
        this.inValidEmailId = true;
        this.unUseEmailId = true;
      } else {
        this.emailId = event.target.value;
        this.inValidEmailId = false;
        this.unUseEmailId = false;
      }
    }
  }

  sendEmail(): void {
    try {
      this.loading = true;
      let headers = new HttpHeaders(REQUEST_HEADER);
      let options = {
        headers: headers,
      };

      const post = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "ForgetPassword",
        Email: this.emailId,
        testing_from: "app",
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { mail_status, status }: any = res;
        if (mail_status === "mail_sent" && status === "success") {
          this.message = "Check your email";
          this.status = status;
        } else {
          this.message = "Try again contact admin";
          this.status = "danger";
        }
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
