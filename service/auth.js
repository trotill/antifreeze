import jwt from "jsonwebtoken"
import fs from "fs"
import path from "path"
import {error} from "../api/error.js";


class AuthService{
    constructor() {
         this.publicKey=fs.readFileSync(path.resolve("../back/key/public.pem")).toString();
         this.privateKey=fs.readFileSync(path.resolve("../back/key/private.pem")).toString();

    }
    //v2

    async checkLogin({password,login,modelDb}){

        const findUser = await modelDb.userModel.findAll({
            where:{
                login:login
            }
        }).then((result)=>{
            return result.map(item=>item.toJSON())
        });
        await new Promise(resolve=> setTimeout(resolve,100));

        if (findUser.length===0)
            return false;

        if (findUser[0].password!==password)
            console.log("incorrect password");

        return (findUser[0].password===password);
    }
    async checkTokenAccessExpired({accessDec,refreshDec,modelDb}){
        if ((accessDec.err==='TokenExpiredError')&&(refreshDec.err==='')){
            //find password from DB and regen tokens
            const login=refreshDec.decoded.login
            const findUser = await modelDb.userModel.findAll({
                where:{
                    login
                }
            });
            // console.log('findUser',findUser);
            if (findUser.length!==0){
                const {access,refresh}=await this.regenJWT({login});
                console.log('access and refresh regenerated',refreshDec)
                return {
                    error:null,
                    login,
                    token: {
                        access,
                        refresh
                    }
                }
            }
        }
        return null;
    }
    async checkToken({token,modelDb}){
        let accessDec=await this.checkJWT({token:token.access});
        let refreshDec=await this.checkJWT({token:token.refresh});

        const result=await this.checkTokenAccessExpired({accessDec,refreshDec,modelDb})
        if (result) return result;

        if ((accessDec.err==='')&&(refreshDec.err==='')){
            console.log('good tokens')
            return {
                login:refreshDec.decoded.login,
                error:null,
                token
            }
        }
        console.log('access and refresh obsolete')
        return {
            login:null,
            error:error.tokenError,
            token:null
        }
    }

    async checkJWT({token}){
        return new Promise((resolve)=> {
           // console.log('publicKey', this.publicKey);
            try {
                jwt.verify(token, this.publicKey, function(err, decoded) {
                   // console.log('succes JWT', decoded);
                    let errName="";
                    if (err) {
                        errName=err.name;
                        //console.log('errName',err.name,'expiredAt',err.expiredAt)
                    }
                    resolve({err:errName,decoded})
                });

            } catch (err) {
                //console.log('error JWT', err);
                resolve({err:"UNDEF_ERROR",decoded:{}})
            }
        });
    }
    async regenJWT({password,login}){

        let accessToken=jwt.sign({ login: login,type:"access" }, this.privateKey, { algorithm: 'RS256',expiresIn:process.env.ACCESS_TIMEOUT});
        let refreshToken=jwt.sign({ login: login,type:"refresh" }, this.privateKey, { algorithm: 'RS256',expiresIn:process.env.REFRESH_TIMEOUT });
        //console.log("accessToken",accessToken);
       // console.log("refreshToken",refreshToken);
        return {
            access:accessToken,
            refresh:refreshToken
        }
    }

}

let authService
export default authService||(authService=new AuthService());
