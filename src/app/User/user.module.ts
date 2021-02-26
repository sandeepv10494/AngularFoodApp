import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";


import { UserComponent } from "./user.component";
import { UserMenuComponent } from './user-menu/user-menu.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserWishlistItemsComponent } from './user-wishlist-items/user-wishlist-items.component';
import { UserOrdersComponent } from "./user-orders/user-orders.component";
import { UserRouteModule } from "./user-route.module";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    UserComponent,
    UserMenuComponent,
    UserProfileComponent,
    UserOrdersComponent,
    UserWishlistItemsComponent
  ],
  imports: [
    RouterModule,
    UserRouteModule,
    SharedModule
  ],
})
export class UserModule {

}
