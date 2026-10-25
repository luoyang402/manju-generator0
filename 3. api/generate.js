const axios = require('axios');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');

  if(req.method === 'OPTIONS') return res.status(200).end();
  if(req.method !== "POST") return res.status(405).json({code:405,msg:"仅支持POST请求"});

  const {content} = req.body;
  if(!content) return res.status(400).json({code:400,msg:"缺少小说文本"});

  // 从Vercel后台环境变量读取，安全，不会泄露
  const TOONFLOW_API_URL = process.env.TOONFLOW_API_URL;
  const API_KEY = process.env.API_KEY;

  if(!TOONFLOW_API_URL || !API_KEY){
    return res.status(500).json({code:500,msg:"后台未配置接口密钥"});
  }

  try{
    const prompt = `你是漫剧短视频编剧，把下面小说原文改成爆款漫剧文案+无字幕分镜脚本，分段清晰：
【原文】
${content}
输出格式：
=====爆款短视频文案=====
xxx
=====分镜脚本=====
1、镜头：xxx
画面：xxx
动作：xxx
`;
    const resp = await axios.post(TOONFLOW_API_URL,{
      prompt
    },{
      headers:{
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type":"application/json"
      },
      timeout:55000
    })
    return res.status(200).json({code:200, data: resp.data.result});
  }catch(e){
    console.log(e);
    return res.status(500).json({code:500,msg:"接口调用异常，请核对密钥和接口地址"});
  }
}
