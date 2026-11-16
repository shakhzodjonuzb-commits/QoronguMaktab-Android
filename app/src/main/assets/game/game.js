'use strict';
/* ================= QORONG'U MAKTAB II ================= */
const $=id=>document.getElementById(id),R0=Math.random,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t;
const TOUCH=matchMedia('(pointer:coarse)').matches;
let rnd=R0;const mul=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
let pf={nick:'Oyinchi',sens:1,fov:80,vol:.8,gfx:2};try{Object.assign(pf,JSON.parse(localStorage.getItem('qm2')||'{}'))}catch(e){}
try{if(TOUCH&&!localStorage.getItem('qm2'))pf.gfx=0}catch(e){}
const savePf=()=>{try{localStorage.setItem('qm2',JSON.stringify(pf))}catch(e){}};
const DF=[{n:'Mashq (Practice)',sp:.5,vis:8,hear:.4,need:3,dr:.4,hp:150,dmg:10},{n:'Oson (Easy)',sp:.75,vis:11,hear:.7,need:3,dr:.7,hp:120,dmg:20},
{n:'Oddiy (Normal)',sp:1,vis:14,hear:1,need:4,dr:1,hp:100,dmg:30},{n:'Qiyin (Hard)',sp:1.2,vis:17,hear:1.3,need:5,dr:1.3,hp:100,dmg:40},
{n:'Ekstrem (Extreme)',sp:1.45,vis:20,hear:1.6,need:6,dr:1.6,hp:80,dmg:55},{n:'Imkonsiz (Impossible)',sp:1.75,vis:26,hear:2,need:6,dr:2,hp:50,dmg:100}];
const GFX=[{n:'1 · Kartoshka',pr:.55,sh:0,fog:.1,dust:0,lt:0},{n:'2 · Past',pr:.8,sh:0,fog:.085,dust:0,lt:1},{n:'3 · O\'rta',pr:1,sh:0,fog:.07,dust:90,lt:1},{n:'4 · Yuqori',pr:1.5,sh:0,fog:.06,dust:170,lt:1},{n:'5 · Ultra',pr:2,sh:1,fog:.05,dust:260,lt:1}];
const LORE2=['Kundalik: «Bekzod podvalda o\'ynashni yaxshi ko\'rardi. U doim kimdir bilan gaplashardi.»','Kundalik: «Podval devorlarida ingichka barmoq izlari bor. Juda uzun barmoqlar.»','Xat: «Yupqa senga qaragan paytingda sekinlashadi. Qaramasang, yaqinlashadi. Ko\'zingni uzma.»','Eslatma: «Muhrlar qurbongohga qo\'yilsa u bir zum bo\'shashadi. Faqat bir zum.»','Gazeta: «Karimovlar uyida 7 bola yo\'qoldi. Politsiya hovlidagi quduqdan boshqa hech narsa topmadi.»','Kundalik: «Generator omborxonada. Benzinni quduq yonida qoldirdik. Saqlagichni Rustam yashirgan.»','Xat: «Janubiy darvoza faqat elektrdan ochiladi. Hovlida u yanada tezroq...»','So\'nggi sahifa: «Agar buni o\'qiyotgan bo\'lsang, yugur. Orqangga qarama.»'],INTRO=['1994-yil. Karimovlar oilasining uyi bir kechada bo\'shab qoldi.','Mehmonlar kelib-ketdi. Faqat dahlizdan kimdir shivirladi: «Qoldingmi?..»','Eshiklar qulflangan. Yupqa uyg\'oq. Omon qol.'];
const LORE=['«Bu uyda bolalar o\'ynardi. Keyin ular birin-ketin yo\'qola boshladi.»','«Ota podvalda nimadir uyg\'otdi. U ingichka edi, tinmay jilmayardi.»','«Yupqa yugurmaydi. Sen qaramaganingda yaqinlashadi.»','«Unga qarab tur. Ko\'zingni uzma, hatto yig\'lasang ham.»','«Chiroq qorong\'ulikni yengadi. Yo\'lingni top va undan uzoqlash.»','«Eshik ochiladi. Lekin u seni baribir qo\'yib yubormaydi.»'];

/* ---------- renderer / scene ---------- */
const RD=new THREE.WebGLRenderer({antialias:!TOUCH,powerPreference:'high-performance'});RD.shadowMap.enabled=true;
const cv=RD.domElement;document.body.prepend(cv);
const scene=new THREE.Scene();scene.background=new THREE.Color(0x020203);scene.fog=new THREE.FogExp2(0x020203,.07);
const cam=new THREE.PerspectiveCamera(80,innerWidth/innerHeight,.08,70);cam.rotation.order='YXZ';scene.add(cam);
scene.add(new THREE.AmbientLight(0x3a4458,.6));
const FL=new THREE.SpotLight(0xfff0d8,6,48,.62,.5,1);FL.position.set(.15,-.1,0);FL.target.position.set(0,0,-1);cam.add(FL,FL.target);
FL.shadow.mapSize.set(1024,1024);FL.shadow.bias=-.0004;
const PL=new THREE.PointLight(0xffddb0,.4,6,2);cam.add(PL);
const DN=260,dp=new Float32Array(DN*3);for(let i=0;i<DN*3;i++)dp[i]=(R0()-.5)*10;
const dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.BufferAttribute(dp,3));
const dust=new THREE.Points(dg,new THREE.PointsMaterial({color:0xaaa090,size:.035,transparent:true,opacity:.55}));dust.frustumCulled=false;scene.add(dust);
const dlights=[];
function applyGfx(){const q=GFX[pf.gfx];RD.setPixelRatio(Math.min(devicePixelRatio,q.pr));RD.setSize(innerWidth,innerHeight);
 scene.fog.density=q.fog;FL.castShadow=!!q.sh;dust.visible=q.dust>0;dg.setDrawRange(0,q.dust);dlights.forEach(l=>l.visible=!!q.lt);
 cam.fov=pf.fov;cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}
addEventListener('resize',applyGfx);

/* ---------- textures ---------- */
function cvTex(w,h,fn,rx,ry){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;if(rx)t.repeat.set(rx,ry||rx);t.anisotropy=4;return t}
const nz0=(x,w,h,n,a)=>{for(let i=0;i<n;i++){x.fillStyle=`rgba(0,0,0,${R0()*a})`;x.fillRect(R0()*w,R0()*h,R0()*8,R0()*8)}};
const woodT=(c1,c2,rx,ry)=>cvTex(128,128,(x,w,h)=>{x.fillStyle=c1;x.fillRect(0,0,w,h);for(let i=0;i<8;i++){x.fillStyle=c2;x.fillRect(0,i*16,w,1);x.fillStyle=`rgba(0,0,0,${.1+R0()*.2})`;x.fillRect(R0()*w,i*16,R0()*60,15)}nz0(x,w,h,400,.25)},rx,ry);
const wallT=cvTex(128,128,(x,w,h)=>{x.fillStyle='#5b4a3e';x.fillRect(0,0,w,h);for(let i=0;i<w;i+=16){x.fillStyle='rgba(120,90,60,.25)';x.fillRect(i,0,8,h)}nz0(x,w,h,900,.3);for(let i=0;i<6;i++){x.fillStyle='rgba(50,0,0,.35)';x.fillRect(R0()*w,0,2+R0()*3,20+R0()*100)}});
const brickT=cvTex(128,128,(x,w,h)=>{x.fillStyle='#3a3836';x.fillRect(0,0,w,h);for(let r=0;r<8;r++)for(let c=0;c<4;c++){x.fillStyle=`rgb(${60+R0()*25|0},${48+R0()*18|0},${44+R0()*14|0})`;x.fillRect(c*32+(r%2?16:0)+1,r*16+1,30,14)}nz0(x,w,h,600,.3)});
const WM=[wallT,woodT('#3a2c20','#1a120a'),brickT,woodT('#2c2418','#120c06')].map(t=>new THREE.MeshLambertMaterial({map:t}));
const gc={};const gTex=c=>gc[c]||(gc[c]=cvTex(64,64,(x)=>{const r=x.createRadialGradient(32,32,0,32,32,32),s='#'+c.toString(16).padStart(6,'0');r.addColorStop(0,s);r.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=r;x.fillRect(0,0,64,64)}));
const glow=(c,s)=>{const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:gTex(c),blending:THREE.AdditiveBlending,fog:false,depthWrite:false}));sp.scale.set(s,s,1);return sp};
const mc={},mat=(c,e)=>{const k=c+'_'+(e||0);return mc[k]||(mc[k]=new THREE.MeshLambertMaterial({color:c,emissive:e||0}))};
const add=m=>{m.castShadow=m.receiveShadow=true;scene.add(m);return m};

