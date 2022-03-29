import{d as p,r as w,o as l,c,a as e,n as h,b as C,e as g,t as I,w as L,f as m,g as z,v as P,F as D,h as S,i as W,j as V}from"./vendor.7403a753.js";const F=function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const d of r.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&n(d)}).observe(document,{childList:!0,subtree:!0});function o(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerpolicy&&(r.referrerPolicy=a.referrerpolicy),a.crossorigin==="use-credentials"?r.credentials="include":a.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(a){if(a.ep)return;a.ep=!0;const r=o(a);fetch(a.href,r)}};F();let y=[];const J=t=>{switch(t){case"error":y=["error"];break;case"info":y=["error","info"];break;case"log":y=["error","info","log"];break;case"debug":y=["error","info","log","debug"];break}};J("info");const B=(t,...s)=>{const o=t,n=a=>(...r)=>{y.includes(a)&&console[a](Y("hh:mm:ss",new Date),`[${o}]`,...s,...r)};return{log:n("log"),info:n("info"),debug:n("debug"),error:n("error")}},Y=(t,s)=>t.replace(/(hh|mm|ss)/g,(o,n)=>{switch(n){case"hh":return M(s.getHours(),"00");case"mm":return M(s.getMinutes(),"00");case"ss":return M(s.getSeconds(),"00");default:return o}}),M=(t,s)=>{const o=`${t}`;return o.length>=s.length?o:s.substr(0,s.length-o.length)+o};function j(t){let s="";const o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let n=0;n<t;n++)s+=o.charAt(Math.floor(Math.random()*o.length));return s}const G=1001,T=4e3,E=B("WsWrapper.ts");class Z{constructor(s,o){this.handle=null,this.reconnectTimeout=null,this.sendBuffer=[],this.onopen=()=>{},this.onclose=()=>{},this.onmessage=()=>{},this.addr=s,this.protocols=o}send(s){this.handle?this.handle.send(s):this.sendBuffer.push(s)}connect(){const s=new WebSocket(this.addr,this.protocols);s.onopen=o=>{for(this.reconnectTimeout&&clearTimeout(this.reconnectTimeout),this.handle=s;this.sendBuffer.length>0;){const n=this.sendBuffer.shift();n&&this.handle.send(n)}this.onopen(o)},s.onmessage=o=>{this.onmessage(o)},s.onclose=o=>{this.handle=null,o.code===T?E.info("custom disconnect, will not reconnect"):o.code===G?E.info("going away, will not reconnect"):this.reconnectTimeout=setTimeout(()=>{this.connect()},1e3),this.onclose(o)}}disconnect(){this.handle&&this.handle.close(T)}}const U=B("WsClient.ts");class X extends Z{constructor(s,o){super(s,o);this._on={},this.onopen=n=>{this._dispatch("socket","open",n)},this.onmessage=n=>{if(this._dispatch("socket","message",n),this._on.message){const a=this._parseMessageData(n.data);a.event&&this._dispatch("message",`${a.event}`,a.data)}},this.onclose=n=>{this._dispatch("socket","close",n)}}onSocket(s,o){this.addEventListener("socket",s,o)}onMessage(s,o){this.addEventListener("message",s,o)}addEventListener(s,o,n){const a=Array.isArray(o)?o:[o];this._on[s]=this._on[s]||{};for(const r of a)this._on[s][r]=this._on[s][r]||[],this._on[s][r].push(n)}_parseMessageData(s){try{const o=JSON.parse(s);if(o.event)return{event:o.event,data:o.data||null}}catch(o){U.info(o)}return{event:null,data:null}}_dispatch(s,o,...n){const r=(this._on[s]||{})[o]||[];if(r.length!==0){U.log(`ws dispatch ${s} ${o}`);for(const d of r)d(...n)}}}const N=(t,s)=>`${window[t]!==`{{${t}}}`?window[t]:s}`,q=N("wsUrl",""),Q=N("widgetToken","");var tt={wsClient:t=>new X(q+"/"+t,Q)},v=(t,s)=>{const o=t.__vccOpts||t;for(const[n,a]of s)o[n]=a;return o};const u=B("Page.vue"),O=(t,s)=>{const o=t.getBoundingClientRect();return{x:s.targetTouches[0].clientX-o.x,y:s.targetTouches[0].clientY-o.y}},H=(t,s)=>{const o=t.getBoundingClientRect();return{x:s.clientX-o.x,y:s.clientY-o.y}},st=t=>{const s=t.replace("#",""),o=parseInt(s.substr(0,2),16),n=parseInt(s.substr(2,2),16),a=parseInt(s.substr(4,2),16);return(o*299+n*587+a*114)/1e3>69},et=p({data(){return{ws:null,opts:{},palette:["#000000"],images:[],favoriteLists:[],color:"#000000",sampleColor:"",tool:"pen",sizes:[1,2,5,10,30,60,100],sizeIdx:2,canvas:null,ctx:null,last:null,canvasWidth:720,canvasHeight:405,submitButtonText:"Submit",submitConfirm:"",customDescription:"",customProfileImageUrl:"",recentImagesTitle:"",stack:[],currentPath:[],dialog:"",dialogBody:"",modifyImageUrl:"",successImageUrlStyle:null,clearImageUrlStyle:null,sending:{date:null,nonce:""}}},computed:{favoriteListsFiltered(){return this.favoriteLists.filter(t=>t.list.length>0)},favorites(){const t=[];for(const s of this.favoriteLists)t.push(...s.list);return t},currentColorStyle(){return{backgroundColor:this.tool==="color-sampler"?this.sampleColor:this.color}},size(){return this.sizes[this.sizeIdx]},nonfavorites(){return this.images.filter(t=>!this.favorites.includes(t))},canvasBg(){return["transparent","white","black"].includes(this.opts.canvasBg)?this.opts.canvasBg:"transparent"},canvasClasses(){return[`bg-${this.canvasBg}`]},halfSize(){return Math.round(this.size/2)},styles(){return{cursor:this.cursor}},cursor(){const t=document.createElement("canvas"),s=t.getContext("2d");return this.tool==="color-sampler"?"crosshair":(t.width=parseInt(this.size,10)+1,t.height=parseInt(this.size,10)+1,s.beginPath(),this.tool==="eraser"?s.fillStyle="#fff":s.fillStyle=this.color,s.strokeStyle=st(s.fillStyle)?"#000":"#fff",s.arc(this.halfSize,this.halfSize,this.halfSize,0,2*Math.PI),s.closePath(),s.fill(),s.stroke(),`url(${t.toDataURL()}) ${this.halfSize} ${this.halfSize}, default`)}},methods:{opt(t,s){this.opts[t]=s,window.localStorage.setItem("drawcastOpts",JSON.stringify(this.opts))},async modify(t){const s=new Image;return new Promise(async o=>{s.src=t,s.onload=async n=>{this.img(s),this.stack=[],this.currentPath=[],this.stack.push(this.getImageData())}})},undo(){this.stack.pop(),this.clear(),this.currentPath=[],this.stack.length>0&&this.putImageData(this.stack[this.stack.length-1])},getImageData(){if(!this.ctx)throw new Error("getImageData: this.ctx not set");if(!this.canvas)throw new Error("getImageData: this.canvas not set");return this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height)},putImageData(t){if(!this.ctx){u.error("putImageData: this.ctx not set");return}this.ctx.putImageData(t,0,0)},img(t){if(!this.ctx){u.error("img: this.ctx not set");return}this.clear();const s=this.ctx.globalCompositeOperation;this.ctx.globalCompositeOperation="source-over",this.ctx.drawImage(t,0,0),this.ctx.globalCompositeOperation=s},drawPathPart(t){if(!this.ctx){u.error("drawPathPart: this.ctx not set");return}this.currentPath.push(t);const{pts:s,color:o,tool:n,size:a,halfSize:r}=t;if(s.length!==0){if(n==="eraser"?this.ctx.globalCompositeOperation="destination-out":this.ctx.globalCompositeOperation="source-over",s.length===1){this.ctx.beginPath(),this.ctx.fillStyle=o,this.ctx.arc(s[0].x,s[0].y,r,0,2*Math.PI),this.ctx.closePath(),this.ctx.fill();return}this.ctx.lineJoin="round",this.ctx.beginPath(),this.ctx.strokeStyle=o,this.ctx.lineWidth=a,this.ctx.moveTo(s[0].x,s[0].y);for(let d=1;d<s.length;d++)this.ctx.lineTo(s[d].x,s[d].y);this.ctx.closePath(),this.ctx.stroke()}},redraw(...t){this.drawPathPart({pts:t,tool:this.tool,color:this.color,size:this.size,halfSize:this.halfSize})},cancelDraw(){!this.currentPath.length||(this.stack.push(this.getImageData()),this.currentPath=[],this.last=null)},startDraw(t){if(this.tool==="color-sampler"){t.x>=0&&t.y>=0&&t.x<this.canvasWidth&&t.y<this.canvasHeight&&(this.color=this.getColor(t));return}if(t.x>=-this.size&&t.y>=-this.size&&t.x<this.canvasWidth+this.size&&t.y<this.canvasHeight+this.size){const s=t;this.redraw(s),this.last=s}},continueDraw(t){if(this.tool==="color-sampler"&&(this.sampleColor=this.getColor(t)),!this.last)return;const s=t;this.redraw(this.last,s),this.last=s},touchstart(t){!this.$refs.canvas||(t.preventDefault(),this.startDraw(O(this.$refs.canvas,t)))},mousedown(t){!this.$refs.canvas||this.startDraw(H(this.$refs.canvas,t))},touchmove(t){!this.$refs.canvas||(t.preventDefault(),this.continueDraw(O(this.$refs.canvas,t)))},mousemove(t){!this.$refs.canvas||this.continueDraw(H(this.$refs.canvas,t))},clear(){if(!this.ctx){u.error("clear: this.ctx not set");return}if(!this.canvas){u.error("clear: this.canvas not set");return}this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)},clearClick(){this.clear(),this.stack=[],this.currentPath=[]},prepareSubmitImage(){if(this.submitConfirm){this.dialog="confirm-submit",this.dialogBody=this.submitConfirm;return}this.submitImage()},submitImage(){if(!this.canvas){u.error("submitImage: this.canvas not set");return}if(!this.ws){u.error("submitImage: this.ws not set");return}if(this.sending.nonce){u.error("submitImage: nonce not empty");return}this.sending.date=new Date,this.sending.nonce=j(10),this.ws.send(JSON.stringify({event:"post",data:{nonce:this.sending.nonce,img:this.canvas.toDataURL()}}))},showClearDialog(){const s=Math.round(100*this.canvasHeight/this.canvasWidth);this.clearImageUrlStyle={backgroundImage:`url(${this.canvas.toDataURL()})`,width:100+"px",height:s+"px"},this.dialog="clear",this.dialogBody=`
        If you click this, your current drawing will be erased. <br />
        <br />
        Do you want to proceed?`},prepareModify(t){this.modifyImageUrl=t,this.dialog="replace",this.dialogBody=`
        If you click this, your current drawing will be erased and replaced by
        the drawing you just clicked on. <br />
        <br />
        Do you want to proceed?`},dialogClose(){this.dialog="",this.dialogBody=""},dialogConfirm(){this.dialog==="confirm-submit"?(this.dialog="",this.submitImage()):this.dialog==="clear"?(this.dialog="",this.clearClick()):this.dialog==="replace"&&(this.dialog="",this.modify(this.modifyImageUrl))},getColor(t){if(!this.ctx)return u.error("getColor: this.ctx not set"),"";const[s,o,n,a]=this.ctx.getImageData(t.x,t.y,1,1).data,r=(_,b)=>b.substr(0,b.length-_.length)+_,d=_=>r(_.toString(16),"00");return a?`#${d(s)}${d(o)}${d(n)}`:this.palette[0]},keyup(t){t.code==="Digit1"?this.sizeIdx=0:t.code==="Digit2"?this.sizeIdx=1:t.code==="Digit3"?this.sizeIdx=2:t.code==="Digit4"?this.sizeIdx=3:t.code==="Digit5"?this.sizeIdx=4:t.code==="Digit6"?this.sizeIdx=5:t.code==="Digit7"?this.sizeIdx=6:t.code==="KeyB"?this.tool="pen":t.code==="KeyS"?this.tool="color-sampler":t.code==="KeyE"?this.tool="eraser":t.code==="KeyZ"&&t.ctrlKey&&this.undo()}},mounted(){if(this.canvas=this.$refs.canvas,!this.canvas){u.error("mounted: $refs.canvas not found");return}this.ctx=this.canvas.getContext("2d"),this.ws=tt.wsClient("drawcast");const t=window.localStorage.getItem("drawcastOpts");this.opts=t?JSON.parse(t):{canvasBg:"transparent"},this.ws.onMessage("init",s=>{this.submitButtonText=s.settings.submitButtonText||"Send",this.submitConfirm=s.settings.submitConfirm,this.canvasWidth=s.settings.canvasWidth,this.canvasHeight=s.settings.canvasHeight,this.customDescription=s.settings.customDescription||"",this.customProfileImageUrl=s.settings.customProfileImage&&s.settings.customProfileImage.urlpath?s.settings.customProfileImage.urlpath:"",this.recentImagesTitle=s.settings.recentImagesTitle||"Newest submitted:",this.palette=s.settings.palette||this.palette,this.favoriteLists=s.settings.favoriteLists,this.color=this.palette[0],this.images=s.images.map(o=>o.path),this.images.length>0&&s.settings.autofillLatest&&this.modify(this.images[0])}),this.ws.onMessage("image_received",s=>{if(this.sending.date&&this.sending.nonce&&s.nonce===this.sending.nonce){const n=new Date,a=this.sending.date.getTime()+500-n.getTime();setTimeout(()=>{this.successImageUrlStyle={backgroundImage:`url(${s.img})`},this.dialog="success",this.dialogBody="Your drawing was sent and is pending approval.",this.sending.nonce="",this.sending.date=null},Math.max(0,a))}}),this.ws.onMessage("approved_image_received",s=>{if(this.sending.date&&this.sending.nonce&&s.nonce===this.sending.nonce){const n=new Date,a=this.sending.date.getTime()+500-n.getTime();setTimeout(()=>{this.successImageUrlStyle={backgroundImage:`url(${s.img})`},this.dialog="success",this.dialogBody="Your drawing was sent to the stream.",this.sending.nonce="",this.sending.date=null,this.images.unshift(s.img),this.images=this.images.slice(0,20)},Math.max(0,a))}else this.images.unshift(s.img),this.images=this.images.slice(0,20)}),this.ws.connect(),window.addEventListener("mousemove",this.mousemove),window.addEventListener("mouseup",this.cancelDraw),window.addEventListener("touchend",this.cancelDraw),window.addEventListener("touchcancel",this.cancelDraw),window.addEventListener("keyup",this.keyup),this.$watch("color",()=>{this.tool="pen"})},unmounted(){window.removeEventListener("mousemove",this.mousemove),window.removeEventListener("mouseup",this.cancelDraw),window.removeEventListener("touchend",this.cancelDraw),window.removeEventListener("touchcancel",this.cancelDraw),window.removeEventListener("keyup",this.keyup)}}),ot={id:"drawcast"},it={class:"streamer_message"},nt={class:"streamer_message_inner"},at={class:"draw_panel"},rt={class:"draw_panel_inner"},lt={class:"draw_panel_top"},ct={class:"draw_canvas_holder"},dt=["width","height"],ht={class:"v355_1274"},ut={class:"card draw_tools_panel"},gt={class:"draw_tools_tool_buttons"},mt={class:"size_slider"},pt=e("div",{class:"v355_1289"},[e("div",{class:"v355_1290"})],-1),vt={class:"v355_1291"},ft=["max"],_t=e("div",{class:"v355_1294"},[e("div",{class:"v355_1295"})],-1),wt={class:"visual_background"},Ct=e("div",{class:"visual_background_title"},"Visual Background:",-1),bt={class:"visual_background_colors"},kt=W('<div class="hotkey-help"><div class="hotkey-help-title">Hotkeys</div><div class="hotkey-help-item">E Eraser</div><div class="hotkey-help-item">B Pencil</div><div class="hotkey-help-item">S Color sampler</div><div class="hotkey-help-item">1-7 Adjust size</div><div class="hotkey-help-item">Ctrl+Z Undo</div></div>',1),yt={class:"draw_panel_bottom"},$t={class:"draw_colors"},It={class:"draw_colors_current"},Dt={class:"draw_colors_current_label clickable"},St={class:"draw_colors_current_icon"},Mt={class:"draw_colors_palette"},Bt=["onClick"],Lt=e("div",null,null,-1),zt={class:"drawing_panel_bottom_right"},Pt=e("span",{class:"send_button_text"},"\u23F3 Sending...",-1),Tt=[Pt],Et={class:"send_button_text"},Ut={class:"drawings_panel_title"},Ot={class:"drawings_panel_title_inner"},Ht={key:0,class:"drawing_panel_drawings"},Wt=["onClick","src"],Nt={class:"drawings-panel recent-drawings-panel"},xt={class:"drawings_panel_title"},At={class:"drawings_panel_title_inner"},Kt={class:"drawing_panel_drawings"},Rt=["onClick","src"],Vt=e("div",{class:"dotdotdot"},null,-1),Ft=W('<span class="drawcast_footer_left">Hyottoko.club | Developed by <a href="https://github.com/zutatensuppe" target="_blank">para</a>. UI Design by <a href="https://www.artstation.com/lisadikaprio" target="_blank">LisadiKaprio</a></span><span class="drawcast_footer_right"><a href="https://github.com/zutatensuppe/robyottoko" target="_blank">Source code on Github</a> | <a href="https://twitch.tv/nc_para_" target="_blank">Developer\u2019s Twitch channel</a> | <a href="https://jigsaw.hyottoko.club" target="_blank">Jigsaw Puzzle Multiplayer</a></span>',2),Jt=[Ft],Yt={key:0,class:"dialog success-dialog"},jt={class:"dialog-container"},Gt={class:"dialog-image"},Zt=e("div",{class:"dialog-title"},"Success!",-1),Xt=["innerHTML"],qt={class:"dialog-footer"},Qt={key:1,class:"dialog confirm-dialog"},ts={class:"dialog-container"},ss=["innerHTML"],es={class:"dialog-footer"},os={key:2,class:"dialog confirm-dialog"},is={class:"dialog-container"},ns=["innerHTML"],as={class:"dialog-footer"},rs={key:3,class:"dialog clear-dialog"},ls={class:"dialog-container"},cs={class:"dialog-image"},ds=["innerHTML"],hs={class:"dialog-footer"};function us(t,s,o,n,a,r){const d=w("icon-pen"),_=w("icon-eraser"),b=w("icon-eyedropper"),x=w("icon-undo"),A=w("icon-clear"),K=w("icon-send");return l(),c("div",ot,[e("div",{class:h(["drawcast_body",{blurred:t.dialog}])},[t.customDescription?(l(),c("div",{key:0,class:h(["streamer_info",{"no-avatar":!t.customProfileImageUrl}])},[t.customProfileImageUrl?(l(),c("div",{key:0,class:"streamer_avatar",style:C({backgroundImage:`url(${t.customProfileImageUrl})`})},null,4)):g("",!0),e("div",it,[e("span",nt,I(t.customDescription),1)])],2)):g("",!0),e("div",at,[e("div",rt,[e("div",lt,[e("div",ct,[e("div",{class:h(["draw_canvas_holder_inner",t.canvasClasses])},[e("canvas",{ref:"canvas",width:t.canvasWidth,height:t.canvasHeight,style:C(t.styles),onTouchstart:s[0]||(s[0]=L((...i)=>t.touchstart&&t.touchstart(...i),["prevent"])),onTouchmove:s[1]||(s[1]=L((...i)=>t.touchmove&&t.touchmove(...i),["prevent"])),onMousedown:s[2]||(s[2]=(...i)=>t.mousedown&&t.mousedown(...i))},null,44,dt)],2)]),e("div",ht,[e("div",ut,[e("div",gt,[e("div",{class:h(["draw_tools_tool_button clickable tool-pen",{"is-current":t.tool==="pen"}]),title:"Pen",onClick:s[3]||(s[3]=i=>t.tool="pen")},[m(d)],2),e("div",{class:h(["draw_tools_tool_button clickable tool-eraser",{"is-current":t.tool==="eraser"}]),title:"Eraser",onClick:s[4]||(s[4]=i=>t.tool="eraser")},[m(_)],2),e("div",{class:h(["draw_tools_tool_button clickable tool-eyedropper",{"is-current":t.tool==="color-sampler"}]),title:"Color Sampler",onClick:s[5]||(s[5]=i=>t.tool="color-sampler")},[m(b)],2),e("div",{class:"draw_tools_tool_button clickable tool-undo",title:"Undo",onClick:s[6]||(s[6]=(...i)=>t.undo&&t.undo(...i))},[m(x)]),e("div",{class:"draw_tools_tool_button clickable tool-clear",title:"Clear the canvas",onClick:s[7]||(s[7]=(...i)=>t.showClearDialog&&t.showClearDialog(...i))},[m(A)])]),e("div",mt,[pt,e("div",vt,[z(e("input",{"onUpdate:modelValue":s[8]||(s[8]=i=>t.sizeIdx=i),type:"range",min:"0",max:t.sizes.length-1,step:"1"},null,8,ft),[[P,t.sizeIdx]])]),_t]),e("div",wt,[Ct,e("div",bt,[e("div",{onClick:s[9]||(s[9]=i=>t.opt("canvasBg","transparent")),class:h(["visual_background_button bg-transparent clickable",{"is-current":t.canvasBg!=="white"&&t.canvasBg!=="black"}])},null,2),e("div",{onClick:s[10]||(s[10]=i=>t.opt("canvasBg","white")),class:h(["visual_background_button bg-white clickable",{"is-current":t.canvasBg==="white"}])},null,2),e("div",{onClick:s[11]||(s[11]=i=>t.opt("canvasBg","black")),class:h(["visual_background_button bg-black clickable",{"is-current":t.canvasBg==="black"}])},null,2)])])]),kt])]),e("div",yt,[e("div",$t,[e("div",It,[e("label",Dt,[z(e("input",{type:"color","onUpdate:modelValue":s[12]||(s[12]=i=>t.color=i)},null,512),[[P,t.color]]),e("span",{class:h(["draw_colors_current_inner",{active:t.tool==="pen"}]),style:C(t.currentColorStyle)},null,6),e("div",St,[m(b)])])]),e("div",Mt,[(l(!0),c(D,null,S(t.palette,(i,k)=>(l(),c("div",{class:"palette_color clickable",style:C({backgroundColor:i}),key:k,onClick:$=>{t.color=i,t.tool="pen"}},null,12,Bt))),128))])]),Lt,e("div",zt,[t.sending.nonce?(l(),c("div",{key:0,class:"button button-primary send_button",onClick:s[13]||(s[13]=(...i)=>t.prepareSubmitImage&&t.prepareSubmitImage(...i))},Tt)):(l(),c("div",{key:1,class:"button button-primary send_button clickable",onClick:s[14]||(s[14]=(...i)=>t.prepareSubmitImage&&t.prepareSubmitImage(...i))},[m(K),e("span",Et,I(t.submitButtonText),1)]))])])])]),(l(!0),c(D,null,S(t.favoriteListsFiltered,(i,k)=>(l(),c("div",{key:k,class:"drawings-panel favorite-drawings-panel"},[e("div",Ut,[e("span",Ot,I(i.title||"Streamer's favorites:"),1)]),t.nonfavorites.length?(l(),c("div",Ht,[(l(!0),c(D,null,S(i.list,($,R)=>(l(),c("img",{class:"image favorite clickable",key:R,onClick:Zs=>t.prepareModify($),src:$,height:"190"},null,8,Wt))),128))])):g("",!0)]))),128)),e("div",Nt,[e("div",xt,[e("span",At,I(t.recentImagesTitle),1)]),e("div",Kt,[(l(!0),c(D,null,S(t.nonfavorites,(i,k)=>(l(),c("img",{class:"image clickable",key:k,onClick:$=>t.prepareModify(i),src:i,height:"190"},null,8,Rt))),128)),Vt])])],2),e("div",{class:h(["drawcast_footer",{blurred:t.dialog}])},Jt,2),t.dialog==="success"?(l(),c("div",Yt,[e("div",{class:"dialog-bg",onClick:s[15]||(s[15]=(...i)=>t.dialogClose&&t.dialogClose(...i))}),e("div",jt,[e("div",Gt,[e("div",{class:"responsive-image",style:C(t.successImageUrlStyle)},null,4)]),Zt,e("div",{class:"dialog-body",innerHTML:t.dialogBody},null,8,Xt),e("div",qt,[e("div",{class:"button button-ok clickable",onClick:s[16]||(s[16]=(...i)=>t.dialogClose&&t.dialogClose(...i))}," Draw another one ")])])])):g("",!0),t.dialog==="replace"?(l(),c("div",Qt,[e("div",{class:"dialog-bg",onClick:s[17]||(s[17]=(...i)=>t.dialogClose&&t.dialogClose(...i))}),e("div",ts,[e("div",{class:"dialog-body",innerHTML:t.dialogBody},null,8,ss),e("div",es,[e("div",{class:"button button-no-button clickable",onClick:s[18]||(s[18]=(...i)=>t.dialogClose&&t.dialogClose(...i))}," Cancel "),e("div",{class:"button button-danger clickable",onClick:s[19]||(s[19]=(...i)=>t.dialogConfirm&&t.dialogConfirm(...i))}," Replace image ")])])])):g("",!0),t.dialog==="confirm-submit"?(l(),c("div",os,[e("div",{class:"dialog-bg",onClick:s[20]||(s[20]=(...i)=>t.dialogClose&&t.dialogClose(...i))}),e("div",is,[e("div",{class:"dialog-body",innerHTML:t.dialogBody},null,8,ns),e("div",as,[e("div",{class:"button button-no-button clickable",onClick:s[21]||(s[21]=(...i)=>t.dialogClose&&t.dialogClose(...i))}," Cancel "),e("div",{class:"button button-ok clickable",onClick:s[22]||(s[22]=(...i)=>t.dialogConfirm&&t.dialogConfirm(...i))}," Send ")])])])):g("",!0),t.dialog==="clear"?(l(),c("div",rs,[e("div",{class:"dialog-bg",onClick:s[23]||(s[23]=(...i)=>t.dialogClose&&t.dialogClose(...i))}),e("div",ls,[e("div",cs,[e("div",{class:"responsive-image",style:C(t.clearImageUrlStyle)},null,4)]),e("div",{class:"dialog-body",innerHTML:t.dialogBody},null,8,ds),e("div",hs,[e("div",{class:"button button-no-button clickable",onClick:s[24]||(s[24]=(...i)=>t.dialogClose&&t.dialogClose(...i))}," Cancel "),e("div",{class:"button button-danger clickable",onClick:s[25]||(s[25]=(...i)=>t.dialogConfirm&&t.dialogConfirm(...i))}," Clear ")])])])):g("",!0)])}var gs=v(et,[["render",us]]);const ms=p({}),ps={width:"19",height:"25",viewBox:"0 0 19 25",fill:"none",xmlns:"http://www.w3.org/2000/svg"},vs=e("path",{d:"M1.34074 16.8137C1.34074 17.6148 0.52442 22.7293 1.4188 23.4937C1.57266 23.6252 4.27862 21.6554 4.77556 21.3546C6.74882 20.1601 8.26415 18.4096 9.55698 16.476C11.1939 14.0279 12.178 11.238 14.3384 9.04547C15.3798 7.98857 17.5 5.9796 17.5 4.48583C17.5 2.99759 14.8174 2.44392 13.9871 1.44607C12.7588 -0.0301503 11.4167 2.53807 10.8255 3.64145C8.97478 7.09562 5.93021 10.015 4.15105 13.4362M10.8254 4.31686C12.184 5.44892 13.8066 6.50765 15.0409 7.69437M9.06921 6.00566C10.1007 6.98057 12.9941 8.82439 13.636 10.0587",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round"},null,-1),fs=[vs];function _s(t,s,o,n,a,r){return l(),c("svg",ps,fs)}var ws=v(ms,[["render",_s]]);const Cs=p({}),bs={width:"21",height:"23",viewBox:"0 0 21 23",fill:"none",xmlns:"http://www.w3.org/2000/svg"},ks=e("path",{d:"M8.6857 9.58965C8.51179 8.19497 7.59609 5.01552 8.98288 3.79318C9.79935 3.07353 10.862 4.14397 11.3009 4.73954C11.7015 5.28323 11.7263 5.33102 12.4302 5.33102C13.8211 5.33102 14.2087 4.95856 14.6689 3.63545C15.0273 2.60503 15.7758 1.76607 16.7096 1.24983C17.2706 0.939645 19.2099 0.779084 19.3644 1.62443C19.8104 4.06593 18.9799 5.02352 17.4228 6.57312C15.5105 8.47616 16.5184 9.34733 17.5218 11.719C18.0947 13.0729 15.8176 12.9611 14.9463 13.1188C13.4498 13.3896 12.8656 12.2271 11.6179 13.6905C9.79426 15.8294 7.71129 17.858 5.99127 20.0588C5.59577 20.5648 2.04134 23.0892 1.5732 21.4586C1.13551 19.9342 2.37142 16.6874 4.04969 16.6874",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round"},null,-1),ys=[ks];function $s(t,s,o,n,a,r){return l(),c("svg",bs,ys)}var Is=v(Cs,[["render",$s]]);const Ds=p({}),Ss={width:"25",height:"25",viewBox:"0 0 25 25",fill:"none",xmlns:"http://www.w3.org/2000/svg"},Ms=e("path",{d:"M15.2026 20.4059C12.1702 21.6833 7.00132 25.0358 4.573 21.2567C2.63447 18.2398 3.03749 14.4589 2.2581 11.0475C0.793481 4.63683 5.75646 -0.650226 12.2263 3.43789C13.6243 4.32123 25.8508 14.1699 22.3835 16.1521C15.8336 19.8966 14.5169 14.1075 10.1004 11.8983",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round"},null,-1),Bs=[Ms];function Ls(t,s,o,n,a,r){return l(),c("svg",Ss,Bs)}var zs=v(Ds,[["render",Ls]]);const Ps=p({}),Ts={width:"24",height:"23",viewBox:"0 0 24 23",fill:"none",xmlns:"http://www.w3.org/2000/svg"},Es=e("path",{d:"M1.50616 12.2794C1.50616 8.28949 1.52414 6.00483 3.35146 2.79446C3.7407 2.11062 5.80713 0.756378 6.55647 1.03798C8.24341 1.67193 8.23865 4.06156 9.47011 4.95241C9.90322 5.26573 11.9972 3.68356 12.4566 3.49705C13.8656 2.92498 15.3332 2.79446 16.8271 2.79446C19.7283 2.79446 19.456 3.14654 21.149 5.47936C22.3195 7.09232 22.4844 9.87151 22.4844 11.8278C22.4844 14.8829 21.1795 18.2213 18.7695 20.1585C18.0499 20.7369 16.7286 21.0144 16.3657 21.7644M4.12853 16.3446C5.08648 16.3239 12.744 16.7418 12.8695 14.5379C12.9121 13.7884 10.9996 10.283 11.8011 10.0463C12.2697 9.90799 15.7596 9.748 15.9045 10.2722C16.2421 11.4932 15.9288 13.2649 15.9288 14.5379M13.7345 18.0948C14.5465 19.4251 15.3836 20.7153 16.2537 22M1.48438 12.7447C1.85884 13.7354 2.58818 15.6947 3.94957 15.6947C4.58896 15.6947 5.04081 15.7577 5.63628 15.9628",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round"},null,-1),Us=[Es];function Os(t,s,o,n,a,r){return l(),c("svg",Ts,Us)}var Hs=v(Ps,[["render",Os]]);const Ws=p({}),Ns={width:"24",height:"23",viewBox:"0 0 24 23",fill:"none",xmlns:"http://www.w3.org/2000/svg"},xs=e("path",{d:"M12.4089 13.7917C14.5409 11.4576 16.5354 9.69995 17.8634 6.90587C18.889 4.74793 19.3445 4.25329 16.3482 3.08039C14.6 2.39602 12.2353 1.42912 10.4999 1.06847C7.75544 0.498158 6.22453 3.62675 5.01509 5.40402C3.36443 7.82965 1.5 12.3093 1.5 15.0669C1.5 17.2112 1.69173 17.2263 3.80299 17.9856C5.54232 18.6112 6.61693 19.9125 8.59079 19.9125M4.22719 10.2213C6.49673 12.0315 8.97428 14.4214 11.8634 15.322M12.4093 21.9528H17.3183M20.0233 5.31399C22.5345 8.37513 23.9589 10.4666 20.1095 13.133C18.6713 14.1293 17.0772 15.4173 16.2305 16.9216C15.5992 18.0433 13.8326 19.4503 12.7394 20.1863C11.9496 20.7181 11.4228 21.6684 10.7137 22M8.74404 18.2614C9.97157 17.3121 11.2185 16.3935 12.4706 15.4735M15.6475 15.8473L13.5461 14.6682",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round"},null,-1),As=[xs];function Ks(t,s,o,n,a,r){return l(),c("svg",Ns,As)}var Rs=v(Ws,[["render",Ks]]);const Vs=p({}),Fs={width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},Js=e("path",{d:"M3.46083 1.42417C7.10747 -0.166485 8.08265 3.02571 9.70105 5.8783C11.4429 4.73862 15.1278 1.61602 17.433 2.90888C21.5924 5.24158 16.3121 8.16103 14.9117 10.9098C13.6076 13.4696 19.9503 14.394 17.433 17.5704C16.3045 18.9945 14.7074 18.5369 13.3149 17.756C12.1694 17.1135 11.9679 15.0862 10.8356 14.4979C9.62925 13.871 7.27704 17.6349 6.75953 18.4983C6.08525 19.6233 3.84548 18.5668 3.06162 18.1272C1.73805 17.3849 0.120623 16.7381 1.56985 15.1577C2.73649 13.8855 4.88246 13.177 5.83505 11.8171C6.44976 10.9396 7.13452 11.31 7.05368 9.96125C7.0404 9.73969 6.35625 8.73446 6.21325 8.55903C5.35826 7.51013 4.33953 6.52657 3.64993 5.34215C2.97731 4.18691 1.35143 2.34429 3.46083 1.42417Z",fill:"currentColor",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round"},null,-1),Ys=[Js];function js(t,s,o,n,a,r){return l(),c("svg",Fs,Ys)}var Gs=v(Vs,[["render",js]]);const f=V(gs);f.component("icon-pen",ws);f.component("icon-eyedropper",Is);f.component("icon-send",zs);f.component("icon-undo",Hs);f.component("icon-eraser",Rs);f.component("icon-clear",Gs);f.mount("#app");
