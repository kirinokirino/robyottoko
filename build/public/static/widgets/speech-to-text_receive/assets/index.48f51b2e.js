import{d as x,c as l,a as w,t as c,b as u,F as T,r as _,e as h,o as a,f as z}from"./vendor.2840cbea.js";const v=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function s(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerpolicy&&(n.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?n.credentials="include":o.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(o){if(o.ep)return;o.ep=!0;const n=s(o);fetch(o.href,n)}};v();let g=[];const O=t=>{switch(t){case"error":g=["error"];break;case"info":g=["error","info"];break;case"log":g=["error","info","log"];break;case"debug":g=["error","info","log","debug"];break}};O("info");const f=(t,...e)=>{const s=t,i=o=>(...n)=>{g.includes(o)&&console[o]($("hh:mm:ss",new Date),`[${s}]`,...e,...n)};return{log:i("log"),info:i("info"),debug:i("debug"),error:i("error")}},$=(t,e)=>t.replace(/(hh|mm|ss)/g,(s,i)=>{switch(i){case"hh":return p(e.getHours(),"00");case"mm":return p(e.getMinutes(),"00");case"ss":return p(e.getSeconds(),"00");default:return s}}),p=(t,e)=>{const s=`${t}`;return s.length>=e.length?s:e.substr(0,e.length-s.length)+s},C=t=>{const e=t.replace(/\W/g,"");return Math.floor(e.length*1e3/12)},W=1001,m=4e3,b=f("WsWrapper.ts");class R{constructor(e,s){this.handle=null,this.reconnectTimeout=null,this.sendBuffer=[],this.onopen=()=>{},this.onclose=()=>{},this.onmessage=()=>{},this.addr=e,this.protocols=s}send(e){this.handle?this.handle.send(e):this.sendBuffer.push(e)}connect(){const e=new WebSocket(this.addr,this.protocols);e.onopen=s=>{for(this.reconnectTimeout&&clearTimeout(this.reconnectTimeout),this.handle=e;this.sendBuffer.length>0;){const i=this.sendBuffer.shift();i&&this.handle.send(i)}this.onopen(s)},e.onmessage=s=>{this.onmessage(s)},e.onclose=s=>{this.handle=null,s.code===m?b.info("custom disconnect, will not reconnect"):s.code===W?b.info("going away, will not reconnect"):this.reconnectTimeout=setTimeout(()=>{this.connect()},1e3),this.onclose(s)}}disconnect(){this.handle&&this.handle.close(m)}}const y=f("WsClient.ts");class j extends R{constructor(e,s){super(e,s);this._on={},this.onopen=i=>{this._dispatch("socket","open",i)},this.onmessage=i=>{if(this._dispatch("socket","message",i),this._on.message){const o=this._parseMessageData(i.data);o.event&&this._dispatch("message",`${o.event}`,o.data)}},this.onclose=i=>{this._dispatch("socket","close",i)}}onSocket(e,s){this.addEventListener("socket",e,s)}onMessage(e,s){this.addEventListener("message",e,s)}addEventListener(e,s,i){const o=Array.isArray(s)?s:[s];this._on[e]=this._on[e]||{};for(const n of o)this._on[e][n]=this._on[e][n]||[],this._on[e][n].push(i)}_parseMessageData(e){try{const s=JSON.parse(e);if(s.event)return{event:s.event,data:s.data||null}}catch(s){y.info(s)}return{event:null,data:null}}_dispatch(e,s,...i){const n=(this._on[e]||{})[s]||[];if(n.length!==0){y.log(`ws dispatch ${e} ${s}`);for(const r of n)r(...i)}}}const k=(t,e)=>`${window[t]!==`{{${t}}}`?window[t]:e}`,L=k("wsUrl",""),M=k("widgetToken","");var V={wsClient:t=>new j(L+"/"+t,M)},E=(t,e)=>{const s=t.__vccOpts||t;for(const[i,o]of e)s[i]=o;return s};const d=f("speech-to-text/Page.vue"),N=x({props:{controls:{type:Boolean,required:!0}},data(){return{ws:null,status:"",errors:[],initedSpeech:!1,lastUtterance:"",recognition:{interimResults:!1,continuous:!0},texts:[],timeout:null,settings:null,srObj:null}},computed:{recognizedText(){return this.texts.length===0||!this.texts[0].ready?"":this.texts[0].recognized},translatedText(){return this.texts.length===0||!this.texts[0].ready?"":this.texts[0].translated},lastRecognizedText(){if(this.texts.length===0)return"";this.texts[this.texts.length-1].recognized},wantsSpeech(){return this.settings.recognition.synthesize||this.settings.translation.synthesize}},methods:{initSpeech(){d.log(speechSynthesis),speechSynthesis.cancel(),speechSynthesis.resume(),this.initedSpeech=!0},_next(){if(this.timeout){d.info("_next(): timeout still active");return}if(!this.recognizedText&&!this.translatedText){d.info("_next(): recognizedText and translatedText empty");return}this.recognizedText&&this.settings.recognition.synthesize&&(d.info("synthesizing recognized text"),this.synthesize(this.recognizedText,this.settings.recognition.synthesizeLang)),this.translatedText&&this.settings.translation.synthesize&&(d.info("synthesizing translated text"),this.synthesize(this.translatedText,this.settings.translation.synthesizeLang)),this.timeout=setTimeout(()=>{this.texts.shift(),this.timeout=null,this._next()},this.calculateSubtitleDisplayTime(`${this.recognizedText} ${this.translatedText}`))},calculateSubtitleDisplayTime(t){const e=C(t);return Math.min(1e4,Math.max(2e3,e))},synthesize(t,e){if(d.info("synthesize",this.lastUtterance,t,e),this.lastUtterance!==t){d.info("speechSynthesis",speechSynthesis),this.lastUtterance=t;let s=new SpeechSynthesisUtterance(`${this.lastUtterance}`);e&&(s.lang=e),speechSynthesis.cancel(),speechSynthesis.speak(s)}},applyStyles(){const t=this.settings.styles;t.bgColorEnabled&&t.bgColor!=null?document.body.style.backgroundColor=t.bgColor:document.body.style.backgroundColor="",t.vAlign==="top"?this.$refs.text_table.style.bottom=null:t.vAlign==="bottom"&&(this.$refs.text_table.style.bottom=0);const e=(s,i,o,n,r)=>{n.color!=null&&(i.style.color=n.color),r!=null&&(s.style.webkitTextStrokeColor=r),n.strokeWidth!=null&&(s.style.webkitTextStrokeWidth=n.strokeWidth,o.style.webkitTextStrokeWidth=n.strokeWidth),n.strokeColor!=null&&(o.style.webkitTextStrokeColor=n.strokeColor),n.fontFamily!=null&&(s.style.fontFamily=n.fontFamily,i.style.fontFamily=n.fontFamily,o.style.fontFamily=n.fontFamily),n.fontSize!=null&&(s.style.fontSize=n.fontSize,i.style.fontSize=n.fontSize,o.style.fontSize=n.fontSize),n.fontWeight!=null&&(s.style.fontWeight=n.fontWeight,i.style.fontWeight=n.fontWeight,o.style.fontWeight=n.fontWeight)};this.settings.recognition.display&&e(this.$refs["speech_text-imb"],this.$refs["speech_text-fg"],this.$refs["speech_text-bg"],t.recognition,t.bgColor),this.settings.translation.enabled&&e(this.$refs["trans_text-imb"],this.$refs["trans_text-fg"],this.$refs["trans_text-bg"],t.translation,t.bgColor)},initVoiceRecognition(){if(!this.controls)return;const t=window.SpeechRecognition||window.webkitSpeechRecognition;if(!t){alert("This widget does not work in this browser. Try a chrome based browser.");return}this.srObj&&(this.srObj.abort(),this.srObj.stop()),this.srObj=new t,this.srObj.lang=this.settings.recognition.lang,this.srObj.interimResults=this.recognition.interimResults,this.srObj.continuous=this.recognition.continuous,this.srObj.onsoundstart=()=>{this.status="Sound started"},this.srObj.onnomatch=()=>{this.status="No match"},this.srObj.onerror=e=>{this.status="Error",this.errors.unshift(e.error),this.errors=this.errors.slice(0,10),this.initVoiceRecognition()},this.srObj.onsoundend=()=>{this.status="Sound ended",this.initVoiceRecognition()},this.srObj.onspeechend=()=>{this.status="Speech ended",this.initVoiceRecognition()},this.srObj.onresult=async e=>{this.onVoiceResult(e),this.initVoiceRecognition()},this.srObj.start()},onVoiceResult(t){let e=t.results;d.info("onVoiceResult()",t);for(var s=t.resultIndex;s<e.length;s++){if(!e[s].isFinal)continue;const i=e[s][0].transcript;if(this.lastRecognizedText!==i){this.ws.send(JSON.stringify({event:"onVoiceResult",text:i}));break}}}},mounted(){this.ws=V.wsClient("speech-to-text"),this.ws.onMessage("text",t=>{this.texts.push({recognized:t.recognized,translated:t.translated,ready:!0}),this._next()}),this.ws.onMessage("init",t=>{this.settings=t.settings,this.$nextTick(()=>{this.applyStyles(),this.initVoiceRecognition()})}),this.ws.connect()}}),F={key:0,class:"big",ref:"result_text"},D={key:0},U={key:0},A=u("div",null,"Latest errors:",-1),B={ref:"text_table",class:"btm_table"},I={align:"center",valign:"bottom"};function P(t,e,s,i,o,n){return t.settings?(a(),l("div",F,[t.settings.status.enabled?(a(),l("div",D,[w(c(t.status)+" ",1),t.errors.length>0?(a(),l("div",U,[A,u("ul",null,[(a(!0),l(T,null,_(t.errors,(r,S)=>(a(),l("li",{key:S},c(r),1))),128))])])):h("",!0)])):h("",!0),t.controls&&t.wantsSpeech&&!t.initedSpeech?(a(),l("button",{key:1,onClick:e[0]||(e[0]=(...r)=>t.initSpeech&&t.initSpeech(...r))}," Enable Speech Synthesis ")):h("",!0),u("table",B,[u("tr",null,[u("td",I,[t.settings.recognition.display?(a(),l("div",{key:0,class:"stroke-single-bg",ref:"speech_text-bg"},c(t.recognizedText),513)):h("",!0),t.settings.recognition.display?(a(),l("div",{key:1,class:"stroke-single-fg",ref:"speech_text-fg"},c(t.recognizedText),513)):h("",!0),t.settings.recognition.display?(a(),l("div",{key:2,class:"stroke-single-imb",ref:"speech_text-imb"},c(t.recognizedText),513)):h("",!0),t.settings.translation.enabled?(a(),l("div",{key:3,class:"stroke-single-bg",ref:"trans_text-bg"},c(t.translatedText),513)):h("",!0),t.settings.translation.enabled?(a(),l("div",{key:4,class:"stroke-single-fg",ref:"trans_text-fg"},c(t.translatedText),513)):h("",!0),t.settings.translation.enabled?(a(),l("div",{key:5,class:"stroke-single-imb",ref:"trans_text-imb"},c(t.translatedText),513)):h("",!0)])])],512)],512)):h("",!0)}var q=E(N,[["render",P]]);const G=z(q,{controls:!1});G.mount("#app");
