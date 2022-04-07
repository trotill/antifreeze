import Koa from "koa";
import serve from  'koa-static';
import router from 'koa-joi-router';
import {authRoute} from "./route/auth.js";
import {sseRoute} from "./route/sse.js";
import {deviceRoute} from "./route/device.js";
//import cors from '@koa/cors';
import dbService from './db/dbService.cjs'
import http2 from "http2"
import fs from "fs"
import mqttService from "./service/mqtt.js"
import deviceServiceFactory from "./service/device.js"
const deviceService=deviceServiceFactory({mqttService})

async function run() {

    let modelDb=await dbService.init();
    const {PORT=8080,HTTP2_MODE}=process.env
    const pubRouter = router();
    const app = new Koa();
    pubRouter.route(authRoute);
    pubRouter.route(sseRoute);
    pubRouter.route(deviceRoute);
   // app.use(cors());

    app.use(async (ctx, next) => {
        try {
            await next();

        } catch (err) {
            // will only respond with JSON
            ctx.status = err.statusCode || err.status || 500;
            ctx.body = {
                message: err.message
            };
        }
    })

    app.use(serve('front'));
    app.use(async (ctx, next) => {
        ctx.inject={
            modelDb,
            mqttService,
            deviceService
        }

        await next()


    })

    app.use(pubRouter.middleware());


    if (HTTP2_MODE==="true") {
        const options = {
            key: fs.readFileSync("./key/http2_private.key"),
            cert: fs.readFileSync("./key/http2_cert.crt")
        }

        http2.createSecureServer(options, app.callback())
            .listen(PORT, () => console.log("listening on port %i", PORT))
    }
    else
         app.listen(PORT,() => console.log("listening on port %i", PORT));

    mqttService.run()
}
run();
