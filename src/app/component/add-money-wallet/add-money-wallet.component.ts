import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "src/app/service/auth.service";
import { CommonService } from "src/app/service/common.service";
import {
  REQUEST_HEADER,
  AUTH_USERNAME,
  AUTH_PASSWORD,
  API,
} from "src/environments/api";

declare let cordova: any;

@Component({
  selector: "app-add-money-wallet",
  templateUrl: "./add-money-wallet.component.html",
  styleUrls: ["./add-money-wallet.component.css"],
})
export class AddMoneyWalletComponent implements OnInit {
  @ViewChild("errorModal") private errorModalRef: any;

  paymentOptions: any = {};
  walletAmount: any = "";
  paymentGateway: string = "";

  inValidWalletAmount: boolean = false;
  inValidPaymentGateway: boolean = false;

  unUseWalletAmount: boolean = true;
  unUsePaymentGateway: boolean = true;

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
    this.countryAndPaymentOptions();
  }

  countryAndPaymentOptions(): void {
    try {
      this.loading = true;
      const headers: any = new HttpHeaders(REQUEST_HEADER);
      const options: any = { headers };

      const post = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "CountryAndPaymentOptions",
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { payment_options, default_selected_payment_option }: any = res;
        this.paymentOptions = payment_options;
        this.paymentGateway = default_selected_payment_option;
        this.unUsePaymentGateway = false;
        this.loading = false;
      });
    } catch (error) {
      alert(error);
      this.loading = false;
    }
  }

  onKeyUp(event: any, property: any): void {
    if (property === "walletAmount") {
      if (event.target.value === "") {
        this.walletAmount = "";
        this.inValidWalletAmount = true;
        this.unUseWalletAmount = true;
      } else {
        this.walletAmount = event.target.value;
        this.inValidWalletAmount = false;
        this.unUseWalletAmount = false;
      }
    }

    if (property === "paymentGateway") {
      if (event.target.value === "") {
        this.paymentGateway = "";
        this.inValidPaymentGateway = true;
        this.unUsePaymentGateway = true;
      } else {
        this.paymentGateway = event.target.value;
        this.inValidPaymentGateway = false;
        this.unUsePaymentGateway = false;
      }
    }
  }

  addMoneyToWallet(): void {
    try {
      this.loading = true;
      const headers: any = new HttpHeaders(REQUEST_HEADER);
      const options: any = { headers };

      const post = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "AddMoneyToWallet",
        member_id: this.common.getMemberId(),
        wallet_amount: this.walletAmount,
        payment_gateway: this.paymentGateway,
        app_version: "IOS 3.0.0",
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { status, temp_order_id }: any = res;
        if (status === "success") {
          let url =
            "https://www.pristinecompetitions.co.uk/app_payment.php?temp_order_id=" +
            temp_order_id;
          let target = "_blank";
          let browser_options =
            "width=" +
            window.innerWidth +
            ",height=" +
            window.innerHeight +
            ", fullscreen=yes," +
            "toolbars=no,menubar=no,location=no";

          let ref = cordova.InAppBrowser.open(url, target, browser_options);

          this.checkPaymentStatus(ref, temp_order_id);
        }
        this.loading = false;
      });
    } catch (error) {
      alert(error);
      this.loading = false;
    }
  }

  checkPaymentStatus(ref: any, temp_order_id: any): void {
    try {
      const headers: any = new HttpHeaders(REQUEST_HEADER);
      const options: any = { headers };

      const post: any = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "CheckPaymentStatus",
        unique_id: this.common.getUniqueId(),
        member_id: this.common.getMemberId(),
        temp_order_id: temp_order_id,
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { status }: any = res;

        if (status === "success") {
          const { wallet_order_id }: any = res;
          ref.close();
          this.router.navigate(["wallet-success", wallet_order_id]);
        } else if (status === "failed") {
          ref.close();
          alert("Your payment was unsuccessful. If you wish try again.");
        } else if (status === "pending") {
          setTimeout(() => {
            this.checkPaymentStatus(ref, temp_order_id);
          }, 2000);
        } else if (status == "order id failed") {
          ref.close();
          alert(
            "Order failed if you're pay money will repay 3 - 4 working days"
          );
        }
      });
    } catch (error) {
      alert(error);
    }
  }
}
