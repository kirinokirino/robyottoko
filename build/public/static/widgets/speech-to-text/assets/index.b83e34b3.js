import{d as x,c as a,t as h,a as l,b as u,o as c,e as k}from"./vendor.e2893d34.js";const y=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function s(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerpolicy&&(n.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?n.credentials="include":o.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(o){if(o.ep)return;o.ep=!0;const n=s(o);fetch(o.href,n)}};y();let d=[];const w=e=>{switch(e){case"error":d=["error"];break;case"info":d=["error","info"];break;case"log":d=["error","info","log"];break;case"debug":d=["error","info","log","debug"];break}};w("info");const f=(e,...t)=>{const s=e,i=o=>(...n)=>{d.includes(o)&&console[o](_("hh:mm:ss",new Date),`[${s}]`,...t,...n)};return{log:i("log"),info:i("info"),debug:i("debug"),error:i("error")}},_=(e,t)=>e.replace(/(hh|mm|ss)/g,(s,i)=>{switch(i){case"hh":return g(t.getHours(),"00");case"mm":return g(t.getMinutes(),"00");case"ss":return g(t.getSeconds(),"00");default:return s}}),g=(e,t)=>{const s=`${e}`;return s.length>=t.length?s:t.substr(0,t.length-s.length)+s},v=1001,p=4e3,m=f("WsWrapper.ts");class z{constructor(t,s){this.handle=null,this.reconnectTimeout=null,this.sendBuffer=[],this.onopen=()=>{},this.onclose=()=>{},this.onmessage=()=>{},this.addr=t,this.protocols=s}send(t){this.handle?this.handle.send(t):this.sendBuffer.push(t)}connect(){const t=new WebSocket(this.addr,this.protocols);t.onopen=s=>{for(this.reconnectTimeout&&clearTimeout(this.reconnectTimeout),this.handle=t;this.sendBuffer.length>0;){const i=this.sendBuffer.shift();i&&this.handle.send(i)}this.onopen(s)},t.onmessage=s=>{this.onmessage(s)},t.onclose=s=>{this.handle=null,s.code===p?m.info("custom disconnect, will not reconnect"):s.code===v?m.info("going away, will not reconnect"):this.reconnectTimeout=setTimeout(()=>{this.connect()},1e3),this.onclose(s)}}disconnect(){this.handle&&this.handle.close(p)}}const T=f("WsClient.ts");class S extends z{constructor(t,s){super(t,s);this._on={},this.onopen=i=>{this._dispatch("socket","open",i)},this.onmessage=i=>{if(this._dispatch("socket","message",i),this._on.message){const o=this._parseMessageData(i.data);o.event&&this._dispatch("message",`${o.event}`,o.data)}},this.onclose=i=>{this._dispatch("socket","close",i)}}onSocket(t,s){this.addEventListener("socket",t,s)}onMessage(t,s){this.addEventListener("message",t,s)}addEventListener(t,s,i){const o=Array.isArray(s)?s:[s];this._on[t]=this._on[t]||{};for(const n of o)this._on[t][n]=this._on[t][n]||[],this._on[t][n].push(i)}_parseMessageData(t){try{const s=JSON.parse(t);if(s.event)return{event:s.event,data:s.data||null}}catch(s){T.info(s)}return{event:null,data:null}}_dispatch(t,s,...i){const n=(this._on[t]||{})[s]||[];if(n.length!==0){T.log(`ws dispatch ${t} ${s}`);for(const r of n)r(...i)}}}const b=(e,t)=>`${window[e]!==`{{${e}}}`?window[e]:t}`,$=b("wsUrl",""),W=b("widgetToken","");var C={wsClient:e=>new S($+"/"+e,W)},R=(e,t)=>{const s=e.__vccOpts||e;for(const[i,o]of t)s[i]=o;return s};const O=x({data(){return{ws:null,status:"",textTimeoutMs:1e4,lastUtterance:null,lastRecognizedText:null,recognition:{interimResults:!1,continuous:!0},recognizedText:"",translatedText:"",recognizedTextTimeout:null,translatedTextTimeout:null,settings:null}},watch:{recognizedText(e,t){e&&(this.recognizedTextTimeout&&clearTimeout(this.recognizedTextTimeout),this.recognizedTextTimeout=setTimeout(()=>{this.recognizedText=""},this.textTimeoutMs))},translatedText(e,t){e&&(this.translatedTextTimeout&&clearTimeout(this.translatedTextTimeout),this.translatedTextTimeout=setTimeout(()=>{this.translatedText=""},this.textTimeoutMs))}},methods:{synthesize(e,t){if(this.lastUtterance!==e){this.lastUtterance=e;let s=new SpeechSynthesisUtterance(this.lastUtterance);t&&(s.lang=t),speechSynthesis.speak(s)}},applyStyles(){const e=this.settings.styles;e.bgColor!=null&&(document.bgColor=e.bgColor),e.vAlign==="top"?this.$refs.text_table.style.bottom=null:e.vAlign==="bottom"&&(this.$refs.text_table.style.bottom=0);const t=(s,i,o,n,r)=>{n.color!=null&&(i.style.color=n.color),r!=null&&(s.style.webkitTextStrokeColor=r),n.strokeWidth!=null&&(s.style.webkitTextStrokeWidth=n.strokeWidth+"pt",o.style.webkitTextStrokeWidth=n.strokeWidth+"pt"),n.strokeColor!=null&&(o.style.webkitTextStrokeColor=n.strokeColor),n.fontFamily!=null&&(s.style.fontFamily=n.fontFamily,i.style.fontFamily=n.fontFamily,o.style.fontFamily=n.fontFamily),n.fontSize!=null&&(s.style.fontSize=n.fontSize+"pt",i.style.fontSize=n.fontSize+"pt",o.style.fontSize=n.fontSize+"pt"),n.fontWeight!=null&&(s.style.fontWeight=n.fontWeight,i.style.fontWeight=n.fontWeight,o.style.fontWeight=n.fontWeight)};this.settings.recognition.display&&t(this.$refs["speech_text-imb"],this.$refs["speech_text-fg"],this.$refs["speech_text-bg"],e.recognition,e.bgColor),this.settings.translation.enabled&&t(this.$refs["trans_text-imb"],this.$refs["trans_text-fg"],this.$refs["trans_text-bg"],e.translation,e.bgColor)},initVoiceRecognition(){const e=window.SpeechRecognition||window.webkitSpeechRecognition;var t=new e;t.lang=this.settings.recognition.lang,t.interimResults=this.recognition.interimResults,t.continuous=this.recognition.continuous,t.onsoundstart=()=>{this.status="Sound started"},t.onnomatch=()=>{this.status="No match"},t.onerror=()=>{this.status="Error",t.stop(),this.initVoiceRecognition()},t.onsoundend=()=>{this.status="Sound ended",t.stop(),this.initVoiceRecognition()},t.onspeechend=()=>{this.status="Speech ended",t.stop(),this.initVoiceRecognition()},t.onresult=async s=>{this.onVoiceResult(s),t.stop(),this.initVoiceRecognition()},t.start()},onVoiceResult(e){for(var t=e.results,s=e.resultIndex;s<t.length;s++){const i=t[s][0].transcript;if(!t[s].isFinal){this.recognizedText="<<"+i+">>",this.translatedText="<<...>>";continue}if(this.lastRecognizedText!==i){if(this.lastRecognizedText=i,this.settings.recognition.synthesize&&this.synthesize(i,this.settings.recognition.synthesizeLang),this.recognizedText=this.lastRecognizedText,!this.settings.translation.enabled){this.translatedText="...";continue}this.translatedText="???",this.ws.send(JSON.stringify({event:"translate",text:i,src:this.settings.translation.langSrc,dst:this.settings.translation.langDst}))}}}},mounted(){this.ws=C.wsClient("speech-to-text"),this.ws.onMessage("translated",e=>{this.recognizedText=e.in,this.translatedText=e.out,this.settings.translation.synthesize&&this.synthesize(this.translatedText,this.settings.translation.synthesizeLang)}),this.ws.onMessage("init",e=>{this.settings=e.settings,this.$nextTick(()=>{this.applyStyles(),this.initVoiceRecognition()})}),this.ws.connect()}}),L={key:0,class:"big",ref:"result_text"},V={key:0},M={ref:"text_table",class:"btm_table"},N={align:"center",valign:"bottom"};function E(e,t,s,i,o,n){return e.settings?(c(),a("div",L,[e.settings.status.enabled?(c(),a("div",V,h(e.status),1)):l("",!0),u("table",M,[u("tr",null,[u("td",N,[e.settings.recognition.display?(c(),a("div",{key:0,class:"stroke-single-bg",ref:"speech_text-bg"},h(e.recognizedText),513)):l("",!0),e.settings.recognition.display?(c(),a("div",{key:1,class:"stroke-single-fg",ref:"speech_text-fg"},h(e.recognizedText),513)):l("",!0),e.settings.recognition.display?(c(),a("div",{key:2,class:"stroke-single-imb",ref:"speech_text-imb"},h(e.recognizedText),513)):l("",!0),e.settings.translation.enabled?(c(),a("div",{key:3,class:"stroke-single-bg",ref:"trans_text-bg"},h(e.translatedText),513)):l("",!0),e.settings.translation.enabled?(c(),a("div",{key:4,class:"stroke-single-fg",ref:"trans_text-fg"},h(e.translatedText),513)):l("",!0),e.settings.translation.enabled?(c(),a("div",{key:5,class:"stroke-single-imb",ref:"trans_text-imb"},h(e.translatedText),513)):l("",!0)])])],512)],512)):l("",!0)}var F=R(O,[["render",E]]);const A=k(F);A.mount("#app");
