import {Facade} from "../facade/Facade";

export class FacadeMember {
    facadeKey: string;

    constructor (facadeKey: string) {
            this.facadeKey = facadeKey;
    }

    facade (): Facade {
        return Facade.getInstance(this.facadeKey);
    }
}
