import {Facade} from "../facade/Facade";
import { Notification } from "../notification/Notification";

export class FacadeMember {
    facadeKey: string;

    constructor (facadeKey: string) {
            this.facadeKey = facadeKey;
    }

    facade (): Facade {
        return Facade.getInstance(this.facadeKey);
    }

    sendNotificationToAll <T extends Notification<any>>(notification: T, body?: T[keyof T], type?: string): Promise<any> {
        return Promise.all(Object.keys(Facade.instancesMap)
                    .map((facadeName: string) => {
                        if (Facade.hasCore(facadeName)) {
                            Facade.getInstance(facadeName).sendNotification(notification, body, type);
                        }
                    })
                );
    }
}
