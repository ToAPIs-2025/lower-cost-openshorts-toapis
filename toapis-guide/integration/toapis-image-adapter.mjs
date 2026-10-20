import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

/** Original optional ImageGenerationAdapter; no OpenShorts/AO registration is implied. */
export function createToAPIsImageAdapter({baseURL, token, model='gpt-image-2-vip', outputDir, runId}) {
 const url=new URL(baseURL);
 if(url.protocol!=='http:'||url.hostname!=='127.0.0.1'||url.pathname.replace(/\/$/,'')!=='/v1')throw new Error('An authenticated loopback /v1 bridge is required');
 if(!token||token.length<24||!runId||!path.isAbsolute(outputDir))throw new Error('Set a separate bridge token, stable run ID, and absolute output directory');
 if(!['gpt-image-2-vip','gpt-image-2','gpt-image-2.5-flare'].includes(model))throw new Error('Unsupported model preset');
 const manifest={apiVersion:1,id:'toapis-community-images',name:'ToAPIs community images',description:'Optional image asset adapter via loopback bridge',transport:'http',capabilities:['background','character-sheet','character','decoration'],requiresEnv:['BRIDGE_TOKEN'],documentation:'../README.md'};
 return {manifest,async generate(request,signal){
  if(!manifest.capabilities.includes(request.kind)||!request.prompt?.trim())throw new Error('Valid asset kind and prompt required');
  if(request.transparent||request.seed!==undefined||request.negativePrompt)throw new Error('Transparency, seed and negative prompt are outside this tested preset');
  const size=`${request.width}x${request.height}`;
  if(!['1536x864','1024x1024'].includes(size))throw new Error('Use 1536x864 or 1024x1024');
  const response=await fetch(baseURL.replace(/\/$/,'')+'/images/generations',{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({model,prompt:request.prompt,size,n:1,response_format:'b64_json',run_id:runId}),signal:signal??AbortSignal.timeout(900000)});
  if(!response.ok)throw new Error(`Bridge HTTP ${response.status}; inspect saved task before submitting again`);
  const result=await response.json();const bytes=Buffer.from(result.data?.[0]?.b64_json??'','base64');
  if(bytes.length<24||!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw new Error('Expected PNG artifact');
  const id=createHash('sha256').update(runId+'\0'+model+'\0'+request.prompt).digest('hex').slice(0,24);
  await mkdir(outputDir,{recursive:true});const file=path.join(outputDir,`${id}.png`);await writeFile(file,bytes);
  return [{path:file,mimeType:'image/png',width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20),prompt:request.prompt,providerMetadata:{provider:'toapis',model,runId,billing:result.billing??null,scope:'image asset only; AO registration and full rendering pending'}}];
 }};
}
