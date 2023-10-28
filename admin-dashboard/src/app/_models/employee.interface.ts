import { Observable } from "rxjs";

export interface Employee {
    email: string;
    hourlyRate: number;
    hourlyRateOvertime: number;
    id: string;
    name: string;
    selected?: boolean;
    clockedIn?: Observable<string>;
}
