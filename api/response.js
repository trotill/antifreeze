export function responseFormat({data,error='',token={}}){
    return {
        data,
        meta: {
            error,
            token
        }
    }
}
