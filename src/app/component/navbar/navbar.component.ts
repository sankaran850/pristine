import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/service/auth.service";
import { CommonService } from "src/app/service/common.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  constructor(
    private router: Router,
    public authService: AuthService,
    public common: CommonService
  ) {}

  ngOnInit(): void {
    this.authService.authenticateUser();
    //this.common.cartRefresh();
  }

  logout(): void {
    localStorage.removeItem("pristine_member_id");
    this.router.navigate(["/"]);
    this.authService.authenticate = false;
    this.common.navClass = "w-0";
  }
}
