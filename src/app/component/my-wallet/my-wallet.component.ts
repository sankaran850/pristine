import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
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
  selector: "app-money-wallet",
  templateUrl: "./my-wallet.component.html",
  styleUrls: ["./my-wallet.component.css"],
})
export class MyWalletComponent implements OnInit {
  @ViewChild("errorModal") private errorModalRef: any;

  walletTotalAmount: any = "0.00";
  walletList: any = [];

  loading: boolean = false;
  errorMsg: any = "";

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    public common: CommonService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.myWallet();
  }

  myWallet(): void {
    try {
      this.loading = true;
      let headers: any = new HttpHeaders(REQUEST_HEADER);
      let options: any = {
        headers: headers,
      };

      const post: any = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "MyWalletList",
        member_id: this.common.getMemberId(),
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { wallet_list, available_wallet_balance }: any = res;
        this.walletList = wallet_list;
        this.walletTotalAmount = available_wallet_balance;

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
