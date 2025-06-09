import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    errorMsg: any;
    successMessage: any;
    subscriptions: Subscription[] = [];
    loginForm!: FormGroup;
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    submitted: boolean = false;
    apiLoaded!: Boolean;
    hidePassword = true;
    remmberMeData: any;
    constructor(
        private auth: AuthService,
        private route: Router,
        public fb: FormBuilder,
        private commonService: CommonService,
        private toastr: ToastrService,
        private ls: LocalStoreService
    ) {}
    ngOnInit(): void {
        this.loginForm = this.fb.group({
            userName: ['', [Validators.required]],
            password: ['', Validators.required],
            rememberMeCheck: [false],
        });

        this.commonService.currentApiStatus.subscribe((value) => {
            if (value) {
                this.apiLoaded = value;
            }
        });

        if (this.auth.isLogedIn() && this.apiLoaded) {
            this.route.navigate(['/home/dynamic-routing']);
        }

        this.remmberMeData = this.ls.getItem('rememberedCredentials');
        if (this.remmberMeData != null && this.remmberMeData != '') {
            this.patchValueForm();
        }
    }
    patchValueForm() {
        this.loginForm?.patchValue({
            userName: this.remmberMeData.userName,
            password: this.remmberMeData.password,
            rememberMeCheck: this.remmberMeData.rememberMeCheck,
        });
    }

    public togglePasswordVisibility(): void {
        this.hidePassword = !this.hidePassword;
    }

    login() {
        if (this.loginForm.valid) {
            this.subscriptions.push(
                this.auth.login(this.loginForm.value).subscribe(
                    (response: any) => {
                        if ((response.code = 200)) {
                            // this.successMessage = 'Login Successfully Done';
                            this.toastr.success(
                                'Success',
                                'User logged in successfully'
                            );

                            this.route.navigate(['/home']);
                            this.submitted = false;
                            this.errorMsg = false;
                        }
                    },
                    (error: any) => {
                        this.toastr.error('Error', error);
                        this.loginForm.get('password')?.reset();
                    }
                )
            );
        }
    }

    hideMsg() {
        this.errorMsg = '';
        this.successMessage = '';
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription: any) =>
            subscription.unsubscribe()
        );
    }
}
