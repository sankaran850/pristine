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
  selector: "app-invite-friend",
  templateUrl: "./invite-friend.component.html",
  styleUrls: ["./invite-friend.component.css"],
})
export class InviteFriendComponent implements OnInit {
  @ViewChild("errorModal") private errorModalRef: any;
  @ViewChild("alertModal") private alertModalRef: any;

  friendName: string = "";
  friendEmail: string = "";

  inValidFriendName: boolean = false;
  inValidFriendEmail: boolean = false;

  unUseFriendName: boolean = true;
  unUseFriendEmail: boolean = true;

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

  ngOnInit(): void {}

  onKeyUp(event: any, property: string): void {
    if (property === "friendName") {
      if (event.target.value === "") {
        this.friendName = "";
        this.inValidFriendName = true;
        this.unUseFriendName = true;
      } else {
        this.friendName = event.target.value;
        this.inValidFriendName = false;
        this.unUseFriendName = false;
      }
    }

    if (property === "friendEmail") {
      if (
        !/^[_A-Za-z0-9]+(\.[_A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,4})$/.test(
          event.target.value
        )
      ) {
        this.friendEmail = "";
        this.inValidFriendEmail = true;
        this.unUseFriendEmail = true;
      } else {
        this.friendEmail = event.target.value;
        this.inValidFriendEmail = false;
        this.unUseFriendEmail = false;
      }
    }
  }

  referFriend(): void {
    try {
      this.loading = true;
      let headers = new HttpHeaders(REQUEST_HEADER);
      let options = {
        headers: headers,
      };

      const post = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "ForgetPassword",
        unique_id: this.common.getUniqueId(),
        member_id: this.common.getUniqueId(),
        friend_name: this.friendName,
        friend_email: this.friendEmail,
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { status }: any = res;
        if (status === "success") {
          this.modalService.open(this.alertModalRef, {
            windowClass: "dark-modal",
          });
          this.friendName = "";
          this.friendEmail = "";
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
