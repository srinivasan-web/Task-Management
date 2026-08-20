import { api } from './api';
export type AuthResponse={data:{user:{id:string;name:string;email:string};accessToken:string}};
export const authApi={ login:(email:string,password:string)=>api<AuthResponse>('/auth/login',{method:'POST',body:JSON.stringify({email,password})}), register:(name:string,email:string,password:string)=>api<AuthResponse>('/auth/register',{method:'POST',body:JSON.stringify({name,email,password})}) };
