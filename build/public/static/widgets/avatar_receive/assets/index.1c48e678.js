import{d as g,c as l,n as c,o as a,r as _,a as $,F as S,b as T,e as D,f as N,g as C}from"./vendor.7f7fabf4.js";const O=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function s(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerpolicy&&(r.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?r.credentials="include":n.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(n){if(n.ep)return;n.ep=!0;const r=s(n);fetch(n.href,r)}};O();let h=[];const x=e=>{switch(e){case"error":h=["error"];break;case"info":h=["error","info"];break;case"log":h=["error","info","log"];break;case"debug":h=["error","info","log","debug"];break}};x("info");const u=(e,...t)=>{const s=e,i=n=>(...r)=>{h.includes(n)&&console[n](L("hh:mm:ss",new Date),`[${s}]`,...t,...r)};return{log:i("log"),info:i("info"),debug:i("debug"),error:i("error")}},L=(e,t)=>e.replace(/(hh|mm|ss)/g,(s,i)=>{switch(i){case"hh":return d(t.getHours(),"00");case"mm":return d(t.getMinutes(),"00");case"ss":return d(t.getSeconds(),"00");default:return s}}),d=(e,t)=>{const s=`${e}`;return s.length>=t.length?s:t.substr(0,t.length-s.length)+s};var m=(e,t)=>{const s=e.__vccOpts||e;for(const[i,n]of t)s[i]=n;return s};const E=g({props:{frames:{type:Array,required:!0},width:{type:Number,required:!1,default:64},height:{type:Number,required:!1,default:64}},data(){return{timeout:null,idx:-1}},computed:{src(){return this.idx>=0&&this.idx<this.frames.length?this.frames[this.idx].url:""}},methods:{nextFrame(){if(this.frames.length===0){this.idx=-1;return}this.timeout&&(clearTimeout(this.timeout),this.timeout=null),this.idx++,this.idx>=this.frames.length&&(this.idx=0),this.timeout=setTimeout(()=>{this.nextFrame()},this.frames[this.idx].duration)}},created(){this.nextFrame(),this.$watch("frames",()=>{this.idx=-1,this.nextFrame()},{deep:!0})},unmounted(){this.timeout&&(clearTimeout(this.timeout),this.timeout=null)}}),A=["src","width","height"];function B(e,t,s,i,n,r){return a(),l("span",{class:"avatar-animation",style:c({width:`${e.width}px`,height:`${e.width}px`})},[e.src?(a(),l("img",{key:0,src:e.src,width:e.width,height:e.height},null,8,A)):(a(),l("span",{key:1,style:c({width:`${e.width}px`,height:`${e.width}px`,display:"inline-block"})},null,4))],4)}var M=m(E,[["render",B]]);const W=1001,p=4e3,b=u("WsWrapper.ts");class F{constructor(t,s){this.handle=null,this.reconnectTimeout=null,this.sendBuffer=[],this.onopen=()=>{},this.onclose=()=>{},this.onmessage=()=>{},this.addr=t,this.protocols=s}send(t){this.handle?this.handle.send(t):this.sendBuffer.push(t)}connect(){const t=new WebSocket(this.addr,this.protocols);t.onopen=s=>{for(this.reconnectTimeout&&clearTimeout(this.reconnectTimeout),this.handle=t;this.sendBuffer.length>0;){const i=this.sendBuffer.shift();i&&this.handle.send(i)}this.onopen(s)},t.onmessage=s=>{this.onmessage(s)},t.onclose=s=>{this.handle=null,s.code===p?b.info("custom disconnect, will not reconnect"):s.code===W?b.info("going away, will not reconnect"):this.reconnectTimeout=setTimeout(()=>{this.connect()},1e3),this.onclose(s)}}disconnect(){this.handle&&this.handle.close(p)}}const w=u("WsClient.ts");class z extends F{constructor(t,s){super(t,s);this._on={},this.onopen=i=>{this._dispatch("socket","open",i)},this.onmessage=i=>{if(this._dispatch("socket","message",i),this._on.message){const n=this._parseMessageData(i.data);n.event&&this._dispatch("message",`${n.event}`,n.data)}},this.onclose=i=>{this._dispatch("socket","close",i)}}onSocket(t,s){this.addEventListener("socket",t,s)}onMessage(t,s){this.addEventListener("message",t,s)}addEventListener(t,s,i){const n=Array.isArray(s)?s:[s];this._on[t]=this._on[t]||{};for(const r of n)this._on[t][r]=this._on[t][r]||[],this._on[t][r].push(i)}_parseMessageData(t){try{const s=JSON.parse(t);if(s.event)return{event:s.event,data:s.data||null}}catch(s){w.info(s)}return{event:null,data:null}}_dispatch(t,s,...i){const r=(this._on[t]||{})[s]||[];if(r.length!==0){w.log(`ws dispatch ${t} ${s}`);for(const o of r)o(...i)}}}const k=(e,t)=>`${window[e]!==`{{${e}}}`?window[e]:t}`,I=k("wsUrl",""),q=k("widgetToken","");var P={wsClient:e=>new z(I+"/"+e,q)};const f=u("Page.vue"),J=g({components:{AvatarAnimation:M},data(){return{ws:null,speaking:!1,lockedState:"default",initialized:!1,tuber:{slot:{}},tuberDef:null,settings:null}},computed:{animationName(){return this.lockedState!=="default"?this.lockedState:this.speaking?"speaking":"default"},animations(){return this.tuberDef?this.tuberDef.slotDefinitions.map(e=>{const t=e.items[this.tuber.slot[e.slot]],s=t.states.find(({state:i})=>i===this.animationName);return s&&s.frames.length>0?s:t.states.find(({state:i})=>i==="default")}):[]}},methods:{setSlot(e,t){this.tuber.slot[e]=t,this.tuber.slot=Object.assign({},this.tuber.slot)},setSpeaking(e){this.speaking!==e&&(this.speaking=e)},lockState(e){this.lockedState!==e&&(this.lockedState=e)},setTuber(e){if(!this.settings){f.error("setTuber: this.settings not initialized");return}if(e<0||e>=this.settings.avatarDefinitions.length){f.error("setTuber: index out of bounds");return}const t=this.settings.avatarDefinitions[e];this.tuber.slot={},this.tuberDef=JSON.parse(JSON.stringify(t)),this.tuberDef.slotDefinitions.forEach(s=>{this.tuber.slot[s.slot]=s.defaultItemIndex})},applyStyles(){if(!this.settings){f.error("applyStyles: this.settings not initialized");return}const e=this.settings.styles;e.bgColor!=null&&(document.bgColor=e.bgColor)}},mounted(){this.ws=P.wsClient("avatar"),this.ws.onMessage("init",e=>{this.settings=e.settings,this.$nextTick(()=>{this.applyStyles()}),this.setTuber(0),this.initialized=!0}),this.ws.onMessage("ctrl",({data:e})=>{if(e.ctrl==="setSlot"){const t=e.args[0],s=e.args[1];this.setSlot(t,s)}else if(e.ctrl==="setSpeaking"){const t=e.args[0];this.setSpeaking(t)}else if(e.ctrl==="lockState"){const t=e.args[0];this.lockState(t)}else if(e.ctrl==="setTuber"){const t=e.args[0];this.setTuber(t)}}),this.ws.connect()}}),U={key:0,class:"base"};function j(e,t,s,i,n,r){const o=_("avatar-animation");return e.initialized?(a(),l("div",U,[$("div",{class:"avatar",style:c({width:`${e.tuberDef.width}px`,height:`${e.tuberDef.height}px`})},[(a(!0),l(S,null,T(e.animations,(v,y)=>(a(),N(o,{key:y,frames:v.frames,width:e.tuberDef.width,height:e.tuberDef.height},null,8,["frames","width","height"]))),128))],4)])):D("",!0)}var G=m(J,[["render",j]]);const V=C(G);V.mount("#app");