/* ---------- uy rejasi (1 katak = 1.5 m) ---------- */
const CS=1.5,GW=48,GH=28,WH=3;
const EH=[],EV=[];for(let i=0;i<=GH;i++){EH.push(new Uint8Array(GW+1));EV.push(new Uint8Array(GW+1))}
const cols=[],wallsL=[];
function box(x,z,w,d,h,c,o){o=o||{};const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),o.m||mat(c,o.e));m.position.set(x,(o.y||0)+h/2,z);add(m);if(!o.nc&&!o.y)cols.push({x1:x-w/2,x2:x+w/2,z1:z-d/2,z2:z+d/2,on:1});return m}
function cyl(x,z,r,h,c,o){o=o||{};const m=new THREE.Mesh(new THREE.CylinderGeometry(r*(o.tp||1),r,h,10),o.m||mat(c,o.e));m.position.set(x,(o.y||0)+h/2,z);if(o.rz)m.rotation.z=Math.PI/2;if(o.rx)m.rotation.x=Math.PI/2;add(m);if(!o.nc)cols.push({x1:x-r,x2:x+r,z1:z-r,z2:z+r,on:1});return m}
const F=a=>a.forEach(q=>box(...q));
function seg(x1,z1,x2,z2,mi){const T=.25,hz=z1===z2,w=hz?x2-x1+T:T,d=hz?T:z2-z1+T,g=new THREE.BoxGeometry(w,WH,d),uv=g.attributes.uv,a=hz?16:0,k=(hz?w:d)/3;
 for(let i=a;i<a+8;i++)uv.setX(i,uv.getX(i)*k);const m=new THREE.Mesh(g,WM[mi]);m.position.set((x1+x2)/2,WH/2,(z1+z2)/2);add(m);
 const b={x1:m.position.x-w/2,x2:m.position.x+w/2,z1:m.position.z-d/2,z2:m.position.z+d/2,on:1,w:1};cols.push(b);wallsL.push(b)}
function lint(x1,z1,x2,z2){const hz=z1===z2,m=new THREE.Mesh(new THREE.BoxGeometry(hz?x2-x1:.25,.5,hz?.25:z2-z1),WM[0]);m.position.set((x1+x2)/2,WH-.25,(z1+z2)/2);scene.add(m)}
function hwall(z,x0,x1,gaps,mi){gaps=gaps||[];let s=null;for(let x=x0;x<=x1;x++){const gap=x===x1||gaps.includes(x);if(!gap){EH[z][x]=1;if(s===null)s=x}else{if(s!==null){seg(s*CS,z*CS,x*CS,z*CS,mi||0);s=null}if(x<x1)lint(x*CS,z*CS,(x+1)*CS,z*CS)}}}
function vwall(x,z0,z1,gaps,mi){gaps=gaps||[];let s=null;for(let z=z0;z<=z1;z++){const gap=z===z1||gaps.includes(z);if(!gap){EV[z][x]=1;if(s===null)s=z}else{if(s!==null){seg(x*CS,s*CS,x*CS,z*CS,mi||0);s=null}if(z<z1)lint(x*CS,z*CS,x*CS,(z+1)*CS)}}}
// uy
hwall(0,0,18);hwall(14,0,18,[9]);vwall(0,0,14);vwall(18,0,14);
hwall(6,0,18,[2,8,14]);hwall(8,0,18,[2,8,9,14]);vwall(5,0,6,[3]);vwall(12,0,6);vwall(6,8,14,[11]);vwall(12,8,14,[11]);
// chordoq
hwall(0,30,48,[],1);hwall(12,30,48,[],1);vwall(30,0,12,[],1);vwall(48,0,12,[],1);vwall(38,0,7,[],1);vwall(44,5,12,[],1);
// podval
hwall(16,30,48,[],2);hwall(28,30,48,[],2);vwall(30,16,28,[],2);vwall(48,16,28,[],2);vwall(36,16,24,[],2);vwall(42,20,28,[],2);hwall(22,42,48,[45],2);
// hovli (tashqarisi) va omborxona
hwall(0,18,30,[],3);vwall(30,12,16,[],3);hwall(28,0,30,[22,23],3);vwall(0,14,28,[],3);EH[28][22]=EH[28][23]=1;
hwall(2,24,29,[],1);hwall(7,24,29,[26],1);vwall(24,2,7,[],1);vwall(29,2,7,[],1);
EH[14][9]=1; // old eshik yopiq
const WALK=new Uint8Array(GW*GH);[[0,0,18,14],[30,0,48,12],[30,16,48,28],[18,0,30,14],[0,14,30,28]].forEach(([a,b,c,d])=>{for(let z=b;z<d;z++)for(let x=a;x<c;x++)WALK[z*GW+x]=1});
const LK={};[[17,7,31,6],[0,7,31,22]].forEach(([a,b,c,d])=>{const i=b*GW+a,j=d*GW+c;(LK[i]=LK[i]||[]).push(j);(LK[j]=LK[j]||[]).push(i)});
function nb(x,z,f){if(x<GW-1&&WALK[z*GW+x+1]&&!EV[z][x+1])f(z*GW+x+1);if(x>0&&WALK[z*GW+x-1]&&!EV[z][x])f(z*GW+x-1);if(z<GH-1&&WALK[(z+1)*GW+x]&&!EH[z+1][x])f((z+1)*GW+x);if(z>0&&WALK[(z-1)*GW+x]&&!EH[z][x])f((z-1)*GW+x);(LK[z*GW+x]||[]).forEach(f)}
function bfs(gx,gz){const D=new Int16Array(GW*GH).fill(-1),q=[gz*GW+gx];D[q[0]]=0;for(let h=0;h<q.length;h++){const c=q[h];nb(c%GW,(c/GW)|0,n=>{if(D[n]<0){D[n]=D[c]+1;q.push(n)}})}return D}
const zoneOf=(x,z)=>x>=45?(z<20?1:2):(z>21.3||x>27.3?3:0);
const WALKC=[];for(let i=0;i<GW*GH;i++)if(WALK[i])WALKC.push(i);

/* ---------- pol / shift ---------- */
function plane(cx,cz,w,d,y,map,face){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),new THREE.MeshLambertMaterial({map}));m.rotation.x=face;m.position.set(cx,y,cz);m.receiveShadow=true;scene.add(m);return m}
const conc=cvTex(128,128,(x,w,h)=>{x.fillStyle='#4a4a48';x.fillRect(0,0,w,h);nz0(x,w,h,1500,.4)},9,6);
[[13.5,10.5,27,21,woodT('#4a3424','#25180e',9,7)],[58.5,9,27,18,woodT('#33281c','#150e08',9,6)],[58.5,33,27,18,conc]].forEach(([a,b,c,d,t])=>{plane(a,b,c,d,0,t,-Math.PI/2);plane(a,b,c,d,WH,cvTex(64,64,(x,w,h)=>{x.fillStyle='#2e2a26';x.fillRect(0,0,w,h);nz0(x,w,h,300,.3)},c/3,d/3),Math.PI/2)});
plane(22.5,4.5,9,9,.01,cvTex(64,64,(x,w,h)=>{x.fillStyle='#bfc4c0';x.fillRect(0,0,w,h);x.fillStyle='#202428';x.fillRect(0,0,32,32);x.fillRect(32,32,32,32);nz0(x,w,h,200,.3)},6,6),-Math.PI/2);
plane(13.5,10.5,22,1.3,.012,cvTex(32,32,(x,w,h)=>{x.fillStyle='#4a0d0d';x.fillRect(0,0,w,h);x.fillStyle='#7a5a2a';x.fillRect(0,0,w,3);x.fillRect(0,h-3,w,3);nz0(x,w,h,100,.4)},1,1),-Math.PI/2);
plane(12.75,3.8,4,3,.012,cvTex(32,32,(x,w,h)=>{x.fillStyle='#5a1414';x.fillRect(0,0,w,h);x.fillStyle='#2a0808';x.fillRect(4,4,24,24);nz0(x,w,h,80,.4)},1,1),-Math.PI/2);

/* ---------- dekor ---------- */
const T_pic=[0,1,2].map(k=>cvTex(64,80,(x,w,h)=>{x.fillStyle=['#2a2018','#1c2420','#241c24'][k];x.fillRect(0,0,w,h);x.fillStyle='#b9a58c';x.beginPath();x.ellipse(32,36,15,20,0,0,7);x.fill();x.fillStyle='#000';x.fillRect(24,30,6,8);x.fillRect(35,30,6,8);x.fillRect(27,48,12,2)}));
function frame(x,y,z,ry,k){const g=new THREE.Group(),f=new THREE.Mesh(new THREE.BoxGeometry(.7,.9,.05),mat(0x2a1a0a)),p=new THREE.Mesh(new THREE.PlaneGeometry(.58,.76),new THREE.MeshLambertMaterial({map:T_pic[k%3]}));p.position.z=.03;g.add(f,p);g.position.set(x,y,z);g.rotation.y=ry;scene.add(g)}
const T_blood=cvTex(64,64,(x)=>{x.fillStyle='rgba(90,0,0,.8)';for(let i=0;i<9;i++){x.beginPath();x.arc(32+(R0()-.5)*30,32+(R0()-.5)*30,3+R0()*11,0,7);x.fill()}});
function decal(x,y,z,ry,rx,s){const m=new THREE.Mesh(new THREE.PlaneGeometry(s,s),new THREE.MeshBasicMaterial({map:T_blood,transparent:true,depthWrite:false,color:0x888888}));m.position.set(x,y,z);m.rotation.set(rx,ry,0);scene.add(m)}
const winMats=[];function win_(x,z,ry){const m=new THREE.MeshBasicMaterial({color:0x070b14}),p=new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.4),m);p.position.set(x,1.8,z);p.rotation.y=ry;scene.add(p);winMats.push(m);
 const b=new THREE.Mesh(new THREE.BoxGeometry(ry%Math.PI?.04:1.2,.04,ry%Math.PI?1.2:.04),mat(0x1a1008));b.position.copy(p.position);scene.add(b)}
