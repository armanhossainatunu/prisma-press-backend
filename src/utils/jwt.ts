import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"

const createToken =(payload:JwtPayload , secrat : string, expiresIn : SignOptions)=>{
    const token = jwt.sign(payload, secrat, {expiresIn: expiresIn} as SignOptions)
    return token
}

const verifyToken = (token : string, secrat : string)=>{
   try {
     const payload = jwt.verify(token, secrat)
    return payload
   } catch (error ) {
    console.log("Token verification failed" , error);
    throw new Error("Invalid token")
    
   }
}


export const jwtUtils={
    createToken,
    verifyToken
}