import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import {
  API,
  REQUEST_HEADER,
  AUTH_USERNAME,
  AUTH_PASSWORD,
} from "src/environments/api";
import { CommonService } from "src/app/service/common.service";
import { AuthService } from "src/app/service/auth.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  @ViewChild("errorModal") private errorModalRef: any;

  userName: string = "";
  password: string = "";

  inValidUserName: boolean = false;
  inValidPassword: boolean = false;

  unUseUserName: boolean = false;
  unUsePassword: boolean = false;

  status: string = "";
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
    this.unUseUserName = true;
    this.unUsePassword = true;
  }
  ngOnInit(): void {}

  onKeyUp(event: any, property: string): void {
    if (property === "userName") {
      if (event.target.value === "") {
        this.inValidUserName = true;
        this.unUseUserName = true;
      } else {
        this.inValidUserName = false;
        this.userName = event.target.value;
        this.unUseUserName = false;
      }
    }

    if (property === "password") {
      if (event.target.value === "") {
        this.inValidPassword = true;
        this.unUsePassword = true;
      } else {
        this.password = event.target.value;
        this.inValidPassword = false;
        this.unUsePassword = false;
      }
    }
  }

  handleLogin(event: any) {
    try {
      this.loading = true;
      let headers = new HttpHeaders(REQUEST_HEADER);
      let options = { headers: headers };

      const post = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "Login",
        Email: this.userName,
        password: this.password,
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { status }: any = res;

        if (status === "success") {
          const { mem_id }: any = res;
          localStorage.setItem("pristine_member_id", mem_id);
          this.router.navigate(["/my-account"]);
        } else {
          this.status = status;
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
