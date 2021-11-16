import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./component/login/login.component";
import { RegisterComponent } from "./component/register/register.component";
import { CompetitionsListingComponent } from "./component/competitions-listing/competitions-listing.component";
import { NotFoundComponent } from "./component/not-found/not-found.component";
import { ViewCompetitionComponent } from "./component/view-competition/view-competition.component";
import { CartComponent } from "./component/cart/cart.component";
import { MyAccountComponent } from "./component/my-account/my-account.component";
import { CmsComponent } from "./component/cms/cms.component";
import { EntryListComponent } from "./component/entry-list/entry-list.component";
import { DrawsComponent } from "./component/draws/draws.component";
import { WinningGalleryComponent } from "./component/winning-gallery/winning-gallery.component";
import { ChangePasswordComponent } from "./component/change-password/change-password.component";
import { MyOrderComponent } from "./component/my-order/my-order.component";
import { MyOrderDetailsComponent } from "./component/my-order-details/my-order-details.component";
import { ForgotPasswordComponent } from "./component/forgot-password/forgot-password.component";
import { CheckoutComponent } from "./component/checkout/checkout.component";
import { MyWalletComponent } from "./component/my-wallet/my-wallet.component";
import { AddMoneyWalletComponent } from "./component/add-money-wallet/add-money-wallet.component";
import { WalletSuccessComponent } from "./component/wallet-success/wallet-success.component";
import { OrderConfirmationComponent } from "./component/order-confirmation/order-confirmation.component";
import { InviteFriendComponent } from "./component/invite-friend/invite-friend.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "competition-listing",
    pathMatch: "full",
  },
  {
    path: "login",
    component: LoginComponent,
    data: { title: "Login" },
  },
  {
    path: "register",
    component: RegisterComponent,
    data: { title: "Register" },
  },
  {
    path: "my-account",
    component: MyAccountComponent,
    data: { title: "My Profile" },
  },
  {
    path: "competition-listing",
    component: CompetitionsListingComponent,
    data: { title: "Competition Listing" },
  },
  {
    path: "view-competition/:pro_id",
    component: ViewCompetitionComponent,
    data: { title: "View Competition" },
  },
  {
    path: "cart",
    component: CartComponent,
    data: { title: "Cart" },
  },
  {
    path: "cms/:cms_id",
    component: CmsComponent,
    data: { title: "CMS" },
  },
  {
    path: "entry-list",
    component: EntryListComponent,
    data: { title: "Entry List" },
  },
  {
    path: "draws",
    component: DrawsComponent,
    data: { title: "Draws" },
  },
  {
    path: "winning-gallery",
    component: WinningGalleryComponent,
    data: { title: "Draws" },
  },
  {
    path: "change-password",
    component: ChangePasswordComponent,
    data: { title: "Change Password" },
  },
  {
    path: "my-order",
    component: MyOrderComponent,
    data: { title: "My Order" },
  },
  {
    path: "my-order-details/:order_id",
    component: MyOrderDetailsComponent,
    data: { title: "My Order Details" },
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
    data: { title: "Foget Password" },
  },
  {
    path: "checkout",
    component: CheckoutComponent,
    data: { title: "Checkout" },
  },
  {
    path: "my-wallet",
    component: MyWalletComponent,
    data: { title: "MyWallet" },
  },
  {
    path: "add-money-wallet",
    component: AddMoneyWalletComponent,
    data: { title: "Add Money Wallet" },
  },
  {
    path: "wallet-success/:wallet_id",
    component: WalletSuccessComponent,
    data: { title: "Wallet Success" },
  },
  {
    path: "order-confirmation/:order_id",
    component: OrderConfirmationComponent,
    data: { title: "Order Confirmation" },
  },
  {
    path: "refer-earn",
    component: InviteFriendComponent,
    data: { title: "Refer Earn" },
  },
  {
    path: "**",
    component: NotFoundComponent,
    data: { title: "404 Page Not Found" },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false,
      onSameUrlNavigation: "reload",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