[[2,.14,0],[5.4,.14,0],[10,.14,0],[15.5,.14,0],[24,.14,0],[.14,16.5,Math.PI/2],[26.86,16.5,-Math.PI/2],[.14,4,Math.PI/2],[26.86,4,-Math.PI/2]].forEach(a=>win_(...a));
// Oshxona
F([[3.8,.4,6.4,.7,.95,0x6a5a4a],[.4,3.2,.7,3.2,.95,0x6a5a4a],[7,.5,.8,.8,2,0xb8bcc0],[3.2,6.2,1.6,1,.8,0x5a3d2a],[2.4,6.2,.4,.4,.5,0x4a3020],[4,6.2,.4,.4,.5,0x4a3020],[3.2,5.3,.4,.4,.5,0x4a3020],[3.2,7.2,.4,.4,.5,0x4a3020],[5.6,.45,.8,.7,.95,0x222222,{e:0x040404}],[6.9,8.4,.9,.9,1.1,0x3a3a3a]]);
cyl(5.6,.45,.18,.25,0x888888,{y:.95,nc:1});
// Mehmonxona + TV
F([[12.75,.4,2.2,.6,.5,0x2a1a10],[12.75,.35,1.5,.12,.85,0x050505,{y:.5}],[12.75,6,3.2,1,.8,0x4a2a2a],[12.75,6.5,3.2,.3,.6,0x4a2a2a,{y:.8}],[9,4.5,1.1,1.1,.8,0x3a2a1a],[12.75,3.7,1.4,.8,.45,0x3a2410],[17.6,2.5,.5,3.2,2.2,0x3a2410],[10,.5,1.8,.7,1.4,0x333333],[17.4,7.8,.5,.5,2.2,0x2a1a0a]]);
const tvC=document.createElement('canvas');tvC.width=48;tvC.height=32;const tvX=tvC.getContext('2d'),tvT=new THREE.CanvasTexture(tvC);
const tv=new THREE.Mesh(new THREE.PlaneGeometry(1.3,.74),new THREE.MeshBasicMaterial({map:tvT}));tv.position.set(12.75,.93,.53);scene.add(tv);
const tvL=new THREE.PointLight(0x6688ff,1.1,10,2);tvL.position.set(12.75,1.2,1.8);scene.add(tvL);dlights.push(tvL);
const fireL=new THREE.PointLight(0xff4410,.8,7,2);fireL.position.set(10,.6,1.1);scene.add(fireL);dlights.push(fireL);
box(10,.15,1.1,.1,.6,0x000000,{nc:1,e:0x701800});
// Hammom
F([[25.6,1.4,1.6,3,.7,0xdddddd],[21,.45,1,.6,.9,0xcccccc],[19,4.6,.7,.9,.7,0xe0e0e0],[26.4,7,.9,.9,.5,0x555555]]);
plane(25.6,1.4,1.3,2.7,.73,cvTex(8,8,x=>{x.fillStyle='#4a0606';x.fillRect(0,0,8,8)}),-Math.PI/2);
const mir=new THREE.Mesh(new THREE.PlaneGeometry(1.2,1),new THREE.MeshBasicMaterial({color:0x0c1218}));mir.position.set(21,1.7,.14);scene.add(mir);
const bathL=new THREE.PointLight(0xffe8c0,.7,8,2);bathL.position.set(22.5,2.6,4.5);scene.add(bathL);dlights.push(bathL);
// Yotoqxona
F([[2,16.2,2,3,.55,0x6a3a3a],[2,14.8,2.1,.15,1.1,0x3a2210],[.6,14.7,.5,.5,.55,0x3a2a1a],[3.5,14.7,.5,.5,.55,0x3a2a1a],[8.6,14.5,.7,2.4,2.2,0x3a2a1a],[4,20.4,2.4,.7,1],[6.5,19.5,.8,.8,.5,0x5a3a2a]].map(a=>a.length<6?a.concat([0x4a3020]):a));
box(5.3,15.5,.3,.3,.25,0x7a4a20,{nc:1});box(5.3,15.5,.2,.2,.2,0x8a5a2a,{nc:1,y:.25}); // ayiqcha
// Kirish zali
F([[10,20.5,.5,.5,1.8,0x3a2a1a],[11.8,20.7,2,.5,.5,0x2a1a10],[16.5,20.6,1.8,.5,.9,0x3a2410],[10,13.2,.5,.5,2.2,0x2a1a0a],[17.5,14,.6,2,.4,0x333333]]);
cyl(16.5,20.6,.12,.3,0x225566,{y:.9,nc:1});
const mir2=new THREE.Mesh(new THREE.PlaneGeometry(1.1,2),new THREE.MeshBasicMaterial({color:0x0a1014}));mir2.position.set(9.14,1.5,18.7);mir2.rotation.y=Math.PI/2;scene.add(mir2);
const exitM=new THREE.Mesh(new THREE.BoxGeometry(1.5,WH,.2),mat(0x4a1c0e));exitM.position.set(14.25,WH/2,21);add(exitM);const exitC={x1:13.5,x2:15,z1:20.9,z2:21.1,on:1};cols.push(exitC);
// Ofis
F([[23,19.5,2.6,1,.8,0x4a3020],[23,18.3,.6,.6,.5,0x222222],[26.6,17,.5,6,2.4,0x3a2410],[19,20.3,.9,.9,1.1,0x333a3a],[19.5,13,.9,.5,1.8,0x3a2a1a]]);
cyl(20.5,14,.3,.5,0x335577,{y:.8,nc:1});
// Yo'lak
F([[3,11.7,.8,.4,.8,0x3a2410],[9,9.3,1,.4,.8,0x3a2410],[20,11.7,.8,.4,.8,0x3a2410]]);cyl(3,11.7,.13,.3,0x663322,{y:.8,nc:1});
// zinalar
function stairs(x,z,dir){for(let i=0;i<5;i++)box(x+dir*i*.4,z,.4,2.4,.3*(i+1),0x2a1a10,{})}
stairs(25.2,10.5,1);box(.2,10.5,.12,1.2,2.2,0x2a1608,{nc:1});box(.3,10.2,.05,.1,.1,0xc0a040,{nc:1,y:1});
stairs(46.4,9.75,-1);stairs(46.4,33.75,-1);
// chordoq: qutilar, manekenlar
const dr=mul(777);
function mannequin(x,z,ry){const g=new THREE.Group(),m=mat(0xcfc6b4,0x181612);const b=new THREE.Mesh(new THREE.CylinderGeometry(.18,.22,.9,8),m);b.position.y=1.1;const h=new THREE.Mesh(new THREE.SphereGeometry(.14,8,8),m);h.position.y=1.7;
 [-.1,.1].forEach(s=>{const l=new THREE.Mesh(new THREE.BoxGeometry(.1,.7,.1),m);l.position.set(s,.35,0);g.add(l)});g.add(b,h);g.position.set(x,0,z);g.rotation.y=ry;g.traverse(o=>o.castShadow=true);scene.add(g);cols.push({x1:x-.25,x2:x+.25,z1:z-.25,z2:z+.25,on:1})}
