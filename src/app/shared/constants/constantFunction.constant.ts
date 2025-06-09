/* eslint-disable no-useless-escape */
export class constantFunction {
    public static get authmodule(): string {
        return '/authentication/';
    }
    public static get homemodule(): string {
        return '/home/';
    }

    public static get adminmodule(): string {
        return '/admin/';
    }

    public static get partmodule(): string {
        return '/partmaster/';
    }
    public static get login(): string {
        return `${this.authmodule}login`;
    }

    public static get resetPasswordCode(): string {
        return `${this.authmodule}resetpassword`;
    }

    public static get changePassword(): string {
        return `${this.authmodule}changepassword`;
    }

    public static get supportLogin(): string {
        return `${this.authmodule}supportlogin`;
    }
    public static get welcomeScreen(): string {
        return `${this.homemodule}welcomescreen`;
    }
    public static get forgotPassword(): string {
        return `${this.authmodule}forgotpassword`;
    }
    public static get taskLog(): string {
        return `${this.homemodule}tasklog`;
    }
    public static get contactUs(): string {
        return `${this.homemodule}contactus`;
    }
    public static get agenttsa(): string {
        return `${this.homemodule}agenttraining/agenttsa`;
    }
    public static get agentrisk(): string {
        return `${this.homemodule}agenttraining/agentrisk`;
    }
    public static get usermaster(): string {
        return `${this.homemodule}usermaster`;
    }
    public static get userlist(): string {
        return `${this.homemodule}userlist`;
    }
    public static get mapview(): string {
        return `${this.homemodule}map-view/mappopup`;
    }
    public static get newfeatureupdate(): string {
        return `${this.homemodule}newfeatureupdate`;
    }
    public static get partsMain(): string {
        return `${this.homemodule}partmaster/partlist`;
    }
    public static get PartDtl(): string {
        return `${this.homemodule}partmaster/partdetail`;
    }
    public static get PartStockDtl(): string {
        return `${this.homemodule}partmaster/partstockdetail`;
    }
    public static get flightpath(): string {
        return `/flightpath`;
    }
    public static get agentconsole(): string {
        return `${this.homemodule}/tools/agentconsole`;
    }
    public static get managefslpart(): string {
        return `${this.homemodule}inventory/managefslpart`;
    }
    public static get fslsetup(): string {
        return `${this.homemodule}inventory/fslsetup`;
    }
    public static get mileagecalc(): string {
        return `${this.homemodule}tools/mileagecalc`;
    }
    public static get asnlog(): string {
        return `${this.homemodule}inventory/asnlog`;
    }
    public static get asndetails(): string {
        return `${this.homemodule}inventory/asndetails`;
    }
    public static isEmpty(data: unknown): boolean {
        return data === undefined || data == null || data == '' ? true : false;
    }

    public static get ls_menuscreenList(): string {
        return 'menuscreenList';
    }

    public static get ls_userprefData(): string {
        return 'userprefData';
    }

    public static get ls_jwtToken(): string {
        return 'jwtToken';
    }

    public static get ls_netagentUser(): string {
        return 'netagentUser';
    }

    public static get netagentportal(): string {
        return 'NetAgent';
    }
    public static get DateFormatPassingDB(): string {
        return "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
    }
    public static get singleemailregex(): string {
        return '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
    }
}
