export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({msg:"只支持POST"}), {status:405, headers:{"Content-Type":"application/json"}})
  }
  try {
    const {prompt} = await req.json()
    const API_KEY = process.env.API_KEY
    const TOONFLOW_API_URL = process.env.TOONFLOW_API_URL
    if(!API_KEY|| !TOONFLOW_API_URL){
      return new Response(JSON.stringify({msg:"环境变量缺失"}), {status:500, headers:{"Content-Type":"application/json"}})
    }
    const res = await fetch(TOONFLOW_API_URL,{
      method:"POST",
      headers:{
        "Authorization":`Bearer ${API_KEY}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({prompt})
    })
    const data = await res.json()
    return new Response(JSON.stringify(data),{headers:{"Content-Type":"application/json"}})
  }catch(e){
    return new Response(JSON.stringify({msg:e.message}),{status:500, headers:{"Content-Type":"application/json"}})
  }
}
