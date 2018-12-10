import {FacadeMember} from "./core/FacadeMember";
import { Facade } from "./facade/Facade";
import { Notification } from "./notification/Notification";

export class Proxy extends FacadeMember {
    /**
     * This field should be unique for each proxy
     */
    static NAME: string = 'Proxy';

    constructor (facadeKey: string, initialData: any) {
        super(facadeKey);

        if (initialData) {
            this.setInitialData(initialData);
        }
    }

    setInitialData (data: any): void {

    }
}