for(let i=0;i<30;i++){const x=46.5+dr()*24,z=1+dr()*16;if(Math.hypot(x-47.25,z-9.75)<3||Math.hypot(x-69.5,z-4.5)<4||cols.some(c=>c.w&&x>c.x1-.9&&x<c.x2+.9&&z>c.z1-.9&&z<c.z2+.9))continue;const s=.6+dr()*.9;box(x,z,s,s,s*(.7+dr()*.5),[0x5a4020,0x4a3418,0x6a5030][i%3])}
for(let i=0;i<8;i++){const x=46.5+dr()*24,z=1+dr()*16;if(Math.hypot(x-47.25,z-9.75)>3&&Math.hypot(x-69.5,z-4.5)>4&&!cols.some(c=>x>c.x1-.7&&x<c.x2+.7&&z>c.z1-.7&&z<c.z2+.7))mannequin(x,z,dr()*6.28)}
for(let i=0;i<5;i++){const x=48+dr()*22,z=1+dr()*16;if(!cols.some(c=>x>c.x1-.7&&x<c.x2+.7&&z>c.z1-.7&&z<c.z2+.7)){const c=cyl(x,z,.5,1.3,0xb8b4a8,{tp:.5});}}
const atL=new THREE.PointLight(0xffc880,.7,14,2);atL.position.set(59,2.6,9);scene.add(atL);dlights.push(atL);
// podval
cyl(68,27.5,1.2,2.6,0x5a3a2a);cyl(66,37,.5,1,0x3a3a2a);cyl(69,38,.5,1,0x4a2a1a);
for(let i=0;i<7;i++){const x=47+dr()*23,z=25+dr()*16;if(!cols.some(c=>x>c.x1-.9&&x<c.x2+.9&&z>c.z1-.9&&z<c.z2+.9)&&Math.hypot(x-47.25,z-33.75)>3)cyl(x,z,.35,.9,0x3a2e22)}
for(let i=0;i<4;i++)cyl(50+i*5,24.4,.07,WH,0x5a5a5a,{rx:0,tp:1,nc:1}),cyl(58,25+i*4,.06,24,0x666666,{rz:1,y:2.7,nc:1});
F([[60,34,2.6,1.2,.8,0x5a3a30],[53,30,.6,.6,2,0x2a2a2a]]);
for(let i=0;i<5;i++)cyl(55+i*2.5,29.5,.015,1.6,0x777777,{y:1.4,nc:1});
mannequin(64,38,3);mannequin(52,40,1);mannequin(40+18,31,2);
decal(57,.02,32,0,-Math.PI/2,2.4);decal(65,.02,25,0,-Math.PI/2,1.8);decal(46,.02,36,0,-Math.PI/2,1.6);decal(2,.02,10.5,0,-Math.PI/2,1.6);decal(14,.02,5,0,-Math.PI/2,2);
decal(.14,1.4,16,Math.PI/2,0,1.8);decal(22.5,1.5,.14,0,0,1.5);decal(13.5,1.4,20.88,Math.PI,0,2);
const baL=new THREE.PointLight(0xff2a10,.9,14,2);baL.position.set(58,2.6,33);scene.add(baL);dlights.push(baL);
// ===== HOVLI, QABRISTON, OMBORXONA, DARVOZA, QURBONGOH =====
const mkGrass=(rx,ry)=>cvTex(128,128,(x,w,h)=>{x.fillStyle='#1c2416';x.fillRect(0,0,w,h);nz0(x,w,h,1800,.5);for(let i=0;i<300;i++){x.fillStyle=`rgba(40,60,30,${R0()*.4})`;x.fillRect(R0()*w,R0()*h,1,4+R0()*6)}},rx,ry);
plane(22.5,31.5,45,21,0,mkGrass(12,6),-Math.PI/2);plane(36,10.5,18,21,0,mkGrass(6,7),-Math.PI/2);
const moon=glow(0xaab8ff,18);moon.position.set(30,28,62);scene.add(moon);
const gateM=new THREE.Mesh(new THREE.BoxGeometry(3,2.4,.15),mat(0x1a1a1a));gateM.position.set(34.5,1.2,42);add(gateM);const gateC={x1:33,x2:36,z1:41.9,z2:42.1,on:1};cols.push(gateC);
for(let r=0;r<3;r++)for(let c=0;c<5;c++){const x=31+c*2.3,z=28+r*3.2;box(x,z,.7,.25,.8+dr()*.5,0x55524e);if((r+c)%2)box(x,z+.5,.12,.12,.5,0x3a3732,{nc:1})}
cyl(20,31.5,1,.9,0x4a4a4a);cyl(20,31.5,.8,.02,0x000000,{y:.91,nc:1});
box(8,36,3.6,1.7,.9,0x2a2e33);box(8,36,1.9,1.5,.7,0x1c2024,{y:.9,nc:1});
for(let i=0,n=0;i<300&&n<40;i++){const gx=dr()<.5,x=gx?28.5+dr()*15:1.5+dr()*43,z=gx?1.5+dr()*19:22.5+dr()*18;
 if((x>9&&x<19&&z<28)||(x>30&&x<39&&z>37)||cols.some(c=>x>c.x1-1.6&&x<c.x2+1.6&&z>c.z1-1.6&&z<c.z2+1.6))continue;n++;
 cyl(x,z,.28,3.2,0x2a1e14);const cr=new THREE.Mesh(new THREE.ConeGeometry(1.4,3.4,7),mat(0x0e1a0e));cr.position.set(x,4.4,z);add(cr)}
// omborxona + generator
box(39.75,6.75,7.7,7.7,.15,0x2a1a10,{y:3,nc:1});box(40,3.3,3,.8,.9,0x4a3020);box(37.5,9.8,.8,.8,1.6,0x3a2a1a);
box(41.8,4.4,1.3,1,1.1,0x7a3a10);cyl(41.8,4.4,.15,.5,0x333333,{y:1.1,nc:1});
// qurbongoh (chordoq)
box(69.5,4.5,1.8,1.2,.9,0x2a2a2a);for(let i=0;i<5;i++)cyl(68.7+i*.4,4.5,.05,.3,0xddddcc,{y:.9,nc:1,e:0x222211});
const altL=new THREE.PointLight(0xff5522,.9,9,2);altL.position.set(69.5,1.6,4.5);scene.add(altL);dlights.push(altL);const altG=glow(0xff4422,3);altG.position.set(69.5,1.3,4.5);scene.add(altG);
decal(69.5,.02,6,0,-Math.PI/2,3);decal(38,.02,9,0,-Math.PI/2,2);decal(20,.02,33,0,-Math.PI/2,2.4);
// ramkalar
[[3.8,1.9,.15,0],[10,1.9,.15,0],[15.5,1.9,.15,0],[23,1.9,9.12,0],[7,1.9,9.12,0],[17,1.9,9.12,0],[5,1.9,11.88,Math.PI],[14,1.9,11.88,Math.PI],[22,1.9,11.88,Math.PI],[.14,1.9,16,Math.PI/2],[.14,1.9,13.5,Math.PI/2],[10.5,1.9,20.88,Math.PI],[26.86,1.9,19,-Math.PI/2],[9.14,1.9,13.5,Math.PI/2],[50,1.9,.15,0],[64,1.9,17.85,Math.PI],[46,1.9,40,Math.PI/2]].forEach((a,i)=>frame(...a,i));

/* ---------- audio ---------- */
let AC,mg,tvG,rumG,whnO,rainG;
function A(){if(AC)return;AC=new(window.AudioContext||window.webkitAudioContext)();mg=AC.createGain();mg.gain.value=pf.vol;mg.connect(AC.destination);
 [48,49.3,96.5].forEach((f,i)=>{const o=AC.createOscillator(),g=AC.createGain(),l=AC.createBiquadFilter();o.type=i===2?'triangle':'sawtooth';o.frequency.value=f;g.gain.value=i===2?.012:.02;l.type='lowpass';l.frequency.value=170;o.connect(l);l.connect(g);g.connect(mg);o.start()});
 const nb=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate),d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=R0()*2-1;
 const loop=(f,type,gv)=>{const s=AC.createBufferSource();s.buffer=nb;s.loop=true;const fi=AC.createBiquadFilter();fi.type=type;fi.frequency.value=f;const g=AC.createGain();g.gain.value=gv;s.connect(fi);fi.connect(g);g.connect(mg);s.start();return g};
 loop(380,'lowpass',.05);tvG=loop(2500,'highpass',0);rainG=loop(5200,'highpass',0);
 const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.value=36;g.gain.value=0;o.connect(g);g.connect(mg);o.start();rumG=g}
