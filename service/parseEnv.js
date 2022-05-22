import dotenv from 'dotenv'

const env = dotenv.config({ path: '.env' })
console.log('ENV:', env)
