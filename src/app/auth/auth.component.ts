import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';
import * as fromApp from '../store/app.reducer';
import { UserService } from '../User/user.service';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit , OnDestroy{

  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
  private closeSub: Subscription;
  private storeSub: Subscription;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if(this.error){
        this.showErrorAlert(this.error);
      }
    });
  }

  ngOnDestroy(){
    if(this.closeSub)
    this.closeSub.unsubscribe();

    if(this.storeSub)
    this.storeSub.unsubscribe();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return true;
    }

    const email = form.value.email;
    const password = form.value.password;

    if(this.isLoginMode){
      this.store.dispatch(new AuthActions.LoginStart({email:email, password:password}));
    } else {
      const name = form.value.fullName;
      console.log(name);
      this.userService.setUserDetails(name,email);
      this.store.dispatch(new AuthActions.SignUpStart({email:email, password:password}));
    }

    form.reset();
  }

  onHandleError(){
    this.store.dispatch(new AuthActions.ClearError());
  }

  private showErrorAlert(errorMsg: string){
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainer = this.alertHost.viewContainerRef;
    hostViewContainer.clear();
    const componentRef= hostViewContainer.createComponent(alertComponentFactory);
    componentRef.instance.message = errorMsg;
    this.closeSub = componentRef.instance.close.subscribe(()=>{
      this.closeSub.unsubscribe();
      hostViewContainer.clear();
    });
  }
}
