import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "src/app/service/common.service";
import {
  REQUEST_HEADER,
  AUTH_USERNAME,
  AUTH_PASSWORD,
  API,
} from "src/environments/api";
import { FlowFlags } from "typescript";

declare let cordova: any;

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.css"],
})
export class CheckoutComponent implements OnInit {
  //CountryAndPaymentOptions
  cart: any = [];
  basket: any = [];

  firstName: string = "";
  lastName: string = "";
  emailId: string = "";
  mobileNumber: string = "";
  addressLine1: string = "";
  addressLine2: string = "";
  city: string = "";
  state: string = "";
  postCode: string = "";
  country: string = "";
  paymentGateway: string = "";
  walletTotalAmount: any = "0.00";
  walletSelectStatus: any = "0";

  inValidFirstName: boolean = false;
  inValidLastName: boolean = false;
  inValidEmailId: boolean = false;
  inValidMobileNumber: boolean = false;
  inValidAddressLine1: boolean = false;
  inValidAddressLine2: boolean = false;
  inValidCity: boolean = false;
  inValidState: boolean = false;
  inValidPostCode: boolean = false;
  inValidCountry: boolean = false;
  inValidWalletAmount: boolean = true;
  inValidPayment: boolean = false;
  inValidTerms: boolean = true;

  unUseFirstName: boolean = true;
  unUseLastName: boolean = true;
  unUseEmailId: boolean = true;
  unUseMobileNumber: boolean = true;
  unUseAddressLine1: boolean = true;
  unUseAddressLine2: boolean = true;
  unUseCity: boolean = true;
  unUseState: boolean = true;
  unUsePostCode: boolean = true;
  unUseCountry: boolean = true;
  unUseWalletAmount: boolean = true;
  unUseTerms: boolean = true;

  unUsePayment: boolean = false;

  memberDetails: any = {};
  countryOptions: any = {};
  paymentOptions: any = {};

  displayEmail: boolean = true;

  status: string = "";
  message: string = "";