function tone(f1,f2,d,v,type){if(!AC||v<=0)return;const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;o.type=type||'sine';o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(Math.max(1,f2),t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(mg);o.start(t);o.stop(t+d)}
function nz(d,v,f,q){if(!AC)return;const n=AC.sampleRate*d|0,b=AC.createBuffer(1,n,AC.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(R0()*2-1)*(1-i/n);const s=AC.createBufferSource();s.buffer=b;const fi=AC.createBiquadFilter();fi.type='bandpass';fi.frequency.value=f;fi.Q.value=q||1;const g=AC.createGain();g.gain.value=v;s.connect(fi);fi.connect(g);g.connect(mg);s.start()}
const heart=v=>{tone(70,35,.15,v);setTimeout(()=>tone(60,30,.18,v*.7),170)};
const whisper=()=>{for(let i=0;i<5;i++)setTimeout(()=>nz(.25,.12,1800+R0()*2200,6),i*140)};
const thunder=()=>{nz(2.8,.5,90,.5);tone(60,25,2.2,.4)};
const slam=()=>{nz(.3,.8,140,1);tone(90,35,.35,.6,'square')};

/* ================= O'YIN MANTIG'I ================= */
const P={x:13.5,z:18.5,yaw:0,pitch:0,st:100,tired:0,run:0,mv:0,on:1,hp:100,dead:0,zone:0,snare:0};
const G={di:2,keys:{c:0,b:0},relics:0,open:0,time:0},K={},inv={trap:0,coins:0};
let state='menu',bat=1,bob=0,stepA=0,locked=false,shake=0,deadT=0,dMon=99,items=[],traps={},trapN=0,msgT,flashT=0,lightOut=0,evT=30,flT=30,tvBurst=0,tvTm=0,uiT=0,hb=0,amb=6,fovK=0;
const IT={ckey:{n:'Chordoq kaliti',c:0xffd24a},bkey:{n:'Podval kaliti',c:0xffb030},relic:{n:'Muhr',c:0xc060ff},bat:{n:'Batareya',c:0x44ff77},med:{n:'Dori',c:0xff4444},trap:{n:'Tuzoq',c:0xaaaaaa},can:{n:'Konserva',c:0xffcc88},coin:{n:'Tanga',c:0xffe070},fuel:{n:'Benzin kanistri',c:0xff5522},fuse:{n:'Saqlagich',c:0x55ddff},note:{n:'Eslatma',c:0xeeeedd}};
const ROOMS={kitchen:[0,0,7.5,9],living:[7.5,0,18,9],bath:[18,0,27,9],bed:[0,12,9,21],foyer:[9,12,18,21],office:[18,12,27,21],hall:[0,9,27,12],attic:[45,0,72,18],base:[45,24,72,42],yard:[1,22.5,44,41],garden:[28.5,1,44,20],shed:[37,4,42.5,9.5],well:[16,27,25,36]};
const say=(t,ms)=>{const m=$('msg');m.textContent=t;m.style.opacity=1;clearTimeout(msgT);msgT=setTimeout(()=>m.style.opacity=0,ms||3200)};

/* ---------- to'qnashuv va ko'rish ---------- */
function collide(x,z,r){for(const b of cols){if(!b.on||x<b.x1-r||x>b.x2+r||z<b.z1-r||z>b.z2+r)continue;const cx=clamp(x,b.x1,b.x2),cz=clamp(z,b.z1,b.z2),dx=x-cx,dz=z-cz,d2=dx*dx+dz*dz;
 if(d2<r*r){if(d2>1e-8){const d=Math.sqrt(d2),k=(r-d)/d;x+=dx*k;z+=dz*k}else{const l=x-b.x1,rr=b.x2-x,t=z-b.z1,bt=b.z2-z,m=Math.min(l,rr,t,bt);if(m===l)x=b.x1-r;else if(m===rr)x=b.x2+r;else if(m===t)z=b.z1-r;else z=b.z2+r}}}return[x,z]}
function los(x1,z1,x2,z2){const d=Math.hypot(x2-x1,z2-z1),n=Math.ceil(d/.4);for(let i=1;i<n;i++){const t=i/n,x=x1+(x2-x1)*t,z=z1+(z2-z1)*t;for(const b of wallsL)if(x>b.x1&&x<b.x2&&z>b.z1&&z<b.z2)return false}return true}

/* ---------- buyumlar va tuzoqlar ---------- */
function itemMesh(k){const g=new THREE.Group(),it=IT[k],m=new THREE.MeshBasicMaterial({color:it.c});let b;
 if(k==='relic')b=new THREE.Mesh(new THREE.OctahedronGeometry(.18),m);
 else if(k==='ckey'||k==='bkey'){b=new THREE.Group();const r=new THREE.Mesh(new THREE.TorusGeometry(.1,.03,6,10),m),s=new THREE.Mesh(new THREE.BoxGeometry(.04,.28,.04),m);r.position.y=.12;s.position.y=-.1;b.add(r,s)}
 else if(k==='can'||k==='fuel')b=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.2,8),m);
 else b=new THREE.Mesh(new THREE.BoxGeometry(.2,.2,.2),m);
 g.add(b,glow(it.c,k==='relic'?2.4:1.3));return g}
function spotIn(room,r){const[a,b,c,d]=ROOMS[room];for(let i=0;i<40;i++){const x=a+.8+r()*(c-a-1.6),z=b+.8+r()*(d-b-1.6);if(!cols.some(q=>q.on&&x>q.x1-.5&&x<q.x2+.5&&z>q.z1-.5&&z<q.z2+.5))return[x,z]}return[(a+c)/2,(b+d)/2]}
function mkTrap(id,x,z,own){const g=new THREE.Group();g.add(new THREE.Mesh(new THREE.CylinderGeometry(.35,.35,.04,10),mat(0x3a2a22)));
 [-1,1].forEach(s=>{const j=new THREE.Mesh(new THREE.BoxGeometry(.5,.12,.03),mat(0x7a3a30));j.position.set(0,.07,s*.15);j.rotation.x=s*.5;g.add(j)});g.position.set(x,.03,z);scene.add(g);traps[id]={id,x,z,on:1,own,m:g}}
function closeTrap(id){const t=traps[id];if(!t||!t.on)return;t.on=0;t.m.children.forEach((c,i)=>{if(i)c.rotation.x=0});t.m.scale.y=.3;alertAt(t.x,t.z,22)}
function buildItems(seed){const r=mul(seed);items.forEach(i=>scene.remove(i.m));items=[];Object.values(traps).forEach(t=>scene.remove(t.m));traps={};
 const push=(k,room)=>{const[x,z]=spotIn(room,r),m=itemMesh(k);m.position.set(x,1,z);scene.add(m);items.push({id:items.length,k,x,z,m,on:1})};
 push('ckey','bed');push('bkey','kitchen');['office','living','attic','attic','base','base'].forEach(rm=>push('relic',rm));push('fuel','well');push('fuse','shed');['kitchen','bed','office','living','attic','base','garden','yard'].forEach(rm=>push('note',rm));
 const nm=['kitchen','living','bath','bed','foyer','office','hall','attic','base','yard','garden'],any=()=>nm[r()*nm.length|0];
 for(let i=0;i<9;i++)push('bat',any());for(let i=0;i<5;i++)push('med',any());
 for(let i=0;i<4;i++)push('trap',any());for(let i=0;i<5;i++)push('can',any());for(let i=0;i<12;i++)push('coin',any());
 ['hall','foyer','office','living','kitchen','attic','base','attic','base','yard','yard','garden','yard','yard'].forEach((rm,i)=>{const[x,z]=spotIn(rm,r);mkTrap(i,x,z,0)})}
function take(id,mine){const it=items[id];if(!it||!it.on)return;it.on=0;scene.remove(it.m);const k=it.k;
 if(k==='ckey'){G.keys.c=1;say('Chordoq kaliti topildi')}else if(k==='bkey'){G.keys.b=1;say('Podval kaliti topildi')}
 else if(k==='relic'){G.relics++;say(LORE[G.relics-1],6500);tone(300,900,1,.3);whisper();if(G.relics>=DF[G.di].need)setTimeout(()=>say("Hamma muhr yig'ildi! Ularni chordoqdagi QURBONGOHga olib bor (E).",6000),6800);else if(G.relics===3)En.bonus+=.25}
 else if(k==='fuel'){G.fuel=1;say('Benzin topildi. Generator omborxonada.')}else if(k==='fuse'){G.fuse=1;say('Saqlagich topildi!')}
 else if(k==='note'){G.notes++;say(LORE2[(G.notes-1)%LORE2.length],7500);tone(400,500,.3,.15)}
 else if(mine){const mx=DF[G.di].hp;switch(k){case'bat':bat=Math.min(1,bat+.45);say('Batareya +45%');break;case'med':P.hp=Math.min(mx,P.hp+40);say('Dori: +40 HP');break;
  case'trap':inv.trap++;say("Tuzoq olindi (T bilan qo'y)");break;
  case'can':P.hp=Math.min(mx,P.hp+12);P.st=100;say('Konserva: +12 HP');break;case'coin':inv.coins++;say('Eski tanga ('+inv.coins+')')}tone(500,800,.25,.2)}
 updObj()}
function openExit(){if(G.open)return;G.open=1;exitC.on=0;exitM.visible=false;EH[14][9]=0;const s=glow(0x66ff88,6);s.position.set(14.25,1.5,20.6);scene.add(s);slam();En.bonus+=.4;En.st='search';gset(P.x,P.z);updObj()}
function updObj(){const n=DF[G.di].need;let o;
 if(G.gate)o='Janubiy darvozaga yugur!';else if(G.gen)o='Darvoza ochilmoqda...';
 else if(G.ritual)o=`Hovli: benzin ${G.fuel?'✓':'?'} + saqlagich ${G.fuse?'✓':'?'} top, generatorni (omborxona) yoq`;
 else if(G.relics>=n)o="Muhrlarni chordoqdagi qurbongohga qo'y (E)";else if((G.keys.c&&G.keys.b)||G.relics)o=`Muhrlarni top: ${G.relics}/${n}`;else o='Kalitlarni top: chordoq va podval qulflangan';
 $('obj').textContent=o;$('inv').textContent=`🗝 ${G.keys.c?'Ch':'-'}${G.keys.b?'Po':'-'} 💎${G.relics}/${n} 📜${G.notes}/8 🪤${inv.trap} 🪙${inv.coins}`}
const ST=[{x:26.2,z:10.5,tx:49.5,tz:9.75,n:'Chordoqqa chiqish',need:'c'},{x:47.25,z:9.75,tx:24.5,tz:10.5,n:'Pastga tushish'},{x:1,z:10.5,tx:49.5,tz:33.75,n:'Podvalga tushish',need:'b'},{x:47.25,z:33.75,tx:2.2,tz:10.5,n:'Yuqoriga chiqish'}];
const nearStair=()=>ST.find(s=>Math.hypot(P.x-s.x,P.z-s.z)<2.4&&zoneOf(P.x,P.z)===zoneOf(s.x,s.z));
function useStair(s){if(s.need&&!G.keys[s.need]){say('Qulflangan. '+(s.need==='c'?'Chordoq':'Podval')+' kaliti kerak.');slam();return}
 $('fade').style.opacity=1;setTimeout(()=>{P.x=s.tx;P.z=s.tz;P.zone=zoneOf(s.tx,s.tz);$('fade').style.opacity=0;nz(.4,.4,300,2)},350)}
