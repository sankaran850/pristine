import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ViewChild } from "@angular/core";
import { Component, OnInit } from "@angular/core";
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
  selector: "app-wallet-success",
  templateUrl: "./wallet-success.component.html",
  styleUrls: ["./wallet-success.component.css"],
})
export class WalletSuccessComponent implements OnInit {
  @ViewChild("alertModal") private alertModalRef: any;
  @ViewChild("errorModal") private errorModalRef: any;

  walletTotalAmount: any = "";

  loading: boolean = false;
  errorMsg: any = "";

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    public common: CommonService,
    private router: Router,
    private modalService: NgbModal,
    public actRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getRecentWallet();
  }

  getRecentWallet(): void {
    try {
      this.loading = true;
      let headers: any = new HttpHeaders(REQUEST_HEADER);
      let options: any = {
        headers: headers,
      };

      const post: any = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "getRecentWallet",
        wallet_id: this.actRoute.snapshot.params.wallet_id,
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { status, new_wallet_amount }: any = res;
        if (status === "success") {
          this.modalService.open(this.alertModalRef, {
            windowClass: "dark-modal",
            backdrop: "static",
            keyboard: false,
          });
          this.walletTotalAmount = new_wallet_amount;
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