  loading: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    public common: CommonService
  ) {}

  ngOnInit(): void {
    this.common.cartRefresh();
    this.common.cartSummary();
    const mem_id = this.common.getMemberId();
    if (mem_id !== 0) {
      this.myAccount();
      this.displayEmail = true;
    } else {
      this.displayEmail = false;
    }
    this.getCart();
    this.walletTotalBalance();
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
        const {
          payment_options,
          country_options,
          default_selected_payment_option,
        }: any = res;
        this.paymentOptions = payment_options;
        this.countryOptions = country_options;
        this.paymentGateway = default_selected_payment_option;
        this.loading = false;
      });
    } catch (error) {
      alert(error);
      this.loading = false;
    }
  }

  getCart(): void {
    try {
      this.loading = true;
      const headers: any = new HttpHeaders(REQUEST_HEADER);
      const options: any = { headers };

      const post = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "Cart",
        unique_id: this.common.getUniqueId(),
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { result }: any = res;
        this.cart = result;
        this.loading = false;
      });
    } catch (error) {
      alert(error);
      this.loading = false;
    }
  }

  myAccount(): void {
    try {
      this.loading = true;

      let headers = new HttpHeaders(REQUEST_HEADER);
      let options = { headers: headers };

      const post = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "MyAccount",
        member_id: this.common.getMemberId(),
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { MemberDetails, country_options }: any = res;
        if (MemberDetails === false) {
          this.memberDetails = { email_id: "", country: "" };
        } else {
          if (MemberDetails.mem_name === "") {
            this.unUseFirstName = true;
            this.firstName = "";
          } else {
            this.firstName = MemberDetails.mem_name;
            this.inValidFirstName = false;
            this.unUseFirstName = false;
          }

          if (MemberDetails.mem_lname === "") {
            this.unUseLastName = true;
            this.lastName = "";
          } else {
            this.lastName = MemberDetails.mem_lname;
            this.inValidLastName = false;
            this.unUseLastName = false;
          }

          if (
            !/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(
              MemberDetails.email_id
            )
          ) {
            this.emailId = "";
            this.unUseEmailId = true;
          } else {
            this.emailId = MemberDetails.email_id;
            this.inValidEmailId = false;
            this.unUseEmailId = false;
          }

          if (
            !/^[0-9]*$/.test(MemberDetails.mobile_no) ||
            MemberDetails.mobile_no === ""
          ) {
            this.mobileNumber = "";
            this.unUseMobileNumber = true;
          } else {
            this.mobileNumber = MemberDetails.mobile_no;
            this.inValidMobileNumber = false;
            this.unUseMobileNumber = false;
          }

          if (MemberDetails.address_line1 === "") {
            this.unUseAddressLine1 = true;
            this.addressLine1 = "";
          } else {
            this.addressLine1 = MemberDetails.address_line1;
            this.inValidAddressLine1 = false;
            this.unUseAddressLine1 = false;
          }

          if (MemberDetails.address_line2 === "") {
            this.unUseAddressLine2 = true;
            this.addressLine2 = "";
          } else {
            this.addressLine2 = MemberDetails.address_line2;
            this.inValidAddressLine2 = false;
            this.unUseAddressLine2 = false;
          }

          if (MemberDetails.city === "") {
            this.unUseCity = true;
            this.city = "";
          } else {
            this.city = MemberDetails.city;
            this.inValidCity = false;
            this.unUseCity = false;
          }

          if (MemberDetails.state === "") {
            this.unUseState = true;
            this.state = "";
          } else {
            this.state = MemberDetails.state;
            this.inValidState = false;
            this.unUseState = false;
          }

          if (MemberDetails.postcode === "") {
            this.unUsePostCode = true;
            this.postCode = "";
          } else {
            this.postCode = MemberDetails.postcode;
            this.inValidPostCode = false;
            this.unUsePostCode = false;
          }

          if (MemberDetails.country === "") {
            this.unUseCountry = true;
            this.country = "";
          } else {
            this.country = MemberDetails.country;
            this.inValidCountry = false;
            this.unUseCountry = false;
          }
        }

        this.countryOptions = country_options;

        this.loading = false;
      });
    } catch (error) {
      alert(error);
      this.loading = false;
    }
  }

  onKeyUp(event: any, property: string): void {
    if (property === "firstName") {
      if (event.target.value === "") {
        this.firstName = "";
        this.inValidFirstName = true;
        this.unUseFirstName = true;
      } else {
        this.firstName = event.target.value;
        this.inValidFirstName = false;
        this.unUseFirstName = false;
      }
    }

    if (property === "lastName") {
      if (event.target.value === "") {
        this.lastName = "";
        this.inValidLastName = true;
        this.unUseLastName = true;
      } else {
        this.lastName = event.target.value;
        this.inValidLastName = false;
        this.unUseLastName = false;
      }
    }

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

    if (property === "mobileNumber") {
      if (!/^[0-9]*$/.test(event.target.value) || event.target.value === "") {
        this.mobileNumber = "";
        this.inValidMobileNumber = true;
        this.unUseMobileNumber = true;
      } else {
        this.mobileNumber = event.target.value;
        this.inValidMobileNumber = false;
        this.unUseMobileNumber = false;
      }
    }

    if (property === "addressLine1") {
      if (event.target.value === "") {
        this.addressLine1 = "";
        this.inValidAddressLine1 = true;
        this.unUseAddressLine1 = true;
      } else {
        this.addressLine1 = event.target.value;
        this.inValidAddressLine1 = false;
        this.unUseAddressLine1 = false;
      }
    }

    if (property === "addressLine2") {
      if (event.target.value === "") {
        this.addressLine2 = "";
        this.inValidAddressLine2 = true;
        this.unUseAddressLine2 = true;
      } else {
        this.addressLine2 = event.target.value;
        this.inValidAddressLine2 = false;
        this.unUseAddressLine2 = false;
      }
    }

    if (property === "city") {
      if (event.target.value === "") {
        this.city = "";
        this.inValidCity = true;
        this.unUseCity = true;
      } else {
        this.city = event.target.value;
        this.inValidCity = false;
        this.unUseCity = false;
      }
    }

    if (property === "state") {
      if (event.target.value === "") {
        this.state = "";
        this.inValidState = true;
        this.unUseState = true;
      } else {
        this.state = event.target.value;
        this.inValidState = false;
        this.unUseState = false;
      }
    }

    if (property === "postCode") {
      if (event.target.value === "") {
        this.postCode = "";
        this.inValidPostCode = true;
        this.unUsePostCode = true;
      } else {
        this.postCode = event.target.value;
        this.inValidPostCode = false;
        this.unUsePostCode = false;
      }
    }

    if (property === "country") {
      if (event.target.value === "") {
        this.country = "";
        this.inValidCountry = true;
        this.unUseCountry = true;
      } else {
        this.country = event.target.value;
        this.inValidCountry = false;
        this.unUseCountry = false;
      }
    }

    if (property === "useWallet") {
      if (event.target.checked === true) {
        this.walletSelectStatus = "1";
        this.inValidWalletAmount = false;
        this.unUseWalletAmount = false;
      } else {
        this.walletSelectStatus = "0";
        this.inValidWalletAmount = true;
        this.unUseWalletAmount = true;
      }
    }

    if (property === "paymentGateway") {
      if (event.target.value === "") {
        this.paymentGateway = "";
        this.inValidPayment = true;
        this.unUsePayment = true;
      } else {
        this.paymentGateway = event.target.value;
        this.inValidPayment = false;
        this.unUsePayment = false;
      }
    }

    if (property === "termsConditions") {
      if (event.target.checked === true) {
        this.inValidTerms = false;
        this.unUseTerms = false;
      } else {
        this.inValidTerms = true;
        this.unUseTerms = true;
      }
    }
  }

  checkoutOrder(e: any): void {
    try {
      this.loading = true;
      const headers: any = new HttpHeaders(REQUEST_HEADER);
      const options: any = { headers };

      const post: any = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "CheckoutOrder",
        unique_id: this.common.getUniqueId(),
        member_id: this.common.getMemberId(),
        order_total: this.common.orderTotal,
        first_name: this.firstName,
        surname: this.lastName,
        phone_number: this.mobileNumber,
        email: this.emailId,
        address_line_1: this.addressLine1,
        address_line_2: this.addressLine2,
        city: this.city,
        state: this.state,
        country: this.country,
        postcode: this.postCode,
        payment_gateway: this.paymentGateway,
        app_version: "IOS 3.0.0",
        wallet_select_status: this.walletSelectStatus,
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { basket, status, temp_order_id, unique_id }: any = res;

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

  walletTotalBalance(): void {
    try {
      const headers: any = new HttpHeaders(REQUEST_HEADER);
      const options: any = { headers };

      const post: any = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "WalletTotalBalance",
        member_id: this.common.getMemberId(),
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { available_wallet_balance }: any = res;

        this.walletTotalAmount = available_wallet_balance;

        if (available_wallet_balance === "0.00") {
          this.unUseWalletAmount = false;
        } else {
          this.unUseWalletAmount = true;
        }

        if (available_wallet_balance > this.common.orderTotal) {
          this.unUseWalletAmount = true;
        }
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
          const { order_id }: any = res;
          ref.close();
          this.router.navigate(["order-confirmation", order_id]);
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

  getColor(): any {
    return this.inValidFirstName ||
      this.inValidEmailId ||
      this.inValidMobileNumber ||
      this.inValidAddressLine1 ||
      this.inValidCity ||
      this.inValidState ||
      this.inValidPostCode ||
      this.inValidCountry ||
      this.unUseWalletAmount ||
      this.unUsePayment ||
      this.unUseTerms
      ? "#dddddd"
      : "#D3C499";
  }

  visiblePay(orderTotal: any, walletTotalAmount: any): any {
    if (parseFloat(orderTotal) > parseFloat(walletTotalAmount)) {
      return true;
    } else {
      return false;
    }
  }
}
