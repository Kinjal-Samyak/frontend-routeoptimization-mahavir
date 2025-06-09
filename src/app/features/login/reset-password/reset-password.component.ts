import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { ConfirmPasswordValidator } from '../create-account/confirm-password-validator';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
    resetPWDForm!: FormGroup;

    subscriptions: Subscription[] = [];
    queryParams: any;

    isExpiredData: any;

    constructor(
        public fb: FormBuilder,
        private usersService: UserService,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private router: Router
    ) {
        this.resetPWDForm = this.fb.group(
            {
                newPassword: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(
                            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
                        ),
                    ],
                ],
                confPassword: ['', [Validators.required]],
            },
            {
                validator: ConfirmPasswordValidator(
                    'newPassword',
                    'confPassword'
                ), // Apply the custom validator
            }
        );
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            if (params) {
                this.queryParams = params;
                // Access specific query parameters like this.queryParams.paramName
                this.checkIsExpired();
            }
        });
    }

    checkIsExpired() {
        let userRq = {
            encryptedToken: this.queryParams.d,
        };

        this.subscriptions.push(
            this.usersService.isExpired(userRq).subscribe(
                (response: any) => {
                    if (response.data) {
                        this.isExpiredData = response.data;
                    }
                },
                (error: any) => {
                    this.toastr.error('Reset-password', error.message);
                    this.router.navigate(['/forgot-password']);
                }
            )
        );
    }

    resetPDW() {
        if (this.resetPWDForm.valid) {
            let userRq = {
                userDetailId: this.isExpiredData.userDetailId,
                newPassword: this.resetPWDForm.value.newPassword,
            };
            this.subscriptions.push(
                this.usersService.resetPassword(userRq).subscribe(
                    (response: any) => {
                        if (response.code == 200) {
                            this.toastr.success(
                                'Reset-password',
                                'Password reset successfully'
                            );
                            this.router.navigate(['']);
                        }
                    },
                    (error: any) => {
                        this.toastr.error('Reset-password', error.message);
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