function doRitual(){if(G.ritual)return;G.ritual=1;lightOut=3;flashT=.5;thunder();slam();say("Muhrlar qurbongohga qo'yildi... Pastda old eshik qulfi ochildi!",6500);En.stun=Math.max(En.stun,8);openExit();tone(80,300,2,.3,'sawtooth');updObj()}
function ritual(){if(G.relics<DF[G.di].need){say('Muhrlar yetmaydi: '+G.relics+'/'+DF[G.di].need);return}doRitual()}
function doGen(){if(G.gen)return;G.gen=1;nz(1.2,.6,120,1);tone(60,120,2,.4,'sawtooth');lightOut=1.5;say('GENERATOR ISHLADI! Janubiy darvoza ochilmoqda... YUGUR!',6000);
 let n=0;const iv=setInterval(()=>{tone(700,500,.4,.15,'square');if(++n>45)clearInterval(iv)},700);
 setTimeout(()=>{G.gate=1;gateM.visible=false;gateC.on=0;EH[28][22]=EH[28][23]=0;const g2=glow(0x66ff88,7);g2.position.set(34.5,1.5,41);scene.add(g2);slam();say('DARVOZA OCHILDI!',4000);updObj()},4000);
 En.bonus+=.5;En.st='chase';En.lost=0;En.tgt={x:P.x,z:P.z};gset(P.x,P.z);updObj()}
function genStart(){if(!(G.fuel&&G.fuse)){say('Generator uchun benzin va saqlagich kerak.');return}doGen()}
function nearInt(){const s=nearStair();if(s)return{n:s.n+(s.need&&!G.keys[s.need]?' (qulflangan)':''),act:()=>useStair(s)};
 if(P.zone===1&&!G.ritual&&Math.hypot(P.x-69.5,P.z-4.5)<2.6)return{n:G.relics>=DF[G.di].need?"Muhrlarni qurbongohga qo'yish":'Qurbongoh (muhrlar yetmaydi)',act:ritual};
 if(P.zone===3&&G.open&&!G.gen&&Math.hypot(P.x-41.8,P.z-4.4)<2.6)return{n:G.fuel&&G.fuse?'Generatorni yoqish':'Generator (benzin + saqlagich kerak)',act:genStart};return null}
function useE(){if(P.dead||state!=='play')return;const o=nearInt();if(!o){say("Bu yerda ishlatadigan narsa yo'q");return}o.act()}
/* ---------- SURVIVAL: qurol va otish mexanikasi kiritilmagan ---------- */

/* ---------- YUPQA (maxluq) ---------- */
const MON=new THREE.Group(),skin=new THREE.MeshLambertMaterial({color:0xd6d0c0,emissive:0x24211c}),blk=new THREE.MeshBasicMaterial({color:0x000000});
const mpart=(g,m,x,y,z)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);MON.add(o);return o};
mpart(new THREE.BoxGeometry(.34,1.15,.2),skin,0,1.9,0);mpart(new THREE.BoxGeometry(.3,.3,.18),skin,0,1.25,0);
[-.11,.11].forEach(x=>mpart(new THREE.BoxGeometry(.11,1.25,.11),skin,x,.62,0));
const arms=[-1,1].map(s=>{const g=new THREE.Group();g.position.set(s*.26,2.4,0);const a=new THREE.Mesh(new THREE.BoxGeometry(.08,2,.08),skin);a.position.y=-1;g.add(a);MON.add(g);return g});
const headG=new THREE.Group();headG.position.set(0,2.5,0);const hd=new THREE.Mesh(new THREE.SphereGeometry(.2,12,10),skin);hd.scale.set(.85,1.6,.9);hd.position.y=.3;headG.add(hd);
[-.07,.07].forEach(x=>{const e=new THREE.Mesh(new THREE.SphereGeometry(.045,8,8),blk);e.scale.y=2;e.position.set(x,.38,.15);headG.add(e)});
const mouth=new THREE.Mesh(new THREE.PlaneGeometry(.17,.035),new THREE.MeshBasicMaterial({color:0xff2200}));mouth.position.set(0,.22,.185);headG.add(mouth);MON.add(headG);
const eL=new THREE.PointLight(0xff2a10,.7,7,2);eL.position.set(0,2.7,.5);MON.add(eL);MON.traverse(o=>{if(o.isMesh)o.castShadow=true});scene.add(MON);
const En={x:66,z:33,st:'patrol',gx:0,gz:0,D:null,t:0,lost:0,wait:0,tgt:null,stun:0,atk:0,stepA:0,obs:0,bonus:0,zone:2,ry:0,tx:66,tz:33,jt:0};
function gset(x,z){En.gx=clamp(Math.floor(x/CS),0,GW-1);En.gz=clamp(Math.floor(z/CS),0,GH-1);if(!WALK[En.gz*GW+En.gx]){const c=WALKC[R0()*WALKC.length|0];En.gx=c%GW;En.gz=(c/GW)|0}En.D=bfs(En.gx,En.gz)}
function patrolGoal(){const c=WALKC[R0()*WALKC.length|0];gset((c%GW+.5)*CS,((c/GW|0)+.5)*CS)}
function alertAt(x,z,r){if(En.st!=='chase'&&En.zone===zoneOf(x,z)&&Math.hypot(En.x-x,En.z-z)<r){En.st='search';En.wait=0;gset(x,z)}}
const targets=()=>P.dead?[]:[{me:1,x:P.x,z:P.z,zone:P.zone,run:P.run,mv:P.mv,fl:P.on&&bat>0}];
function viewObs(){const dx=En.x-P.x,dz=En.z-P.z,d=Math.hypot(dx,dz);if(d>22||En.zone!==P.zone||P.dead)return 0;return(dx*-Math.sin(P.yaw)+dz*-Math.cos(P.yaw))/(d||1)>.5&&los(P.x,P.z,En.x,En.z)?1:0}
const sting=()=>{tone(622,330,1.3,.35,'sawtooth');tone(659,350,1.3,.3,'sawtooth');nz(.5,.3,2000,2);whisper();say("U SENI KO'RDI!")};
function enemyThink(dt){const df=DF[G.di];En.atk-=dt;En.stun=Math.max(0,En.stun-dt);En.zone=zoneOf(En.x,En.z);
 for(const id in traps){const t=traps[id];if(t.on&&t.own&&zoneOf(t.x,t.z)===En.zone&&Math.hypot(En.x-t.x,En.z-t.z)<.7){closeTrap(id);En.stun=5;nz(.3,.8,200,1)}}
 let best=null,bd=1e9,vis=null,vd=1e9;
 for(const t of targets()){if(t.zone!==En.zone)continue;const d=Math.hypot(t.x-En.x,t.z-En.z);if(d<bd){bd=d;best=t}
  if(d<df.vis+(t.fl?5:0)&&d<vd&&los(En.x,En.z,t.x,t.z)){vis=t;vd=d}
  if(En.st==='patrol'&&d<(t.run?14:t.mv?5:1.5)*df.hear){En.st='search';En.wait=0;gset(t.x,t.z)}}
 if(En.st!=='chase'&&vis){En.st='chase';En.tgt=vis;En.lost=0;sting()}
 if(En.st==='chase'){if(vis){En.lost=0;En.tgt=vis}else En.lost+=dt;
  if(En.lost>4||!En.tgt){En.st='search';En.wait=0;gset(En.tgt?En.tgt.x:En.x,En.tgt?En.tgt.z:En.z)}else{En.t-=dt;if(En.t<=0){En.t=.3;gset(En.tgt.x,En.tgt.z)}}}
 const cx=Math.floor(En.x/CS),cz=Math.floor(En.z/CS),atG=cx===En.gx&&cz===En.gz;
 if(En.st!=='chase'&&atG){if(En.st==='search'){En.wait+=dt;if(En.wait>3){En.wait=0;En.st='patrol';patrolGoal()}}else patrolGoal()}
 let sp=(En.st==='chase'?3.4:En.st==='search'?2.5:1.7)*df.sp*(En.zone===3?1.15:1)+En.bonus;if(En.obs)sp*=.28;if(En.stun>0||(En.st==='search'&&atG&&En.wait>0))sp=0;
 let tx=(cx+.5)*CS,tz=(cz+.5)*CS;
 if(atG){if(En.st==='chase'&&En.tgt){tx=En.tgt.x;tz=En.tgt.z}}
 else{const cur2=En.D[cz*GW+cx];let bn=-1;if(cur2>0)nb(cx,cz,n=>{if(En.D[n]>=0&&En.D[n]<cur2&&(bn<0||En.D[n]<En.D[bn]))bn=n});
  if(bn<0){if(cur2<0)patrolGoal()}else{const nx=bn%GW,nzz=(bn/GW)|0;if(Math.abs(nx-cx)+Math.abs(nzz-cz)>1){En.x=(nx+.5)*CS;En.z=(nzz+.5)*CS;tx=En.x;tz=En.z}else{tx=(nx+.5)*CS;tz=(nzz+.5)*CS}}}
 const dx=tx-En.x,dz=tz-En.z,dd=Math.hypot(dx,dz);
 if(dd>.02&&sp>0){const s=Math.min(dd,sp*dt);En.x+=dx/dd*s;En.z+=dz/dd*s;En.ry=Math.atan2(dx,dz);En.stepA+=s;if(En.stepA>1.6){En.stepA=0;if(P.zone===En.zone)tone(80,40,.12,Math.max(0,.45*(1-bd/24)))}}
 if(best&&bd<1.4&&En.atk<=0&&En.stun<=0&&los(En.x,En.z,best.x,best.z)){En.atk=1.8;hurt(df.dmg)}}
