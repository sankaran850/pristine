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
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ChangePasswordComponent implements OnInit {
  @ViewChild("errorModal") private errorModalRef: any;

  loading: boolean = false;

  userPassword: string = "";
  oldPassword: string = "";
  newPassword: string = "";
  rePassword: string = "";

  inValidOldPassword: boolean = false;
  inValidNewPassword: boolean = false;
  inValidRePassword: boolean = false;

  unUseOldPassword: boolean = true;
  unUseNewPassword: boolean = true;
  unUseRePassword: boolean = true;

  status: any = "";
  message: any = "";
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
    this.getOldPassword();
  }

  getOldPassword(): void {
    try {
      this.loading = true;
      let headers = new HttpHeaders(REQUEST_HEADER);
      let options = {
        headers: headers,
      };

      const post = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "MyAccount",
        member_id: this.common.getMemberId(),
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { MemberDetails }: any = res;
        if (MemberDetails !== false) {
          this.userPassword = MemberDetails.password;
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

  onKeyUp(event: any, property: any): void {
    if (property === "oldPassword") {
      if (
        event.target.value === "" ||
        event.target.value !== this.userPassword
      ) {
        this.inValidOldPassword = true;
        this.unUseOldPassword = true;
        this.oldPassword = "";
      } else {
        this.inValidOldPassword = false;
        this.unUseOldPassword = false;
        this.oldPassword = event.target.value;
      }
    }

    if (property === "newPassword") {
      if (event.target.value === "") {
        this.inValidNewPassword = true;
        this.unUseNewPassword = true;
        this.newPassword = "";
      } else {
        this.inValidNewPassword = false;
        this.unUseNewPassword = false;
        this.newPassword = event.target.value;
      }
    }

    if (property === "rePassword") {
      if (event.target.value === "") {
        this.inValidRePassword = true;
        this.unUseRePassword = true;
        this.rePassword = "";
      } else {
        this.inValidRePassword = false;
        this.unUseRePassword = false;
        this.rePassword = event.target.value;
      }
    }
  }

  handleChangePassword(): void {
    try {
      this.loading = true;

      let headers = new HttpHeaders(REQUEST_HEADER);
      let options = {
        headers: headers,
      };

      const post = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "ChangePassword",
        new_password: this.newPassword,
        member_id: this.common.getMemberId(),
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { status }: any = res;
        if (status === "success") {
          this.status = "success";
          this.message = "Password Changed";
        }

        this.loading = false;
      });
    } catch (error) {
      this.errorMsg = error;
      this.loading = false;
      this.modalService.open(this.errorModalRef, {
        windowClass: "dark-modal",
      });
    }
  }
}
