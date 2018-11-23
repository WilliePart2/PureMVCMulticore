import {Facade} from "../facade/Facade";

export class FacadeMember {
    facadeKey: string;

    constructor (key: string) {
        this.facadeKey = key;
    }

    facade (): Facade {
        return Facade.getInstance(this.facadeKey);
    }
}
