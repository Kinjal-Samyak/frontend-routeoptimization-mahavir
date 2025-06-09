import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmPasswordValidator } from './confirm-password-validator';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-create-account',
    templateUrl: './create-account.component.html',
    styleUrls: ['./create-account.component.scss'],
})
export class CreateAccountComponent implements OnInit, OnDestroy {
    registrationForm!: FormGroup;
    subscriptions: Subscription[] = [];
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    submitted: boolean = false;
    hidePassword = true;
    showpassvar: any;
    errorMsg: any;
    successMessage: any;
    hideCPassword = true;
    constructor(
        private route: Router,
        public fb: FormBuilder,
        private usersService: UserService,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.registrationForm = this.fb.group(
            {
                name: ['', [Validators.required]],
                email: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(
                            '[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}'
                        ),
                    ],
                ],
                contactNo: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern('^[0-9]*$'),
                        Validators.minLength(8),
                    ],
                ],
                password: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(
                            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
                        ),
                    ],
                ],
                cPassword: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(
                            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
                        ),
                    ],
                ],
            },
            {
                validator: ConfirmPasswordValidator('password', 'cPassword'),
            }
        );
    }

    public togglePasswordVisibility(): void {
        this.hidePassword = !this.hidePassword;
    }

    public toggleCPasswordVisibility(): void {
        this.hideCPassword = !this.hideCPassword;
    }
    createNew() {
        this.submitted = true;
        if (this.registrationForm.invalid) {
            //
        } else {
            const data = this.registrationForm.value;
            let obj = {
                userName: data.email,
                email: data.email,
                password: data.password,
                name: data.name,
                contactNo: data.contactNo,
            };
            this.subscriptions.push(
                this.usersService.register(obj).subscribe(
                    (result: any) => {
                        if (result.code == 200) {
                            this.submitted = false;
                            this.toastr.success(
                                'Success',
                                'Account Created successfully'
                            );
                            this.route.navigate(['login']);
                        }
                    },
                    (error: any) => {
                        this.toastr.error('Error', error);
                    }
                )
            );
        }
    }

    login() {
        this.route.navigate(['login']);
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription: any) =>
            subscription.unsubscribe()
        );
    }
}
