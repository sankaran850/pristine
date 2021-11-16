import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ViewChild } from '@angular/core';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "src/app/service/common.service";
import {
  REQUEST_HEADER,
  AUTH_USERNAME,
  AUTH_PASSWORD,
  API,
} from "src/environments/api";

@Component({
  selector: "app-my-order-details",
  templateUrl: "./my-order-details.component.html",
  styleUrls: ["./my-order-details.component.css"],
})
export class MyOrderDetailsComponent implements OnInit {
  @ViewChild("errorModal") private errorModalRef: any;
  
  loading: boolean = false;
  order: any = {};
  orderDetails: any = [];
  raffleDetails: any[];

  constructor(
    private http: HttpClient,
    public common: CommonService,
    public actRoute: ActivatedRoute,
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
      alert(error);
      this.loading = false;
    }
  }
}
