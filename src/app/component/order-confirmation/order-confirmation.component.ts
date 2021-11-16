import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "src/app/service/common.service";
import {
  REQUEST_HEADER,
  AUTH_USERNAME,
  AUTH_PASSWORD,
  API,
} from "src/environments/api";

@Component({
  selector: "app-order-confirmation",
  templateUrl: "./order-confirmation.component.html",
  styleUrls: ["./order-confirmation.component.css"],
})
export class OrderConfirmationComponent implements OnInit {
  @ViewChild("errorModal") private errorModalRef: any;

  loading: boolean = false;
  order: any = {};
  orderDetails: any = [];
  raffleDetails: any[];

  errMsg: string = "";

  constructor(
    private http: HttpClient,
    public common: CommonService,
    public actRoute: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.myOrderDetials();
    this.common.cartRefresh();
  }

  myOrderDetials(): void {
    const orderId: any = this.actRoute.snapshot.params.order_id;
    try {
      this.loading = true;
      let headers: any = new HttpHeaders(REQUEST_HEADER);
      let options: any = {
        headers: headers,
      };

      const post: any = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "GetOrderDetails",
        OrderId: orderId,
        unique_id: this.common.getUniqueId(),
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { order, order_details, raffle_details }: any = res;

        this.order = order;
        this.orderDetails = order_details;
        this.raffleDetails = raffle_details;
        this.loading = false;
      });
    } catch (error) {
      this.loading = false;
      this.errMsg = error;
      setTimeout(() => {
        this.modalService.open(this.errorModalRef, {
          windowClass: "dark-modal",
        });
      }, 1000);
      this.loading = false;
    }
  }
}