function animMon(dt){
 MON.position.set(En.x,0,En.z);MON.rotation.y=En.ry;En.jt-=dt;const ch=En.st==='chase';
 if(En.obs||En.stun>0){if(En.jt<=0){En.jt=.09;arms.forEach(a=>a.rotation.x=(R0()-.5)*.9);headG.rotation.z=(R0()-.5)*.9;headG.rotation.x=R0()*.5;MON.position.x+=(R0()-.5)*.04}}
 else{const f=G.time*(ch?9:3);arms.forEach((a,i)=>a.rotation.x=Math.sin(f+i*Math.PI)*(ch?1:.4));headG.rotation.z=Math.sin(G.time*1.3)*.15;headG.rotation.x=.25}
 eL.intensity=En.stun>0?.1:.7+Math.sin(G.time*20)*.2*ch}

/* ---------- o'yinchi ---------- */
function hurt(n){if(P.dead)return;P.hp-=n;shake=.5;$('red').style.opacity=1;nz(.2,.5,200,1);tone(120,50,.2,.5,'square');if(P.hp<=0)die()}
function die(){P.dead=1;state='dead';deadT=0;if(document.exitPointerLock)document.exitPointerLock();tone(900,110,1.1,.5,'sawtooth');nz(.7,.9,1000,.6)}
function winGame(){if(state!=='play')return;state='win';if(document.exitPointerLock)document.exitPointerLock();
 $('hud').classList.add('h');$('win').classList.remove('h');$('wt').textContent='Vaqt: '+fmt(G.time)+' · '+DF[G.di].n;$('nm').value=pf.nick;tone(220,440,1.5,.25)}
const fmt=t=>Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0'),esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
function loadTop(){let a=[];try{a=JSON.parse(localStorage.getItem('qm2_scores')||'[]')}catch(e){};$('top').innerHTML=a.length?'<b>Ushbu qurilmadagi natijalar</b><br>'+a.slice(0,6).map((s,i)=>`${i+1}. ${esc(s.name)} ${fmt(s.time)} <small>${esc((DF[s.d]||DF[2]).n.split(' ')[0])}</small>`).join('<br>'):''}
$('sv').onclick=()=>{const entry={name:($('nm').value.trim()||'Oyinchi').slice(0,16),time:Math.round(G.time),d:G.di};let a=[];try{a=JSON.parse(localStorage.getItem('qm2_scores')||'[]')}catch(e){};a.push(entry);a.sort((x,y)=>x.time-y.time);a=a.slice(0,30);try{localStorage.setItem('qm2_scores',JSON.stringify(a));$('sv').textContent='Saqlandi';$('sv').disabled=true;loadTop()}catch(e){$('sv').textContent='Saqlab bo‘lmadi'}};

function update(dt){
 G.time+=dt;const df=DF[G.di];
 let fx=(K.KeyD?1:0)-(K.KeyA?1:0)+J.x,fz=(K.KeyS?1:0)-(K.KeyW?1:0)+J.y;const len=Math.hypot(fx,fz);if(len>1){fx/=len;fz/=len}
 P.snare=Math.max(0,P.snare-dt);P.mv=len>.1&&P.snare<=0?1:0;P.run=P.mv&&(K.ShiftLeft||K.ShiftRight||sprintT)&&!P.tired?1:0;
 if(P.run){P.st-=24*dt;if(P.st<=0){P.st=0;P.tired=1;say('Nafasing yetmayapti...')}}else{P.st=Math.min(100,P.st+14*dt);if(P.st>30)P.tired=0}
 const sp=P.snare>0?0:P.run?5.2:2.8,sn=Math.sin(P.yaw),cs=Math.cos(P.yaw);
 const[nx,nz2]=collide(P.x+(fx*cs+fz*sn)*sp*dt,P.z+(-fx*sn+fz*cs)*sp*dt,.32);P.x=nx;P.z=nz2;P.zone=zoneOf(P.x,P.z);
 if(P.mv){bob+=sp*dt*2.3;stepA+=sp*dt;if(stepA>1.7){stepA=0;nz(.08,P.run?.4:.2,P.run?320:190,1)}}
 // dushman
 En.obs=viewObs()?1:0;enemyThink(dt);animMon(dt);
 dMon=P.zone===En.zone?Math.hypot(P.x-En.x,P.z-En.z):99;const dng=clamp(1-dMon/20,0,1)*(En.st==='chase'?1:.7);
 // tuzoqlar
 for(const id in traps){const t=traps[id];if(t.on&&P.snare<=0&&zoneOf(t.x,t.z)===P.zone&&Math.hypot(P.x-t.x,P.z-t.z)<.55){closeTrap(id);P.snare=2.5;hurt(df.dmg>=55?30:20);slam();say('TUZOQ!');alertAt(t.x,t.z,22)}}
 // buyumlar
 for(const it of items){if(!it.on)continue;it.m.rotation.y+=dt*1.6;it.m.position.y=1+Math.sin(G.time*2+it.x)*.1;if(Math.hypot(it.x-P.x,it.z-P.z)<1.3&&zoneOf(it.x,it.z)===P.zone)take(it.id,true)}
 if(G.gate&&P.z>42.5)winGame();
 // chiroq
 if(P.on&&bat>0)bat=Math.max(0,bat-dt/200*df.dr);
 let I=P.on&&bat>0?6:0;if(I&&bat<.2&&R0()<.15)I*=.2;if(I&&dMon<9&&R0()<.05+(En.obs?.05:0))I*=.1;lightOut=Math.max(0,lightOut-dt);if(lightOut>0)I=0;
 FL.intensity=I;PL.intensity=I?.4:.03;
 // kamera
 const dk=En.st==='chase'?1:.4;shake=Math.max(0,shake-dt*1.5);const sh=shake*.04+(dMon<10&&En.st==='chase'?(1-dMon/10)*.02:0);
 cam.position.set(P.x+(R0()-.5)*sh,1.6+Math.sin(bob)*.045+(R0()-.5)*sh,P.z);cam.rotation.set(P.pitch,P.yaw,Math.sin(G.time*.8)*.012*dng*dk+(R0()-.5)*sh);
 fovK=lerp(fovK,(P.run?5:0)+dng*dk*7,dt*5);cam.fov=pf.fov+fovK;cam.updateProjectionMatrix();
 // atmosfera
 hb-=dt;if(dng>.15&&hb<=0){heart(.1+dng*.5);hb=1.15-dng*.8}if(rumG)rumG.gain.value=dng*.2;
 amb-=dt;if(amb<0){amb=7+R0()*12;if(R0()<.5)nz(1.6,.12,150+R0()*500,6);else{nz(.12,.5,250,3);setTimeout(()=>nz(.12,.4,250,3),230)}}
 flT-=dt;if(flT<0){flT=25+R0()*30;flashT=.5;setTimeout(thunder,500+R0()*1500)}
 if(flashT>0){flashT-=dt;const f=flashT>.35?.9:flashT>.25?.1:flashT>.15?.7:0;$('flash').style.opacity=(P.zone===0||P.zone===3)?f*.5:0;winMats.forEach(m=>m.color.setHex(f>.3?0xb4c8ff:0x070b14))}
 evT-=dt;if(evT<0){evT=35+R0()*35;const r=R0();if(r<.3)whisper();else if(r<.55){slam();say('Biror eshik qarsillab yopildi...')}else if(r<.8){lightOut=1.3;nz(.3,.3,300,2)}else tvBurst=4}
 tvBurst=Math.max(0,tvBurst-dt);if(tvG)tvG.gain.value=(P.zone===0?clamp(1-Math.hypot(P.x-12.75,P.z-1)/16,0,1)*.06:0)+(tvBurst>0&&P.zone===0?.12:0);
 tvTm-=dt;if(tvTm<0&&P.zone===0&&Math.hypot(P.x-12.75,P.z-1)<20){tvTm=.1;const im=tvX.createImageData(48,32);for(let i=0;i<im.data.length;i+=4){const v=R0()*(tvBurst>0?255:120)|0;im.data[i]=v*.8;im.data[i+1]=v*.9;im.data[i+2]=v;im.data[i+3]=255}tvX.putImageData(im,0,0);tvT.needsUpdate=true}
 if(rainG)rainG.gain.value=P.zone===3?.07:.012;altL.intensity=.7+R0()*.5;tvL.intensity=.8+R0()*.6;fireL.intensity=.6+R0()*.5;bathL.intensity=R0()<.04?0:.7;atL.intensity=R0()<.03?.1:.7;baL.intensity=.7+Math.sin(G.time*7)*.15;
 const dd=dp;for(let i=0;i<DN;i++){const o=i*3;dd[o]+=Math.sin(G.time+i)*.002;dd[o+1]-=.003;if(dd[o+1]<0)dd[o+1]+=3;for(let a=0;a<3;a+=2){const c=a?P.z:P.x;if(dd[o+a]-c>6)dd[o+a]-=12;else if(dd[o+a]-c<-6)dd[o+a]+=12}}dg.attributes.position.needsUpdate=true;
 // HUD
 uiT-=dt;if(uiT<0){uiT=.05;$('hp').style.width=clamp(P.hp/df.hp*100,0,100)+'%';$('b').style.width=bat*100+'%';$('s').style.width=P.st+'%';$('tm').textContent=fmt(G.time);
  const s=nearInt();$('prompt').textContent=s?(TOUCH?'E tugmasi: ':'[E] ')+s.n:'';$('t-use').classList.toggle('hot',!!s);
  $('red').style.opacity=Math.max(parseFloat($('red').style.opacity||0)-.08,En.st==='chase'?.2+Math.sin(G.time*8)*.08:dng*.2)}
}

