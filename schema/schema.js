import Joi from 'joi'

// import router from 'koa-joi-router';
// const Joi = router.Joi;
const userStrMaxLen = 200
const userStrMinLen = 5
const responseFormatJoi = (data) => Joi.object().keys({
  meta: Joi.object({
    error: Joi.string().allow(null),
    token: Joi.object().keys({
      access: Joi.string(),
      refresh: Joi.string()
    }).allow(null)
  }),
  data
})

export const getWhoAmiBodyOut = responseFormatJoi(Joi.object().keys({
  login: Joi.string().allow(''),
  group: Joi.string().allow('')
}).allow(null))

export const postSetDevDataBodyOut = responseFormatJoi(null).allow(null)

export const postLoginBodyIn = Joi.object().keys({
  login: Joi.string().required().max(userStrMaxLen).min(userStrMinLen),
  password: Joi.string().required().max(userStrMaxLen).min(userStrMinLen)
})

export const postLoginBodyOut = responseFormatJoi(null).allow(null)

export const getRefreshToken = Joi.object().keys({
  access: Joi.string(),
  refresh: Joi.string()
})

export const postUserIn = Joi.object().keys({
  login: Joi.string().required().max(userStrMaxLen).min(userStrMinLen),
  password: Joi.string().required().max(userStrMaxLen).min(userStrMinLen),
  firstName: Joi.string().required().max(userStrMaxLen).min(1),
  lastName: Joi.string().required().max(userStrMaxLen).min(1),
  email: Joi.string().required().max(userStrMaxLen).min(userStrMinLen).allow('')
})

export const putUserIn = Joi.object().keys({
  login: Joi.string().required().max(userStrMaxLen).min(userStrMinLen),
  password: Joi.string().max(userStrMaxLen).min(userStrMinLen),
  firstName: Joi.string().max(userStrMaxLen).min(1),
  lastName: Joi.string().max(userStrMaxLen).min(1),
  email: Joi.string().max(userStrMaxLen).min(userStrMinLen).empty()
})

export const putUserGroupIn = Joi.object().keys({
  login: Joi.string().required().max(userStrMaxLen).min(userStrMinLen),
  group: Joi.alternatives().try(
    Joi.string().valid('admin'),
    Joi.string().valid('user')
  ).required()
})

export const getUserIn = Joi.object().keys({
  login: Joi.string().max(userStrMaxLen).min(userStrMinLen)
})

export const getUserOut = responseFormatJoi(Joi.array().items(Joi.object().keys({
  login: Joi.string().required(),
  group: Joi.string().required(),
  password: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().empty(),
  createdAt: Joi.date(),
  updatedAt: Joi.date()
})))
