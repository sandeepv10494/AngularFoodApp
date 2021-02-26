import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth-guard";
import { UserOrdersComponent } from "./user-orders/user-orders.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { UserWishlistItemsComponent } from "./user-wishlist-items/user-wishlist-items.component";
import { UserComponent } from "./user.component";

const userRoutes: Routes = [
  {
    path: '',
    component: UserComponent,
    canActivate: [AuthGuard],
    children:[
      {
        path:':id',
        component: UserProfileComponent
      },
      {
        path:'wishlist',
        component: UserWishlistItemsComponent
      },
      {
        path:'orders',
        component: UserOrdersComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule]
})
export class UserRouteModule{}
