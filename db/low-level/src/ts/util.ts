
// File: util.ts
//
// Some utility functions
//

import { Response } from 'web-request';
// import { Request } from "web-request";

export class SafeError extends Error {
    public message: string;
    public res: Response<any>;
    constructor(message : string, res: Response<any>) {
        super(message);
        this.res = res;
    }
}

// for use in a promise context
export async function saneResponse<T>(response : Promise<Response<T>>): Promise<Response<T>> {
    return response.then( (res) => {

        if (res.statusCode === 401) { // 401 means that we were denied by the user
            throw new SafeError( 'Auth denied by safe launcher.', res );
        } else if (res.statusCode === 404) {
            throw new SafeError( 'endpoint not found.', res );

        // we should at least be in the 200 status code range
        } else if (Math.floor(res.statusCode / 100) !== 2) {
            throw new SafeError(`statusCode=${res.statusCode}`, res);
        } else {
            return res;
        }
    }).catch( (err) => { throw err; } );
}
