import{d as m,r as C,o as l,c,a as e,n as h,b as I,e as v,t as k,w as D,f,g as T,v as L,F as S,h as P,i as O,j as z,k as F}from"./vendor.0e34a576.js";const Y=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const d of a.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&r(d)}).observe(document,{childList:!0,subtree:!0});function o(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerpolicy&&(a.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?a.credentials="include":n.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(n){if(n.ep)return;n.ep=!0;const a=o(n);fetch(n.href,a)}};Y();let y=[];const j=s=>{switch(s){case"error":y=["error"];break;case"info":y=["error","info"];break;case"log":y=["error","info","log"];break;case"debug":y=["error","info","log","debug"];break}};j("info");const M=(s,...t)=>{const o=s,r=n=>(...a)=>{y.includes(n)&&console[n](G("hh:mm:ss",new Date),`[${o}]`,...t,...a)};return{log:r("log"),info:r("info"),debug:r("debug"),error:r("error")}},G=(s,t)=>s.replace(/(hh|mm|ss)/g,(o,r)=>{switch(r){case"hh":return B(t.getHours(),"00");case"mm":return B(t.getMinutes(),"00");case"ss":return B(t.getSeconds(),"00");default:return o}}),B=(s,t)=>{const o=`${s}`;return o.length>=t.length?o:t.substr(0,t.length-o.length)+o},X=1001,E=4e3,U=M("WsWrapper.ts");class Z{constructor(t,o){this.handle=null,this.reconnectTimeout=null,this.sendBuffer=[],this.onopen=()=>{},this.onclose=()=>{},this.onmessage=()=>{},this.addr=t,this.protocols=o}send(t){this.handle?this.handle.send(t):this.sendBuffer.push(t)}connect(){const t=new WebSocket(this.addr,this.protocols);t.onopen=o=>{for(this.reconnectTimeout&&clearTimeout(this.reconnectTimeout),this.handle=t;this.sendBuffer.length>0;){const r=this.sendBuffer.shift();r&&this.handle.send(r)}this.onopen(o)},t.onmessage=o=>{this.onmessage(o)},t.onclose=o=>{this.handle=null,o.code===E?U.info("custom disconnect, will not reconnect"):o.code===X?U.info("going away, will not reconnect"):this.reconnectTimeout=setTimeout(()=>{this.connect()},1e3),this.onclose(o)}}disconnect(){this.handle&&this.handle.close(E)}}const N=M("WsClient.ts");class q extends Z{constructor(t,o){super(t,o);this._on={},this.onopen=r=>{this._dispatch("socket","open",r)},this.onmessage=r=>{if(this._dispatch("socket","message",r),this._on.message){const n=this._parseMessageData(r.data);n.event&&this._dispatch("message",`${n.event}`,n.data)}},this.onclose=r=>{this._dispatch("socket","close",r)}}onSocket(t,o){this.addEventListener("socket",t,o)}onMessage(t,o){this.addEventListener("message",t,o)}addEventListener(t,o,r){const n=Array.isArray(o)?o:[o];this._on[t]=this._on[t]||{};for(const a of n)this._on[t][a]=this._on[t][a]||[],this._on[t][a].push(r)}_parseMessageData(t){try{const o=JSON.parse(t);if(o.event)return{event:o.event,data:o.data||null}}catch(o){N.info(o)}return{event:null,data:null}}_dispatch(t,o,...r){const a=(this._on[t]||{})[o]||[];if(a.length!==0){N.log(`ws dispatch ${t} ${o}`);for(const d of a)d(...r)}}}const W=(s,t)=>`${window[s]!==`{{${s}}}`?window[s]:t}`,Q=W("wsUrl",""),tt=W("widgetToken","");var st={wsClient:s=>new q(Q+"/"+s,tt)},_=(s,t)=>{const o=s.__vccOpts||s;for(const[r,n]of t)o[r]=n;return o};const u=M("Page.vue"),x=(s,t,o)=>{const r=s.getBoundingClientRect(),n={left:0,top:0,right:0,bottom:0},a=s.width/(r.width-(n.left+n.right)),d=s.height/(r.height-(n.top+n.bottom)),g=t*a,p=o*d;return{x:g,y:p}},H=s=>{const t=s.target,o=t.getBoundingClientRect();return x(t,s.targetTouches[0].clientX-o.x,s.targetTouches[0].clientY-o.y)},V=s=>{const t=s.target;return x(t,s.offsetX,s.offsetY)},et=s=>{const t=s.replace("#",""),o=parseInt(t.substr(0,2),16),r=parseInt(t.substr(2,2),16),n=parseInt(t.substr(4,2),16);return(o*299+r*587+n*114)/1e3>69},ot=m({data(){return{ws:null,opts:{},palette:["#000000"],images:[],favoriteLists:[],color:"#000000",sampleColor:"",tool:"pen",sizes:[1,2,5,10,30,60,100],sizeIdx:2,canvas:null,ctx:null,last:null,canvasWidth:720,canvasHeight:405,submitButtonText:"Submit",submitConfirm:"",customDescription:"",customProfileImageUrl:"",recentImagesTitle:"",stack:[],currentPath:[],dialog:"",modifyImageUrl:""}},computed:{favoriteListsFiltered(){return this.favoriteLists.filter(s=>s.list.length>0)},favorites(){const s=[];for(const t of this.favoriteLists)s.push(...t.list);return s},currentColorStyle(){return{backgroundColor:this.tool==="color-sampler"?this.sampleColor:this.color}},size(){return this.sizes[this.sizeIdx]},nonfavorites(){return this.images.filter(s=>!this.favorites.includes(s))},canvasBg(){return["transparent","white","black"].includes(this.opts.canvasBg)?this.opts.canvasBg:"transparent"},canvasClasses(){return[`bg-${this.canvasBg}`]},halfSize(){return Math.round(this.size/2)},styles(){return{cursor:this.cursor}},cursor(){const s=document.createElement("canvas"),t=s.getContext("2d");return this.tool==="color-sampler"?"crosshair":(s.width=parseInt(this.size,10)+1,s.height=parseInt(this.size,10)+1,t.beginPath(),this.tool==="eraser"?t.fillStyle="#fff":t.fillStyle=this.color,t.strokeStyle=et(t.fillStyle)?"#000":"#fff",t.arc(this.halfSize,this.halfSize,this.halfSize,0,2*Math.PI),t.closePath(),t.fill(),t.stroke(),`url(${s.toDataURL()}) ${this.halfSize} ${this.halfSize}, default`)}},methods:{opt(s,t){this.opts[s]=t,window.localStorage.setItem("drawcastOpts",JSON.stringify(this.opts))},async modify(s){const t=new Image;return new Promise(async o=>{t.src=s,t.onload=async r=>{this.img(t),this.stack=[],this.currentPath=[],this.stack.push(this.getImageData())}})},async undo(){this.stack.pop(),this.clear(),this.currentPath=[],this.stack.length>0&&this.putImageData(this.stack[this.stack.length-1])},getImageData(){if(!this.ctx)throw new Error("getImageData: this.ctx not set");if(!this.canvas)throw new Error("getImageData: this.canvas not set");return this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height)},putImageData(s){if(!this.ctx){u.error("putImageData: this.ctx not set");return}this.ctx.putImageData(s,0,0)},img(s){if(!this.ctx){u.error("img: this.ctx not set");return}this.clear();const t=this.ctx.globalCompositeOperation;this.ctx.globalCompositeOperation="source-over",this.ctx.drawImage(s,0,0),this.ctx.globalCompositeOperation=t},drawPathPart(s){if(!this.ctx){u.error("drawPathPart: this.ctx not set");return}this.currentPath.push(s);const{pts:t,color:o,tool:r,size:n,halfSize:a}=s;if(t.length!==0){if(r==="eraser"?this.ctx.globalCompositeOperation="destination-out":this.ctx.globalCompositeOperation="source-over",t.length===1){this.ctx.beginPath(),this.ctx.fillStyle=o,this.ctx.arc(t[0].x,t[0].y,a,0,2*Math.PI),this.ctx.closePath(),this.ctx.fill();return}this.ctx.lineJoin="round",this.ctx.beginPath(),this.ctx.strokeStyle=o,this.ctx.lineWidth=n,this.ctx.moveTo(t[0].x,t[0].y);for(let d=1;d<t.length;d++)this.ctx.lineTo(t[d].x,t[d].y);this.ctx.closePath(),this.ctx.stroke()}},redraw(...s){this.drawPathPart({pts:s,tool:this.tool,color:this.color,size:this.size,halfSize:this.halfSize})},cancelDraw(s){this.stack.push(this.getImageData()),this.currentPath=[],this.last=null},startDraw(s){if(this.tool==="color-sampler"){this.color=this.getColor(s);return}const t=s;this.redraw(t),this.last=t},continueDraw(s){if(this.tool==="color-sampler"&&(this.sampleColor=this.getColor(s)),!this.last)return;const t=s;this.redraw(this.last,t),this.last=t},touchstart(s){s.preventDefault(),this.startDraw(H(s))},mousedown(s){this.startDraw(V(s))},touchmove(s){s.preventDefault(),this.continueDraw(H(s))},mousemove(s){this.continueDraw(V(s))},clear(){if(!this.ctx){u.error("clear: this.ctx not set");return}if(!this.canvas){u.error("clear: this.canvas not set");return}this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)},clearClick(){this.clear(),this.stack=[],this.currentPath=[]},prepareSubmitImage(){if(this.submitConfirm){this.dialog="confirm-submit";return}this.submitImage()},submitImage(){if(!this.canvas){u.error("submitImage: this.canvas not set");return}if(!this.ws){u.error("submitImage: this.ws not set");return}this.ws.send(JSON.stringify({event:"post",data:{img:this.canvas.toDataURL()}})),this.dialog="success"},prepareModify(s){this.modifyImageUrl=s,this.dialog="replace"},dialogClose(){this.dialog=""},dialogConfirm(){this.dialog==="confirm-submit"?(this.dialog="",this.submitImage()):this.dialog==="clear"?(this.dialog="",this.clearClick()):this.dialog==="replace"&&(this.dialog="",this.modify(this.modifyImageUrl))},getColor(s){if(!this.ctx)return u.error("getColor: this.ctx not set"),"";const[t,o,r,n]=this.ctx.getImageData(s.x,s.y,1,1).data,a=(g,p)=>p.substr(0,p.length-g.length)+g,d=g=>a(g.toString(16),"00");return n?`#${d(t)}${d(o)}${d(r)}`:this.palette[0]}},mounted(){if(this.canvas=this.$refs.canvas,!this.canvas){u.error("mounted: $refs.canvas not found");return}this.ctx=this.canvas.getContext("2d"),this.ws=st.wsClient("drawcast");const s=window.localStorage.getItem("drawcastOpts");this.opts=s?JSON.parse(s):{canvasBg:"transparent"},this.ws.onMessage("init",t=>{this.submitButtonText=t.settings.submitButtonText||"Send",this.submitConfirm=t.settings.submitConfirm,this.canvasWidth=t.settings.canvasWidth,this.canvasHeight=t.settings.canvasHeight,this.customDescription=t.settings.customDescription||"",this.customProfileImageUrl=t.settings.customProfileImage&&t.settings.customProfileImage.urlpath?t.settings.customProfileImage.urlpath:"",this.recentImagesTitle=t.settings.recentImagesTitle||"Newest submitted:",this.palette=t.settings.palette||this.palette,this.favoriteLists=t.settings.favoriteLists,this.color=this.palette[0],this.images=t.images,this.images.length>0&&t.settings.autofillLatest&&this.modify(this.images[0])}),this.ws.onMessage("post",t=>{this.images.unshift(t.img),this.images=this.images.slice(0,20)}),this.ws.connect(),window.addEventListener("keyup",t=>{t.code==="Digit1"?this.sizeIdx=0:t.code==="Digit2"?this.sizeIdx=1:t.code==="Digit3"?this.sizeIdx=2:t.code==="Digit4"?this.sizeIdx=3:t.code==="Digit5"?this.sizeIdx=4:t.code==="Digit6"?this.sizeIdx=5:t.code==="Digit7"?this.sizeIdx=6:t.code==="KeyB"?this.tool="pen":t.code==="KeyS"?this.tool="color-sampler":t.code==="KeyE"?this.tool="eraser":t.code==="KeyZ"&&t.ctrlKey&&this.undo()}),window.addEventListener("mouseup",()=>{this.last=null}),this.$watch("color",()=>{this.tool="pen"})}}),it={id:"drawcast"},nt={class:"streamer_message"},rt={class:"streamer_message_inner"},at={class:"draw_panel"},lt={class:"draw_panel_inner"},ct={class:"draw_panel_top"},dt={class:"draw_canvas_holder"},ht=["width","height"],ut={class:"v355_1274"},gt={class:"card draw_tools_panel"},pt={class:"draw_tools_tool_buttons"},mt={class:"size_slider"},vt=e("div",{class:"v355_1289"},[e("div",{class:"v355_1290"})],-1),ft={class:"v355_1291"},_t=["max"],wt=e("div",{class:"v355_1294"},[e("div",{class:"v355_1295"})],-1),Ct={class:"visual_background"},bt=e("div",{class:"visual_background_title"},"Visual Background:",-1),kt={class:"visual_background_colors"},yt=O('<div class="hotkey-help"><div class="hotkey-help-title">Hotkeys</div><div class="hotkey-help-item">E Eraser</div><div class="hotkey-help-item">B Pencil</div><div class="hotkey-help-item">S Color sampler</div><div class="hotkey-help-item">1-7 Adjust size</div><div class="hotkey-help-item">Ctrl+Z Undo</div></div>',1),$t={class:"draw_panel_bottom"},It={class:"draw_colors"},Dt={class:"draw_colors_current"},St={class:"draw_colors_current_label clickable"},Pt={class:"draw_colors_current_icon"},zt={class:"draw_colors_palette"},Mt=["onClick"],Bt=e("div",null,null,-1),Tt={class:"drawing_panel_bottom_right"},Lt={class:"send_button_text"},Ot={class:"drawings_panel_title"},Et={class:"drawings_panel_title_inner"},Ut={key:0,class:"drawing_panel_drawings"},Nt=["onClick","src"],Wt={class:"drawings-panel recent-drawings-panel"},xt={class:"drawings_panel_title"},Ht={class:"drawings_panel_title_inner"},Vt={class:"drawing_panel_drawings"},At=["onClick","src"],Kt=e("div",{class:"dotdotdot"},null,-1),Jt=O('<span class="drawcast_footer_left">Hyottoko.club | Developed by <a href="https://github.com/zutatensuppe" target="_blank">para</a>. UI Design by <a href="https://www.artstation.com/lisadikaprio" target="_blank">LisadiKaprio</a></span><span class="drawcast_footer_right"><a href="https://github.com/zutatensuppe/robyottoko" target="_blank">Source code on Github</a> | <a href="https://twitch.tv/nc_para_" target="_blank">Developer\u2019s Twitch channel</a> | <a href="https://jigsaw.hyottoko.club" target="_blank">Jigsaw Puzzle Multiplayer</a></span>',2),Rt=[Jt],Ft={key:0,class:"dialog success-dialog"},Yt=e("div",{class:"dialog-bg"},null,-1),jt={class:"dialog-container"},Gt=e("div",{class:"dialog-title"},"Success!",-1),Xt=e("div",{class:"dialog-body"},"Your drawing was sent to the stream.",-1),Zt={class:"dialog-footer"},qt={key:1,class:"dialog confirm-dialog"},Qt=e("div",{class:"dialog-bg"},null,-1),ts={class:"dialog-container"},ss=e("div",{class:"dialog-body"},[z(" If you click this, your current drawing will be erased and replaced by the drawing you just clicked on. "),e("br"),e("br"),z(" Do you want to proceed? ")],-1),es={class:"dialog-footer"},os={key:2,class:"dialog confirm-dialog"},is=e("div",{class:"dialog-bg"},null,-1),ns={class:"dialog-container"},rs={class:"dialog-body"},as={class:"dialog-footer"},ls={key:3,class:"dialog confirm-dialog"},cs=e("div",{class:"dialog-bg"},null,-1),ds={class:"dialog-container"},hs=e("div",{class:"dialog-body"},[z(" If you click this, your current drawing will be erased. "),e("br"),e("br"),z(" Do you want to proceed? ")],-1),us={class:"dialog-footer"};function gs(s,t,o,r,n,a){const d=C("icon-pen"),g=C("icon-eraser"),p=C("icon-eyedropper"),A=C("icon-undo"),K=C("icon-clear"),J=C("icon-send");return l(),c("div",it,[e("div",{class:h(["drawcast_body",{blurred:s.dialog}])},[s.customDescription?(l(),c("div",{key:0,class:h(["streamer_info",{"no-avatar":!s.customProfileImageUrl}])},[s.customProfileImageUrl?(l(),c("div",{key:0,class:"streamer_avatar",style:I({backgroundImage:`url(${s.customProfileImageUrl})`})},null,4)):v("",!0),e("div",nt,[e("span",rt,k(s.customDescription),1)])],2)):v("",!0),e("div",at,[e("div",lt,[e("div",ct,[e("div",dt,[e("div",{class:h(["draw_canvas_holder_inner",s.canvasClasses])},[e("canvas",{ref:"canvas",width:s.canvasWidth,height:s.canvasHeight,onTouchstart:t[0]||(t[0]=D((...i)=>s.touchstart&&s.touchstart(...i),["prevent"])),onTouchmove:t[1]||(t[1]=D((...i)=>s.touchmove&&s.touchmove(...i),["prevent"])),onMousemove:t[2]||(t[2]=(...i)=>s.mousemove&&s.mousemove(...i)),onMousedown:t[3]||(t[3]=(...i)=>s.mousedown&&s.mousedown(...i)),onMouseup:t[4]||(t[4]=(...i)=>s.cancelDraw&&s.cancelDraw(...i)),onTouchend:t[5]||(t[5]=D((...i)=>s.cancelDraw&&s.cancelDraw(...i),["prevent"])),onTouchcancel:t[6]||(t[6]=D((...i)=>s.cancelDraw&&s.cancelDraw(...i),["prevent"])),style:I(s.styles)},null,44,ht)],2)]),e("div",ut,[e("div",gt,[e("div",pt,[e("div",{class:h(["draw_tools_tool_button clickable tool-pen",{"is-current":s.tool==="pen"}]),title:"Pen",onClick:t[7]||(t[7]=i=>s.tool="pen")},[f(d)],2),e("div",{class:h(["draw_tools_tool_button clickable tool-eraser",{"is-current":s.tool==="eraser"}]),title:"Eraser",onClick:t[8]||(t[8]=i=>s.tool="eraser")},[f(g)],2),e("div",{class:h(["draw_tools_tool_button clickable tool-eyedropper",{"is-current":s.tool==="color-sampler"}]),title:"Color Sampler",onClick:t[9]||(t[9]=i=>s.tool="color-sampler")},[f(p)],2),e("div",{class:"draw_tools_tool_button clickable tool-undo",title:"Undo",onClick:t[10]||(t[10]=(...i)=>s.undo&&s.undo(...i))},[f(A)]),e("div",{class:"draw_tools_tool_button clickable tool-clear",title:"Clear the canvas",onClick:t[11]||(t[11]=i=>s.dialog="clear")},[f(K)])]),e("div",mt,[vt,e("div",ft,[T(e("input",{"onUpdate:modelValue":t[12]||(t[12]=i=>s.sizeIdx=i),type:"range",min:"0",max:s.sizes.length-1,step:"1"},null,8,_t),[[L,s.sizeIdx]])]),wt]),e("div",Ct,[bt,e("div",kt,[e("div",{onClick:t[13]||(t[13]=i=>s.opt("canvasBg","transparent")),class:h(["visual_background_button bg-transparent clickable",{"is-current":s.canvasBg!=="white"&&s.canvasBg!=="black"}])},null,2),e("div",{onClick:t[14]||(t[14]=i=>s.opt("canvasBg","white")),class:h(["visual_background_button bg-white clickable",{"is-current":s.canvasBg==="white"}])},null,2),e("div",{onClick:t[15]||(t[15]=i=>s.opt("canvasBg","black")),class:h(["visual_background_button bg-black clickable",{"is-current":s.canvasBg==="black"}])},null,2)])])]),yt])]),e("div",$t,[e("div",It,[e("div",Dt,[e("label",St,[T(e("input",{type:"color","onUpdate:modelValue":t[16]||(t[16]=i=>s.color=i)},null,512),[[L,s.color]]),e("span",{class:h(["draw_colors_current_inner",{active:s.tool==="pen"}]),style:I(s.currentColorStyle)},null,6),e("div",Pt,[f(p)])])]),e("div",zt,[(l(!0),c(S,null,P(s.palette,(i,b)=>(l(),c("div",{class:"palette_color clickable",style:I({backgroundColor:i}),key:b,onClick:$=>{s.color=i,s.tool="pen"}},null,12,Mt))),128))])]),Bt,e("div",Tt,[e("div",{class:"button button-primary send_button clickable",onClick:t[17]||(t[17]=(...i)=>s.prepareSubmitImage&&s.prepareSubmitImage(...i))},[f(J),e("span",Lt,k(s.submitButtonText),1)])])])])]),(l(!0),c(S,null,P(s.favoriteListsFiltered,(i,b)=>(l(),c("div",{key:b,class:"drawings-panel favorite-drawings-panel"},[e("div",Ot,[e("span",Et,k(i.title||"Streamer's favorites:"),1)]),s.nonfavorites.length?(l(),c("div",Ut,[(l(!0),c(S,null,P(i.list,($,R)=>(l(),c("img",{class:"image favorite clickable",key:R,onClick:Zs=>s.prepareModify($),src:$,height:"190"},null,8,Nt))),128))])):v("",!0)]))),128)),e("div",Wt,[e("div",xt,[e("span",Ht,k(s.recentImagesTitle),1)]),e("div",Vt,[(l(!0),c(S,null,P(s.nonfavorites,(i,b)=>(l(),c("img",{class:"image clickable",key:b,onClick:$=>s.prepareModify(i),src:i,height:"190"},null,8,At))),128)),Kt])])],2),e("div",{class:h(["drawcast_footer",{blurred:s.dialog}])},Rt,2),s.dialog==="success"?(l(),c("div",Ft,[Yt,e("div",jt,[Gt,Xt,e("div",Zt,[e("div",{class:"button button-ok clickable",onClick:t[18]||(t[18]=(...i)=>s.dialogClose&&s.dialogClose(...i))}," Draw another one ")])])])):v("",!0),s.dialog==="replace"?(l(),c("div",qt,[Qt,e("div",ts,[ss,e("div",es,[e("div",{class:"button button-no-button clickable",onClick:t[19]||(t[19]=(...i)=>s.dialogClose&&s.dialogClose(...i))}," Cancel "),e("div",{class:"button button-danger clickable",onClick:t[20]||(t[20]=(...i)=>s.dialogConfirm&&s.dialogConfirm(...i))}," Replace image ")])])])):v("",!0),s.dialog==="confirm-submit"?(l(),c("div",os,[is,e("div",ns,[e("div",rs,k(s.submitConfirm),1),e("div",as,[e("div",{class:"button button-no-button clickable",onClick:t[21]||(t[21]=(...i)=>s.dialogClose&&s.dialogClose(...i))}," Cancel "),e("div",{class:"button button-danger clickable",onClick:t[22]||(t[22]=(...i)=>s.dialogConfirm&&s.dialogConfirm(...i))}," Send ")])])])):v("",!0),s.dialog==="clear"?(l(),c("div",ls,[cs,e("div",ds,[hs,e("div",us,[e("div",{class:"button button-no-button clickable",onClick:t[23]||(t[23]=(...i)=>s.dialogClose&&s.dialogClose(...i))}," Cancel "),e("div",{class:"button button-danger clickable",onClick:t[24]||(t[24]=(...i)=>s.dialogConfirm&&s.dialogConfirm(...i))}," Clear ")])])])):v("",!0)])}var ps=_(ot,[["render",gs]]);const ms=m({}),vs={width:"19",height:"25",viewBox:"0 0 19 25",fill:"none",xmlns:"http://www.w3.org/2000/svg"},fs=e("path",{d:"M1.34074 16.8137C1.34074 17.6148 0.52442 22.7293 1.4188 23.4937C1.57266 23.6252 4.27862 21.6554 4.77556 21.3546C6.74882 20.1601 8.26415 18.4096 9.55698 16.476C11.1939 14.0279 12.178 11.238 14.3384 9.04547C15.3798 7.98857 17.5 5.9796 17.5 4.48583C17.5 2.99759 14.8174 2.44392 13.9871 1.44607C12.7588 -0.0301503 11.4167 2.53807 10.8255 3.64145C8.97478 7.09562 5.93021 10.015 4.15105 13.4362M10.8254 4.31686C12.184 5.44892 13.8066 6.50765 15.0409 7.69437M9.06921 6.00566C10.1007 6.98057 12.9941 8.82439 13.636 10.0587",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round"},null,-1),_s=[fs];function ws(s,t,o,r,n,a){return l(),c("svg",vs,_s)}var Cs=_(ms,[["render",ws]]);const bs=m({}),ks={width:"21",height:"23",viewBox:"0 0 21 23",fill:"none",xmlns:"http://www.w3.org/2000/svg"},ys=e("path",{d:"M8.6857 9.58965C8.51179 8.19497 7.59609 5.01552 8.98288 3.79318C9.79935 3.07353 10.862 4.14397 11.3009 4.73954C11.7015 5.28323 11.7263 5.33102 12.4302 5.33102C13.8211 5.33102 14.2087 4.95856 14.6689 3.63545C15.0273 2.60503 15.7758 1.76607 16.7096 1.24983C17.2706 0.939645 19.2099 0.779084 19.3644 1.62443C19.8104 4.06593 18.9799 5.02352 17.4228 6.57312C15.5105 8.47616 16.5184 9.34733 17.5218 11.719C18.0947 13.0729 15.8176 12.9611 14.9463 13.1188C13.4498 13.3896 12.8656 12.2271 11.6179 13.6905C9.79426 15.8294 7.71129 17.858 5.99127 20.0588C5.59577 20.5648 2.04134 23.0892 1.5732 21.4586C1.13551 19.9342 2.37142 16.6874 4.04969 16.6874",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round"},null,-1),$s=[ys];function Is(s,t,o,r,n,a){return l(),c("svg",ks,$s)}var Ds=_(bs,[["render",Is]]);const Ss=m({}),Ps={width:"25",height:"25",viewBox:"0 0 25 25",fill:"none",xmlns:"http://www.w3.org/2000/svg"},zs=e("path",{d:"M15.2026 20.4059C12.1702 21.6833 7.00132 25.0358 4.573 21.2567C2.63447 18.2398 3.03749 14.4589 2.2581 11.0475C0.793481 4.63683 5.75646 -0.650226 12.2263 3.43789C13.6243 4.32123 25.8508 14.1699 22.3835 16.1521C15.8336 19.8966 14.5169 14.1075 10.1004 11.8983",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round"},null,-1),Ms=[zs];function Bs(s,t,o,r,n,a){return l(),c("svg",Ps,Ms)}var Ts=_(Ss,[["render",Bs]]);const Ls=m({}),Os={width:"24",height:"23",viewBox:"0 0 24 23",fill:"none",xmlns:"http://www.w3.org/2000/svg"},Es=e("path",{d:"M1.50616 12.2794C1.50616 8.28949 1.52414 6.00483 3.35146 2.79446C3.7407 2.11062 5.80713 0.756378 6.55647 1.03798C8.24341 1.67193 8.23865 4.06156 9.47011 4.95241C9.90322 5.26573 11.9972 3.68356 12.4566 3.49705C13.8656 2.92498 15.3332 2.79446 16.8271 2.79446C19.7283 2.79446 19.456 3.14654 21.149 5.47936C22.3195 7.09232 22.4844 9.87151 22.4844 11.8278C22.4844 14.8829 21.1795 18.2213 18.7695 20.1585C18.0499 20.7369 16.7286 21.0144 16.3657 21.7644M4.12853 16.3446C5.08648 16.3239 12.744 16.7418 12.8695 14.5379C12.9121 13.7884 10.9996 10.283 11.8011 10.0463C12.2697 9.90799 15.7596 9.748 15.9045 10.2722C16.2421 11.4932 15.9288 13.2649 15.9288 14.5379M13.7345 18.0948C14.5465 19.4251 15.3836 20.7153 16.2537 22M1.48438 12.7447C1.85884 13.7354 2.58818 15.6947 3.94957 15.6947C4.58896 15.6947 5.04081 15.7577 5.63628 15.9628",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round"},null,-1),Us=[Es];function Ns(s,t,o,r,n,a){return l(),c("svg",Os,Us)}var Ws=_(Ls,[["render",Ns]]);const xs=m({}),Hs={width:"24",height:"23",viewBox:"0 0 24 23",fill:"none",xmlns:"http://www.w3.org/2000/svg"},Vs=e("path",{d:"M12.4089 13.7917C14.5409 11.4576 16.5354 9.69995 17.8634 6.90587C18.889 4.74793 19.3445 4.25329 16.3482 3.08039C14.6 2.39602 12.2353 1.42912 10.4999 1.06847C7.75544 0.498158 6.22453 3.62675 5.01509 5.40402C3.36443 7.82965 1.5 12.3093 1.5 15.0669C1.5 17.2112 1.69173 17.2263 3.80299 17.9856C5.54232 18.6112 6.61693 19.9125 8.59079 19.9125M4.22719 10.2213C6.49673 12.0315 8.97428 14.4214 11.8634 15.322M12.4093 21.9528H17.3183M20.0233 5.31399C22.5345 8.37513 23.9589 10.4666 20.1095 13.133C18.6713 14.1293 17.0772 15.4173 16.2305 16.9216C15.5992 18.0433 13.8326 19.4503 12.7394 20.1863C11.9496 20.7181 11.4228 21.6684 10.7137 22M8.74404 18.2614C9.97157 17.3121 11.2185 16.3935 12.4706 15.4735M15.6475 15.8473L13.5461 14.6682",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round"},null,-1),As=[Vs];function Ks(s,t,o,r,n,a){return l(),c("svg",Hs,As)}var Js=_(xs,[["render",Ks]]);const Rs=m({}),Fs={width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},Ys=e("path",{d:"M3.46083 1.42417C7.10747 -0.166485 8.08265 3.02571 9.70105 5.8783C11.4429 4.73862 15.1278 1.61602 17.433 2.90888C21.5924 5.24158 16.3121 8.16103 14.9117 10.9098C13.6076 13.4696 19.9503 14.394 17.433 17.5704C16.3045 18.9945 14.7074 18.5369 13.3149 17.756C12.1694 17.1135 11.9679 15.0862 10.8356 14.4979C9.62925 13.871 7.27704 17.6349 6.75953 18.4983C6.08525 19.6233 3.84548 18.5668 3.06162 18.1272C1.73805 17.3849 0.120623 16.7381 1.56985 15.1577C2.73649 13.8855 4.88246 13.177 5.83505 11.8171C6.44976 10.9396 7.13452 11.31 7.05368 9.96125C7.0404 9.73969 6.35625 8.73446 6.21325 8.55903C5.35826 7.51013 4.33953 6.52657 3.64993 5.34215C2.97731 4.18691 1.35143 2.34429 3.46083 1.42417Z",fill:"currentColor",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round"},null,-1),js=[Ys];function Gs(s,t,o,r,n,a){return l(),c("svg",Fs,js)}var Xs=_(Rs,[["render",Gs]]);const w=F(ps);w.component("icon-pen",Cs);w.component("icon-eyedropper",Ds);w.component("icon-send",Ts);w.component("icon-undo",Ws);w.component("icon-eraser",Js);w.component("icon-clear",Xs);w.mount("#app");