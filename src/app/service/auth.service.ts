import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  AUTH_USERNAME,
  AUTH_PASSWORD,
  REQUEST_HEADER,
  API,
} from "src/environments/api";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CommonService } from "./common.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  public authenticate: boolean;
  constructor(
    private router: Router,
    private http: HttpClient,
    public common: CommonService
  ) {
    this.generateUniqueId();
    this.authenticateUser();
  }

  authenticateUser(): void {
    const member_id: any = this.common.getMemberId();
    if (member_id === 0) {
      this.authenticate = false;
    } else {
      this.authenticate = true;
    }
  }

  generateUniqueId(): void {
    if (this.common.getUniqueId() === null) {
      let headers = new HttpHeaders(REQUEST_HEADER);
      let options = {
        headers: headers,
      };

      const post = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "GenerateUniqueId",
      };

      let formBody: any = [];
      for (let property in post) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(post[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { unique_id }: any = res;
        localStorage.setItem("pristine_uid", unique_id);
      });
    }
  }
}
