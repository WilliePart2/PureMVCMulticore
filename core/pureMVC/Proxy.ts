import {FacadeMember} from "./core/FacadeMember";

export class Proxy extends FacadeMember {
    constructor (facadeKey: string, initialData: any) {
        super(facadeKey);

        if (initialData) {
            this.setInitialData(initialData);
        }
    }

    setInitialData (data: any): void {

    }
}