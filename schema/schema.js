import Joi from 'joi'

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
  disable: Joi.boolean(),
  email: Joi.string().max(userStrMaxLen).min(userStrMinLen).allow('')
})

export const putUserGroupIn = Joi.object().keys({
  login: Joi.string().required().max(userStrMaxLen).min(userStrMinLen),
  group: Joi.alternatives().try(
    Joi.string().valid('admin'),
    Joi.string().valid('user')
  ).required()
})

const userData = Joi.object().keys({
  login: Joi.string().required(),
  group: Joi.string().required(),
  password: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().allow(''),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  disable: Joi.boolean()
})
export const getUserOut = responseFormatJoi(userData)

export const getUserListOut = responseFormatJoi(Joi.array().items(userData))

export const getEventListIn = Joi.object().keys({
  where: Joi.object(),
  limit: Joi.number(),
  offset: Joi.number(),
  order: Joi.array()
})

export const getEventListOut = responseFormatJoi(Joi.object().keys({
  list: Joi.object().keys({
    id: Joi.array().items(Joi.number()).required(),
    ts: Joi.array().items(Joi.number()).required(),
    eventId: Joi.array().items(Joi.string()).required(),
    status: Joi.array().items(Joi.number()).required(),
    read: Joi.array().items(Joi.number()).required(),
    deviceId: Joi.array().items(Joi.string()).required(),
    prio: Joi.array().items(Joi.number()).required(),
    value: Joi.array().items(Joi.string()).required()
  }).allow(null),
  count: Joi.number()
}))

export const getEventLastOut = responseFormatJoi(Joi.array().items(Joi.object().keys({
  ts: Joi.number().required(),
  eventId: Joi.string().required(),
  status: Joi.boolean().required(),
  deviceId: Joi.string().required(),
  prio: Joi.number().required(),
  value: Joi.object().required(),
  createdAt: Joi.object(),
  updatedAt: Joi.object()
})))

export const getSensorListIn = Joi.object().keys({
  where: Joi.object(),
  limit: Joi.number(),
  offset: Joi.number(),
  order: Joi.string(),
  fieldList: Joi.array().items(Joi.string()),
  group: Joi.array().items(Joi.string())
})