/* ================= YAKKA O'YIN REJIMI ================= */
/* ================= O'YINNI BOSHLASH ================= */
function story(a,i){i=i||0;if(i>=a.length)return;say(a[i],5200);setTimeout(()=>story(a,i+1),5600)}
function placeTrap(){if(inv.trap<=0||P.dead)return;inv.trap--;const id=1000+(trapN++),x=P.x-Math.sin(P.yaw)*1,z=P.z-Math.cos(P.yaw)*1;mkTrap(id,x,z,1);updObj();say("Tuzoq qo'yildi")}
function startGame(seed,di){G.di=di;G.keys={c:0,b:0};G.relics=0;G.open=0;G.ritual=0;G.fuel=0;G.fuse=0;G.gen=0;G.gate=0;G.notes=0;G.time=0;inv.trap=0;inv.coins=0;buildItems(seed);const df=DF[di];
 Object.assign(P,{hp:df.hp,x:13.5,z:18.5,yaw:0,pitch:0,st:100,tired:0,dead:0,snare:0,on:1});bat=1;
 Object.assign(En,{x:66,z:33,tx:66,tz:33,st:'patrol',stun:0,bonus:0,atk:2,zone:2,tgt:null,lost:0,wait:0});patrolGoal();
 ['mm','solo','opt'].forEach(x=>$(x).classList.add('h'));$('hud').classList.remove('h');state='play';applyGfx();updObj();
 story(INTRO);if(AC)AC.resume();if(!TOUCH)cv.requestPointerLock();$('lockhint').classList.toggle('h',locked)}
function deadUpdate(dt){deadT+=dt;const ty=Math.atan2(-(En.x-P.x),-(En.z-P.z));let dy=ty-P.yaw;dy=Math.atan2(Math.sin(dy),Math.cos(dy));P.yaw+=dy*Math.min(1,dt*8);
 cam.position.set(P.x+(R0()-.5)*.06,lerp(cam.position.y,.7,dt*3),P.z);cam.rotation.set(.5,P.yaw,(R0()-.5)*.08);FL.intensity=R0()<.5?6:0;animMon(dt);
 $('red').style.opacity=.7;if(deadT>2.2)$('over').classList.remove('h')}

/* ================= KIRISH / MENYU ================= */
addEventListener('keydown',e=>{K[e.code]=1;if(state!=='play')return;
 if(e.code==='KeyF'){P.on=!P.on;nz(.05,.3,2500,3)}else if(e.code==='KeyE')useE();else if(e.code==='KeyT')placeTrap();
 if(e.code==='Space')e.preventDefault()});
addEventListener('keyup',e=>K[e.code]=0);
document.addEventListener('mousemove',e=>{if(locked){P.yaw-=e.movementX*.0022*pf.sens;P.pitch=clamp(P.pitch-e.movementY*.0022*pf.sens,-1.35,1.35)}});
cv.addEventListener('click',()=>{if(state==='play'&&!locked)cv.requestPointerLock()});
document.addEventListener('pointerlockchange',()=>{if(TOUCH)return;locked=document.pointerLockElement===cv;$('lockhint').classList.toggle('h',!(state==='play'&&!locked))});
const show=id=>['mm','solo','opt'].forEach(x=>$(x).classList.toggle('h',x!==id));
document.querySelectorAll('[data-back]').forEach(b=>b.onclick=()=>{show('mm');savePf()});
const kick=()=>{A();if(AC)AC.resume();if(TOUCH)try{const el=document.documentElement,f=el.requestFullscreen||el.webkitRequestFullscreen;if(f)Promise.resolve(f.call(el)).then(()=>screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape')).catch(()=>{})}catch(e){}};
$('b-solo').onclick=()=>{kick();show('solo')};$('b-opt').onclick=()=>{kick();show('opt')};
let selD=2;
function mkDiff(el){DF.forEach((d,i)=>{const b=document.createElement('button');b.className='vb'+(i===selD?' on':'');b.textContent=d.n;b.onclick=()=>{selD=i;document.querySelectorAll('#dl .vb,#dl2 .vb').forEach(c=>c.classList.toggle('on',c.textContent===d.n))};el.appendChild(b)})}
mkDiff($('dl'));
$('go1').onclick=()=>{kick();startGame((R0()*2147483647)|0,selD)};
$('o-nick').value=pf.nick;$('o-sens').value=pf.sens;$('o-fov').value=pf.fov;$('o-vol').value=pf.vol;
GFX.forEach((q,i)=>{const o=document.createElement('option');o.value=i;o.textContent=q.n;$('o-gfx').appendChild(o)});$('o-gfx').value=pf.gfx;
$('o-nick').oninput=e=>{pf.nick=e.target.value.slice(0,16)||'Oyinchi'};$('o-sens').oninput=e=>pf.sens=+e.target.value;
$('o-fov').oninput=e=>{pf.fov=+e.target.value;applyGfx()};$('o-vol').oninput=e=>{pf.vol=+e.target.value;if(mg)mg.gain.value=pf.vol};
$('o-gfx').onchange=e=>{pf.gfx=+e.target.value;applyGfx()};
(()=>{const c=document.createElement('canvas');c.width=c.height=96;const x=c.getContext('2d'),im=x.createImageData(96,96);for(let i=0;i<im.data.length;i+=4){const v=R0()*255;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255}x.putImageData(im,0,0);$('grain').style.backgroundImage=`url(${c.toDataURL()})`})();

/* ================= SENSORLI BOSHQARUV (telefon) ================= */
const J={x:0,y:0};let joy=null,lk=null,sprintT=false;
if(TOUCH){locked=true;document.body.classList.add('touch');
 const jb=$('jb'),jk=$('jk'),cl=(v)=>clamp(v,-1,1);
 cv.addEventListener('touchstart',e=>{e.preventDefault();for(const t of e.changedTouches){
  if(t.clientX<innerWidth*.45){if(!joy){joy={id:t.identifier,x:t.clientX,y:t.clientY};jb.style.cssText=`display:block;left:${t.clientX-55}px;top:${t.clientY-55}px`;jk.style.cssText=`display:block;left:${t.clientX-22}px;top:${t.clientY-22}px`}}
  else if(!lk)lk={id:t.identifier,x:t.clientX,y:t.clientY}}},{passive:false});
 cv.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches){
  if(joy&&t.identifier===joy.id){const dx=t.clientX-joy.x,dy=t.clientY-joy.y,d=Math.hypot(dx,dy)||1,k=Math.min(1,d/55);J.x=cl(dx/d*k);J.y=cl(dy/d*k);jk.style.left=(joy.x+dx/d*Math.min(d,55)-22)+'px';jk.style.top=(joy.y+dy/d*Math.min(d,55)-22)+'px'}
  else if(lk&&t.identifier===lk.id){P.yaw-=(t.clientX-lk.x)*.005*pf.sens;P.pitch=clamp(P.pitch-(t.clientY-lk.y)*.005*pf.sens,-1.35,1.35);lk.x=t.clientX;lk.y=t.clientY}}},{passive:false});
 const te=e=>{for(const t of e.changedTouches){if(joy&&t.identifier===joy.id){joy=null;J.x=J.y=0;jb.style.display=jk.style.display='none'}if(lk&&t.identifier===lk.id)lk=null}};
 cv.addEventListener('touchend',te);cv.addEventListener('touchcancel',te);
 const hold=(id,on,off)=>{const b=$(id);b.addEventListener('touchstart',e=>{e.preventDefault();on()},{passive:false});['touchend','touchcancel'].forEach(n=>b.addEventListener(n,e=>{e.preventDefault();if(off)off()}))};
 hold('t-run',()=>sprintT=true,()=>sprintT=false);
 hold('t-use',useE);hold('t-lt',()=>{P.on=!P.on;nz(.05,.3,2500,3)});hold('t-tr',placeTrap)}

/* ================= SIKL ================= */
let last=performance.now();
function loop(now){requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;
 if(state==='play'){if(locked)update(dt)}
 else if(state==='dead')deadUpdate(dt);
 else if(state==='menu'){G.time+=dt;cam.position.set(13.5,1.7,19);cam.rotation.set(0,Math.sin(G.time*.12)*1.1,0);FL.intensity=3;tvL.intensity=.8+R0()*.6;fireL.intensity=.6+R0()*.5}
 RD.render(scene,cam)}
applyGfx();loadTop();show('mm');requestAnimationFrame(loop);
