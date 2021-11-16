import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonService } from "src/app/service/common.service";
import { AuthService } from "src/app/service/auth.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  AUTH_USERNAME,
  AUTH_PASSWORD,
  REQUEST_HEADER,
  API,
} from "src/environments/api";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-my-account",
  templateUrl: "./my-account.component.html",
  styleUrls: ["./my-account.component.css"],
})
export class MyAccountComponent implements OnInit {
  @ViewChild("errorModal") private errorModalRef: any;

  countryOptions: any = [];

  mem_id: any = "";
  mem_name: string = "";
  mem_lname: string = "";
  email_id: string = "";
  mobile_no: string = "";
  address_line1: string = "";
  address_line2: string = "";
  city: string = "";
  state: string = "";
  postCode: any = "";
  country: string = "";

  inValidMobileNo: boolean = false;
  inValidMemlName: boolean = false;
  inValidMemName: boolean = false;
  inValidEmailId: boolean = false;
  inValidAddressLine1: boolean = false;
  inValidAddressLine2: boolean;
  inValidCity: boolean = false;
  inValidState: boolean = false;
  inValidPostCode: boolean = false;
  inValidCountry: boolean = false;

  unUseMemlName: boolean = true;
  unUseMemName: boolean = true;
  unUseEmailId: boolean = true;
  unUseMobileNo: boolean = true;
  unUseAddressLine1: boolean = true;
  unUseAddressLine2: boolean = true;
  unUseCity: boolean = true;
  unUseState: boolean = true;
  unUsePostCode: boolean = true;
  unUseCountry: boolean = true;

  disableEmailId = false;

  status: string = "";
  message: string = "";

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
    const member_id = this.common.getMemberId();
    if (member_id !== 0) {
      this.getUserProfile();
    }
  }

  onKeyUp(event: any, property: string): void {
    if (property === "firstName") {
      if (event.target.value === "") {
        this.inValidMemName = true;
        this.unUseMemName = true;
        this.mem_name = "";
      } else {
        this.mem_name = event.target.value;
        this.inValidMemName = false;
        this.unUseMemName = false;
      }
    }

    if (property === "lastName") {
      if (event.target.value === "") {
        this.inValidMemlName = true;
        this.unUseMemlName = true;
        this.mem_lname = "";
      } else {
        this.mem_lname = event.target.value;
        this.inValidMemlName = false;
        this.unUseMemlName = false;
      }
    }

    if (property === "emailId") {
      if (!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(event.target.value)) {
        this.inValidEmailId = true;
        this.unUseEmailId = true;
        this.email_id = "";
      } else {
        this.email_id = event.target.value;
        this.inValidEmailId = false;
        this.unUseEmailId = false;
      }
    }

    if (property === "mobileNo") {
      if (!/^[0-9]*$/.test(event.target.value) || event.target.value === "") {
        this.inValidMobileNo = true;
        this.unUseMobileNo = true;
        this.mobile_no = "";
      } else {
        this.mobile_no = event.target.value;
        this.inValidMobileNo = false;
        this.unUseMobileNo = false;
      }
    }

    if (property === "addressLine1") {
      if (event.target.value === "") {
        this.inValidAddressLine1 = true;
        this.unUseAddressLine1 = true;
        this.address_line1 = "";
      } else {
        this.address_line1 = event.target.value;
        this.inValidAddressLine1 = false;
        this.unUseAddressLine1 = false;
      }
    }

    if (property === "addressLine2") {
      if (event.target.value === "") {
        this.inValidAddressLine2 = true;
        this.unUseAddressLine2 = true;
        this.address_line2 = "";
      } else {
        this.address_line2 = event.target.value;
        this.inValidAddressLine2 = false;
        this.unUseAddressLine2 = false;
      }
    }

    if (property === "city") {
      if (event.target.value === "") {
        this.inValidCity = true;
        this.unUseCity = true;
        this.city = "";
      } else {
        this.city = event.target.value;
        this.inValidCity = false;
        this.unUseCity = false;
      }
    }

    if (property === "state") {
      if (event.target.value === "") {
        this.inValidState = true;
        this.unUseState = true;
        this.state = "";
      } else {
        this.state = event.target.value;
        this.inValidState = false;
        this.unUseState = false;
      }
    }

    if (property === "postCode") {
      if (event.target.value === "") {
        this.inValidPostCode = true;
        this.unUsePostCode = true;
        this.postCode = "";
      } else {
        this.postCode = event.target.value;
        this.inValidPostCode = false;
        this.unUsePostCode = false;
      }
    }

    if (property === "country") {
      if (event.target.value === "") {
        this.inValidCountry = true;
        this.unUseCountry = true;
        this.country = "";
      } else {
        this.country = event.target.value;
        this.inValidCountry = false;
        this.unUseCountry = false;
      }
    }
  }

  handleUpdate(event: any): void {
    try {
      this.loading = true;
      let headers: any = new HttpHeaders(REQUEST_HEADER);
      let options: any = {
        headers: headers,
      };

      const post: any = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "UpdateAccount",
        mem_name: this.mem_name,
        mem_lname: this.mem_lname,
        mobile_no: this.mobile_no,
        address_line1: this.address_line1,
        address_line2: this.address_line2,
        city: this.city,
        state: this.state,
        postcode: this.postCode,
        country: this.country,
        member_id: this.common.getMemberId(),
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { status }: any = res;
        if (status === "success") {
          this.message = "Account updated";
          this.status = "success";
        } else {
          this.message = status;
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

  getUserProfile(): void {
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
        const { MemberDetails, country_options }: any = res;
        if (MemberDetails !== false) {
          this.mem_id = MemberDetails.mem_id;
          this.mem_name = MemberDetails.mem_name;
          this.mem_lname = MemberDetails.mem_lname;
          this.email_id = MemberDetails.email_id;
          this.mobile_no = MemberDetails.mobile_no;
          this.address_line1 = MemberDetails.address_line1;
          this.address_line2 = MemberDetails.address_line2;
          this.city = MemberDetails.city;
          this.country = MemberDetails.country;
          this.postCode = MemberDetails.postcode;
          this.state = MemberDetails.state;

          this.disableEmailId = true;

          if (MemberDetails.mem_lname === "") {
            this.unUseMemlName = true;
          } else {
            this.unUseMemlName = false;
          }

          if (MemberDetails.address_line1 === "") {
            this.unUseAddressLine1 = true;
          } else {
            this.unUseAddressLine1 = false;
          }

          if (MemberDetails.city === "") {
            this.unUseCity = true;
          } else {
            this.unUseCity = false;
          }

          if (MemberDetails.country === "") {
            this.unUseCountry = true;
          } else {
            this.unUseCountry = false;
          }

          if (MemberDetails.postCode === "") {
            this.unUsePostCode = true;
          } else {
            this.unUsePostCode = false;
          }

          if (MemberDetails.state === "") {
            this.unUseState = true;
          } else {
            this.unUseState = false;
          }

          this.unUseEmailId = false;
          this.unUseMemName = false;
          this.unUseMobileNo = false;
          this.unUseAddressLine2 = false;
        } else {
          this.mem_id = "";
          this.mem_name = "";
          this.mem_lname = "";
          this.email_id = "";
          this.mobile_no = "";
          this.address_line1 = "";
          this.address_line2 = "";
          this.city = "";
          this.country = "";
          this.postCode = "";
          this.state = "";
          this.disableEmailId = false;
        }
        this.countryOptions = country_options;
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
