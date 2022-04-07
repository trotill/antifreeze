
import {sse} from "../controller/sse.js";
import {needToken} from "../controller/auth.js";

let sseRoute=[
   {
        method: 'post',
        path: '/sse',
        handler: [needToken,sse]
    }]

export {sseRoute};