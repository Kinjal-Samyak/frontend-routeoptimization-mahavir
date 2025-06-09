/* eslint-disable @typescript-eslint/no-explicit-any */
// import { CustomerAccount } from './CustomerAccount.model';

export class User {
    Id?: number;
    LoginId?: string;
    FirstName?: string;
    LastName?: string;
    MiddleName?: string;
    EmailAddress?: string;
    TempPassword?: string;
    IsTempPwdMatched?: string;
    UserName?: string;
    LoginIdCode?: string;
    TimezoneMasterId?: number;
    constructor(user: User) {
        this.Id = user.Id;
    }
}
