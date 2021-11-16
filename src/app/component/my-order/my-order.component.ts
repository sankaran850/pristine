import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from "src/app/service/common.service";
import {
  REQUEST_HEADER,
  AUTH_USERNAME,
  AUTH_PASSWORD,
  API,
} from "src/environments/api";

@Component({
  selector: "app-my-order",
  templateUrl: "./my-order.component.html",
  styleUrls: ["./my-order.component.css"],
})
export class MyOrderComponent implements OnInit {
  @ViewChild("errorModal") private errorModalRef: any;

  orders: any = [];
  orderOetails: any = {};

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
    this.myOrder();
  }

  myOrder(): void {
    try {
      this.loading = true;
      let headers: any = new HttpHeaders(REQUEST_HEADER);
      let options: any = {
        headers: headers,
      };

      const post: any = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "MyOrder",
        member_id: this.common.getMemberId(),
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { status, Orders }: any = res;
        if (status === "success") {
          this.orders = Orders;
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

  orderDetails(order_id: any): void {
    this.router.navigate(["my-order-details", order_id]);
  }
}
