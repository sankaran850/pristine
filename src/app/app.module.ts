import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./component/navbar/navbar.component";
import { LoginComponent } from "./component/login/login.component";
import { RegisterComponent } from "./component/register/register.component";
import { CompetitionsListingComponent } from "./component/competitions-listing/competitions-listing.component";
import { NotFoundComponent } from "./component/not-found/not-found.component";
import { ViewCompetitionComponent } from "./component/view-competition/view-competition.component";
import { CartComponent } from "./component/cart/cart.component";
import { MyAccountComponent } from "./component/my-account/my-account.component";
import { CmsComponent } from "./component/cms/cms.component";
import { SpinnerComponent } from "./component/spinner/spinner.component";
import { ConnectionServiceModule } from "ng-connection-service";
import { InternetComponent } from "./component/internet/internet.component";
import { EntryListComponent } from "./component/entry-list/entry-list.component";
import { DrawsComponent } from "./component/draws/draws.component";
import { WinningGalleryComponent } from "./component/winning-gallery/winning-gallery.component";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ChangePasswordComponent } from "./component/change-password/change-password.component";
import { MyOrderComponent } from "./component/my-order/my-order.component";
import { MyOrderDetailsComponent } from "./component/my-order-details/my-order-details.component";
import { ForgotPasswordComponent } from "./component/forgot-password/forgot-password.component";

import { FirebaseX } from "@ionic-native/firebase-x/ngx";
import { CheckoutComponent } from './component/checkout/checkout.component';
import { AddMoneyWalletComponent } from './component/add-money-wallet/add-money-wallet.component';
import { MyWalletComponent } from './component/my-wallet/my-wallet.component';
import { WalletSuccessComponent } from './component/wallet-success/wallet-success.component';
import { OrderConfirmationComponent } from './component/order-confirmation/order-confirmation.component';
import { InviteFriendComponent } from './component/invite-friend/invite-friend.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    CompetitionsListingComponent,
    NotFoundComponent,
    ViewCompetitionComponent,
    CartComponent,
    MyAccountComponent,
    CmsComponent,
    SpinnerComponent,
    InternetComponent,
    EntryListComponent,
    DrawsComponent,
    WinningGalleryComponent,
    ChangePasswordComponent,
    MyOrderComponent,
    MyOrderDetailsComponent,
    ForgotPasswordComponent,
    CheckoutComponent,
    AddMoneyWalletComponent,
    MyWalletComponent,
    WalletSuccessComponent,
    OrderConfirmationComponent,
    InviteFriendComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ConnectionServiceModule,
    InfiniteScrollModule,
  ],
  providers: [FirebaseX],
  bootstrap: [AppComponent],
})
export class AppModule {}
