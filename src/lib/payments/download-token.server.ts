import { createHmac, timingSafeEqual } from "node:crypto";
function secret(){const value=process.env.REPORT_DOWNLOAD_SECRET??process.env.STRIPE_SECRET_KEY;if(!value)throw new Error("REPORT_DOWNLOAD_SECRET is not configured");return value;}
function encode(value:string){return Buffer.from(value,"utf8").toString("base64url");}
function decode(value:string){return Buffer.from(value,"base64url").toString("utf8");}
function sign(payload:string){return createHmac("sha256",secret()).update(payload).digest("base64url");}
export function createReportDownloadToken(userId:string,reportId:string,ttlSeconds=60*60*24*7){const exp=Math.floor(Date.now()/1000)+ttlSeconds;const encoded=encode(`${userId}|${reportId}|${exp}`);return `${encoded}.${sign(encoded)}`;}
export function verifyReportDownloadToken(token:string){const[encoded,supplied]=token.split(".");if(!encoded||!supplied)return null;const expected=sign(encoded);const a=Buffer.from(supplied),b=Buffer.from(expected);if(a.length!==b.length||!timingSafeEqual(a,b))return null;const[userId,reportId,expRaw]=decode(encoded).split("|");const exp=Number(expRaw);if(!userId||!reportId||!Number.isFinite(exp)||exp<Math.floor(Date.now()/1000))return null;return{userId,reportId,exp};}
