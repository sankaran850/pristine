import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "src/app/service/common.service";
import {
  REQUEST_HEADER,
  AUTH_USERNAME,
  AUTH_PASSWORD,
  API,
} from "src/environments/api";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "src/app/service/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  @ViewChild("errorModal") private errorModalRef: any;

  contactName: string = "";
  contactNo: string = "";
  emailId: string = "";
  password: any = "";

  inValidContactName: boolean = false;
  inValidContactNo: boolean = false;
  inValidEmailId: boolean = false;
  inValidPassword: boolean = false;

  unUseContactName: boolean = false;
  unUseContactNo: boolean = false;
  unUseEmailId: boolean = false;
  unUsePassword: boolean = false;

  status: any = "";
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
    this.unUseContactName = true;
    this.unUsePassword = true;
  }

  onKeyUp(event: any, property: string): void {
    if (property === "contactName") {
      if (event.target.value === "") {
        this.inValidContactName = true;
        this.unUseContactName = true;
      } else {
        this.inValidContactName = false;
        this.contactName = event.target.value;
        this.unUseContactName = false;
      }
    }

    if (property === "contactNo") {
      if (!/[0-9]/.test(event.target.value)) {
        this.inValidContactNo = true;
        this.unUseContactNo = true;
      } else {
        this.inValidContactNo = false;
        this.contactNo = event.target.value;
        this.unUseContactNo = false;
      }
    }

    if (property === "emailId") {
      if (!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(event.target.value)) {
        this.inValidEmailId = true;
        this.unUseEmailId = true;
      } else {
        this.emailId = event.target.value;
        this.inValidEmailId = false;
        this.unUseEmailId = false;
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

  handleRegister(event: any) {
    try {
      this.loading = true;
      let headers = new HttpHeaders(REQUEST_HEADER);
      let options = { headers: headers };

      const post = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "Register",
        unique_id: this.common.getUniqueId(),
        EmailId: this.emailId,
        password: this.password,
        PhoneNo: this.contactNo,
        Name: this.contactName,
        gcmid: "",
        type: "IOS 3.0.0",
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
