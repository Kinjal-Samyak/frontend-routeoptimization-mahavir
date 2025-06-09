import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
    forgotPWDForm!: FormGroup;

    subscriptions: Subscription[] = [];

    constructor(
        private router: Router,
        public fb: FormBuilder,
        private usersService: UserService,
        private toastr: ToastrService
    ) {
        this.forgotPWDForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    ngOnInit(): void {}

    forgotPDW() {
        if (this.forgotPWDForm.valid) {
            let userRq = {
                userName: this.forgotPWDForm.value.email,
            };
            this.subscriptions.push(
                this.usersService.forgotPassword(userRq).subscribe(
                    (response: any) => {
                        this.router.navigate(['/reset-password'], {
                            queryParams: { d: response.data },
                        });
                    },
                    (error: any) => {
                        this.toastr.error('Forgot-password', error.message);
                    }
                )
            );
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription: any) =>
            subscription.unsubscribe()
        );
    }
}
