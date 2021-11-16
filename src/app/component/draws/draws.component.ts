import { Component, OnInit } from "@angular/core";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

import { AuthService } from "src/app/service/auth.service";
import { CommonService } from "src/app/service/common.service";

import {
  AUTH_USERNAME,
  AUTH_PASSWORD,
  REQUEST_HEADER,
  API,
} from "src/environments/api";

@Component({
  selector: "app-draws",
  templateUrl: "./draws.component.html",
  styleUrls: ["./draws.component.css"],
})
export class DrawsComponent implements OnInit, PipeTransform {
  @Pipe({ name: "safe_html" })
  loading: boolean = false;
  draws: any = [];
  frame: SafeHtml;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    public common: CommonService,
    public sanitizer: DomSanitizer
  ) {}

  transform(content: any) {
    this.frame = this.sanitizer.bypassSecurityTrustHtml(content);
    return this.frame;
  }

  trust(content: any) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  ngOnInit(): void {
    this.getDraws();
  }

  getDraws(): void {
    try {
      this.loading = true;
      let headers = new HttpHeaders(REQUEST_HEADER);
      let options = {
        headers: headers,
      };

      const post: any = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "Draws",
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { draws_list } = res;
        this.draws = draws_list;
        this.loading = false;
      });
    } catch (error) {
      alert(error);
      this.loading = false;
    }
  }
}
