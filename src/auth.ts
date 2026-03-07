import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { FailedLogin, SuccesLogin } from "./types/authInterface";

export const authOptions:NextAuthOptions={
    pages:{
        signIn:'/login'
    },
    providers:[
        Credentials({
            name:'credentials',
            credentials:{
                email:{},
                password:{}
            },
            authorize:async(credentials)=>{
                const response = await fetch(`${process.env.API}/users/signin`,{
                    method:'POST',
                    body:JSON.stringify({
                        email:credentials?.email,
                        password:credentials?.password
                    }),
                    headers:{
                        'Content-type':'application/json'
                    }
                })
                const payload:SuccesLogin | FailedLogin =await response.json()
                console.log(payload);
                
                if('data' in payload){

                    return{
                        id:payload.data.user.email,
                        user:payload.data.user,
                        token:payload.data.token
                    }
                }else{
                    throw new Error(payload.message)
                }
            }
        })
    ],
    callbacks:{
        jwt:({token , user})=>{
            if(user){
                token.user=user.user
                token.token=user.token
            }
            return token
        },
        session:({session,token})=>{
            session.user=token.user
            return session
        }
    }
}