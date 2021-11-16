import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "src/app/service/auth.service";
import { CommonService } from "src/app/service/common.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  AUTH_USERNAME,
  AUTH_PASSWORD,
  API,
  REQUEST_HEADER,
  CHECKOUT,
} from "src/environments/api";

declare let cordova: any;

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class CartComponent implements OnInit {
  @ViewChild("removeBasketModal") private removeBasketModalRef: any;
  @ViewChild("clearBasketModal") private clearBasketModalRef: any;
  @ViewChild("errorModal") private errorModalRef: any;

  loading: boolean = false;
  cartItem: any = [];
  newQty: any = [];
  basketId: number;
  errorMsg: any = "";

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    public common: CommonService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.cart();
    this.common.cartRefresh();
    this.common.cartSummary();
  }

  cart() {
    try {
      this.loading = true;
      let headers = new HttpHeaders(REQUEST_HEADER);
      let options = {
        headers: headers,
      };

      const post: any = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "Cart",
        unique_id: this.common.getUniqueId(),
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { result } = res;
        this.cartItem = result;
        for (let index = 0; index < result.length; index++) {
          this.newQty[index] = result[index].quantity;
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

  modifyQuantity(
    type: string,
    basket_id: number,
    current_qty: number,
    price: any,
    index: number
  ): void {
    try {
      let headers = new HttpHeaders(REQUEST_HEADER);
      let options = {
        headers: headers,
      };

      const post: any = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "ModifyQuantity",
        unique_id: this.common.getUniqueId(),
        type,
        basket_id,
        current_qty,
        price,
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { new_qty } = res;
        if (new_qty === 0) {
          this.modalService.open(this.removeBasketModalRef, {
            windowClass: "dark-modal",
          });
          this.basketId = basket_id;
        }
        this.newQty[index] = new_qty;
        this.cart();
        this.common.cartSummary();
        this.common.cartRefresh();
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

  removeBasket(basket_id: number): any {
    try {
      let headers = new HttpHeaders(REQUEST_HEADER);
      let options = {
        headers: headers,
      };

      const post: any = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "RemoveBasket",
        unique_id: this.common.getUniqueId(),
        basket_id,
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe(() => {
        this.modalService.dismissAll();
        this.cart();
        this.common.cartSummary();
        this.common.cartRefresh();
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

  clearBasket(): any {
    try {
      let headers = new HttpHeaders(REQUEST_HEADER);
      let options = {
        headers: headers,
      };

      const post: any = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "clearBasket",
        unique_id: this.common.getUniqueId(),
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe(() => {
        this.modalService.dismissAll();
        this.cart();
        this.common.cartSummary();
        this.common.cartRefresh();
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

  openRemoveBasketModal(basket_id: number): any {
    this.modalService.open(this.removeBasketModalRef, {
      windowClass: "dark-modal",
    });
    this.basketId = basket_id;
  }

  openClearBasketModal(): any {
    this.modalService.open(this.clearBasketModalRef, {
      windowClass: "dark-modal",
    });
  }

  checkout(): void {
    // location.href = CHECKOUT + '?unique_id=' + this.common.getUniqueId();
    // window.open(CHECKOUT + "?unique_id=" + this.common.getUniqueId());

    var url = CHECKOUT + "?unique_id=" + this.common.getUniqueId();
    var target = "_blank";
    var options =
      "width=" +
      window.innerWidth +
      ",height=" +
      window.innerHeight +
      ",fullscreen=yes," +
      "toolbars=no," +
      "menubar=no," +
      "location=no," +
      "scrollbars=no," +
      "resizable=0," +
      "status=yes";

    var ref = cordova.InAppBrowser.open(url, target, options);
  }
}
