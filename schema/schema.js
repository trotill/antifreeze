import Joi from 'joi'

//import router from 'koa-joi-router';
//const Joi = router.Joi;

const responseFormatJoi=(data)=>Joi.object().keys({
    meta:Joi.object({
        error:Joi.string().allow(null),
        token:Joi.object().keys({
            access:Joi.string(),
            refresh:Joi.string()
        }).allow(null)
    }),
    data
})

export const getWhoAmiBodyOut=responseFormatJoi(Joi.object().keys({
    login:Joi.string().allow('')
}).allow(null))

export const postSetDevDataBodyOut=responseFormatJoi(null).allow(null)

export const postLoginBodyIn=Joi.object().keys({
    login: Joi.string().required().max(200),
    password: Joi.string().required().max(200),
})

export const postLoginBodyOut=responseFormatJoi(null).allow(null)
