// Original educational 3D geometry. Coordinates are deliberately schematic.
const ATLAS_LAYERS=[['body','Кузов','#637f8b'],['motor','Двигатель','#a6b9c2'],['drive','Трансмиссия','#9b85d6'],['fuel','Топливо','#eab568'],['brake','Тормоза','#ef777c'],['wire','Проводка','#79a9ff'],['cool','Охлаждение','#71d8be']];
let atlasState=null;
function atlasGeometry(which,variant){
 const n=which==='niva',parts=[];
 const box=(id,name,layer,center,size,color)=>parts.push({id,name,layer,center,size,color,type:'box'});
 const tube=(id,name,layer,points,color,width=5)=>parts.push({id,name,layer,points,color,width,type:'tube'});
 const wheel=(x,y)=>parts.push({id:'wheel',name:'Колесо и ступица',layer:'drive',center:[x,y,.47],radius:.48,width:.28,color:'#303a40',type:'wheel'});
 // Model-specific silhouettes: Niva wagon, Datsun sedan.
 parts.push({id:null,name:n?'Кузов Нивы':'Кузов Datsun',layer:'body',type:'prism',width:1.73,color:n?'#587b67':'#5b7589',profile:n?[[-2.1,.62],[-2.1,1.07],[-1.35,1.15],[-.85,1.75],[1.47,1.75],[2.00,1.12],[2.05,.62]]:[[-2.15,.55],[-2.12,.95],[-1.27,1.12],[-.65,1.65],[.56,1.65],[1.25,1.05],[2.13,.99],[2.13,.55]]});
 box(null,'Пол кузова','body',[0,0,.66],[1.62,3.7,.13],'#5e7883');
 for(const x of [-.93,.93])for(const y of [-1.31,1.31])wheel(x,y);
 box('engine-head','Блок двигателя','motor',n?[0,-1.25,.93]:[.13,-1.25,.92],n?[.68,.93,.66]:[1.03,.59,.67],'#899da6');
 box('engine-head','Крышка ГБЦ','motor',n?[0,-1.25,1.32]:[.13,-1.25,1.31],n?[.58,.85,.15]:[.94,.47,.15],'#bac9c8');
 box('engine-intake','Впуск','motor',[.48,-1.24,1.02],[.24,.62,.25],'#7f9ba0');
 box('oil','Поддон','motor',[0,-1.23,.52],[.55,.67,.15],'#586a72');
 box('battery','Аккумулятор','wire',[-.62,-1.66,1.06],[.38,.44,.3],'#587cc0');
 box('radiator','Радиатор','cool',[0,-1.96,.92],[1.25,.15,.64],'#69b7aa');
 box('thermostat','Термостат','cool',[.45,-1.48,.88],[.19,.19,.19],'#8fc6b9');
 tube('line-coolant','Патрубки радиатора','cool',[[.45,-1.48,.88],[.62,-1.75,.94],[.35,-1.96,1.1]],'#71d8be',8);
 tube('line-coolant','Шланги отопителя','cool',[[.3,-1.02,1.1],[.4,-.7,1.13],[.36,-.55,1.18]],'#71d8be',6);
 box('fuel-tank-'+(n?'n':'d'),'Топливный бак','fuel',[0,1.02,.61],[1.18,.68,.26],'#bda268');
 if(!n||!variant.includes('карбюратор'))box('fuel-pump-el','Топливный модуль','fuel',[0,1.05,.8],[.29,.26,.12],'#f0bd70');
 box('fuel-filter','Топливный фильтр','fuel',n?[.53,-1.05,.84]:[.56,1.06,.48],[.19,.28,.15],'#e0ad61');
 const dst=n&&variant.includes('карбюратор')?'fuel-pump-carb':'fuel-rail';
 box(dst,n&&variant.includes('карбюратор')?'Механический насос':'Топливная рампа','fuel',[.35,-1.24,1.22],[.15,.57,.12],'#eab568');
 tube('fuel-lines','Подача топлива','fuel',[[.42,1.1,.59],[.71,.65,.48],[.71,-.63,.48],[.59,-1.15,.79],[.35,-1.24,1.22]],'#eab568',6);
 if(n)tube('fuel-lines','Обратка (если предусмотрена)','fuel',[[.32,-1.18,1.12],[-.55,-.78,.53],[-.65,.68,.5],[-.35,1.02,.65]],'#bd8f54',4);
 if(!n||!variant.includes('карбюратор')){
 box('fuel-evap','Адсорбер','fuel',n?[.63,-1.66,.83]:[-.55,.7,.51],[.24,.3,.31],'#ad986d');
 tube('fuel-evap','Паровая магистраль','fuel',[[-.38,1,.76],[-.67,.55,.5],[-.67,-.75,.5],[-.45,-1.1,1.12]],'#d3c68d',4);
 }
 box('brakefluid','Главный тормозной цилиндр','brake',[-.5,-.67,1.19],[.28,.30,.21],'#df8a86');
 for(const x of [-.74,.74])for(const y of [-1.31,1.31]){
  box('pads','Тормозной механизм','brake',[x,y,.49],[.09,.27,.3],'#ef777c');
  tube('line-brake','Тормозная магистраль','brake',[[-.5,-.67,1.19],[-.62,-.63,.56],[x,-.6,.46],[x,y,.49]],'#ef777c',4);
 }
 box('wiring-relay','Монтажный блок','wire',[-.49,-.48,1.09],[.3,.29,.17],'#6a95db');
 tube('wiring-engine','Моторный жгут','wire',[[-.62,-1.66,1.06],[-.65,-.65,1.05],[-.49,-.48,1.09],[.05,-.64,1.05],[.35,-1.24,1.22]],'#79a9ff',5);
 tube('wiring-body','Кузовный жгут','wire',[[-.49,-.48,1.09],[-.72,-.3,.72],[-.72,1.6,.72],[0,1.76,.87]],'#79a9ff',6);
 tube('wiring-ground','Масса двигателя','wire',[[-.62,-1.66,1.06],[-.4,-1.5,.78],[-.15,-1.27,.64]],'#8eb6d2',4);
 box('clutch','КПП и сцепление','drive',n?[0,-.45,.64]:[-.5,-1.2,.69],n?[.48,.64,.44]:[.46,.58,.44],'#9b85d6');
 if(n){
  box('niva-transfer','Раздатка','drive',[0,.13,.52],[.38,.43,.31],'#9b85d6');
  for(const y of [-1.31,1.31]){
    box('niva-axle','Редуктор моста','drive',[0,y,.48],[.4,.35,.32],'#8e80b9');
    tube('niva-axle','Полуоси','drive',[[-.76,y,.48],[.76,y,.48]],'#9b85d6',9);
    tube('niva-shaft','Кардан','drive',[[0,.13,.52],[0,y,.48]],'#c1acd9',9);
  }
 }else tube('datsun-cv','Приводы передних колёс','drive',[[-.76,-1.31,.48],[-.5,-1.2,.69],[.76,-1.31,.48]],'#9b85d6',9);
 return parts;
}
function atlasMesh(p,explode=0){
 let pts=[],faces=[];
 if(p.type==='box'){
  const [x,y,z]=p.center,[a,b,c]=p.size.map(v=>v/2);
  const zz=z+(p.layer==='motor'?explode*.35:0);
  pts=[[-a,-b,-c],[a,-b,-c],[a,b,-c],[-a,b,-c],[-a,-b,c],[a,-b,c],[a,b,c],[-a,b,c]].map(v=>[v[0]+x,v[1]+y,v[2]+zz]);
  faces=[[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]];
 }else if(p.type==='prism'){
  const n=p.profile.length;
  pts=[...p.profile.map(([y,z])=>[-p.width/2,y,z+explode]),...p.profile.map(([y,z])=>[p.width/2,y,z+explode])];
  faces=[Array.from({length:n},(_,i)=>i),Array.from({length:n},(_,i)=>n+i).reverse(),...Array.from({length:n},(_,i)=>[i,(i+1)%n,(i+1)%n+n,i+n])];
 }else if(p.type==='wheel'){
  const [x,y,z]=p.center,n=16;
  pts=[-1,1].flatMap(s=>Array.from({length:n},(_,i)=>[x+s*p.width/2,y+p.radius*Math.cos(i*2*Math.PI/n),z+p.radius*Math.sin(i*2*Math.PI/n)]));
  faces=[Array.from({length:n},(_,i)=>i),Array.from({length:n},(_,i)=>n+i).reverse(),...Array.from({length:n},(_,i)=>[i,(i+1)%n,(i+1)%n+n,i+n])];
 }
 return {pts,faces};
}
function atlasProject(v,s,w,h){
 const [x,y,z]=v,ca=Math.cos(s.yaw),sa=Math.sin(s.yaw),ce=Math.cos(s.pitch),se=Math.sin(s.pitch);
 const u=x*ca-y*sa,d=x*sa+y*ca,vertical=z-.8;
 const depth=d*ce-vertical*se;
 const k=Math.min(w/5.5,h/4.3)*s.zoom;
 return {x:w/2+u*k,y:h/2-(vertical*ce+d*se)*k,z:depth};
}
function atlasShade(hex,m){
 const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
 return 'rgb('+[r,g,b].map(v=>Math.round(Math.min(255,v*m))).join(',')+')';
}
function atlasDraw(){
 const s=atlasState,c=document.getElementById('atlasCanvas');if(!s||!c)return;
 const dpr=Math.min(window.devicePixelRatio||1,2),w=c.clientWidth||320,h=c.clientHeight||350;
 if(c.width!==Math.round(w*dpr)||c.height!==Math.round(h*dpr)){c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);}
 const ctx=c.getContext('2d');if(!ctx)return;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
 ctx.fillStyle='#111c22';ctx.fillRect(0,0,w,h);
 const project=v=>atlasProject(v,s,w,h);
 // Ground grid, schematic orientation.
 ctx.strokeStyle='#263b43';ctx.lineWidth=1;
 for(let i=-3;i<=3;i+=.5){for(const [a,b] of [[[i,-2.5,0],[i,2.5,0]],[[-3,i,0],[3,i,0]]]){const p=project(a),q=project(b);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}}
 const items=[];
 for(const p of s.parts){
  if(!s.layers[p.layer])continue;
  if(p.type==='tube'){
   for(let i=1;i<p.points.length;i++){const a=project(p.points[i-1]),b=project(p.points[i]);items.push({p,poly:[a,b],depth:(a.z+b.z)/2,tube:true});}continue;
  }
  const {pts,faces}=atlasMesh(p,s.explode);const pp=pts.map(project);
  faces.forEach((f,i)=>{const poly=f.map(j=>pp[j]);items.push({p,poly,depth:poly.reduce((a,b)=>a+b.z,0)/poly.length,shade:[.66,1.1,.9,.77,.94,.78][i%6]});});
 }
 items.sort((a,b)=>b.depth-a.depth);s.hits=[];
 for(const item of items){
  const {p,poly,tube}=item;ctx.beginPath();ctx.moveTo(poly[0].x,poly[0].y);poly.slice(1).forEach(v=>ctx.lineTo(v.x,v.y));
  const selected=s.selected&&s.selected.id===p.id;
  if(tube){ctx.strokeStyle=selected?'#fff5c6':p.color;ctx.lineWidth=selected?p.width+3:p.width;ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke();}
  else{ctx.closePath();ctx.globalAlpha=p.layer==='body'?.35:1;ctx.fillStyle=selected?'#fff5c6':atlasShade(p.color,item.shade);ctx.fill();ctx.strokeStyle=p.layer==='body'?'#a4bfc4':'#34454c';ctx.lineWidth=.7;ctx.stroke();ctx.globalAlpha=1;}
  if(p.id)s.hits.push(item);
 }
 const front=project([0,-2.5,.1]);ctx.fillStyle='#a9c9c5';ctx.font='11px sans-serif';ctx.fillText('ПЕРЕД',front.x-19,front.y+8);
}
function atlasInside(x,y,poly){
 let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j];if((a.y>y)!==(b.y>y)&&x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x)inside=!inside;
 }return inside;
}
function atlasDistance(x,y,a,b){
 const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy||1)));
 return Math.hypot(x-a.x-t*dx,y-a.y-t*dy);
}
function atlasPick(x,y){
 const s=atlasState;for(let i=s.hits.length-1;i>=0;i--){const h=s.hits[i];if(h.tube?atlasDistance(x,y,...h.poly)<Math.max(9,h.p.width):atlasInside(x,y,h.poly)){atlasSelect(h.p.id,h.p.name);return;}}
}
function atlasSelect(id,name){
 atlasState.selected={id,name};const info=$('atlasSelection'),a=DATA.find(x=>x.id===id);
 info.innerHTML='<strong>'+esc(name)+'</strong>'+(a?'<p>'+esc(a.loc)+'</p><button class="primary" onclick="openCard(\''+id+'\')">Открыть карточку</button>':'');atlasDraw();
}
function atlasSetLayer(k){
 atlasState.layers[k]=!atlasState.layers[k];atlasLayerUI();atlasDraw();
}
function atlasLayerUI(){
 $('atlasLayers').innerHTML=ATLAS_LAYERS.map(([k,n,c])=>'<button style="border-color:'+c+';font-size:13px" class="'+(atlasState.layers[k]?'active':'')+'" onclick="atlasSetLayer(\''+k+'\')">'+esc(n)+'</button>').join('');
}
function atlasPreset(view){
 const s=atlasState;
 if(view==='top'){s.yaw=0;s.pitch=Math.PI/2-.01;}
 else if(view==='bottom'){s.yaw=0;s.pitch=-Math.PI/2+.01;s.layers.body=false;}
 else if(view==='side'){s.yaw=Math.PI/2;s.pitch=0;}
 else{s.yaw=.66;s.pitch=.56;}
 atlasLayerUI();atlasDraw();
}
function atlasZoom(delta){atlasState.zoom=Math.max(.65,Math.min(2.6,atlasState.zoom*delta));atlasDraw();}
function atlasExplode(){atlasState.explode=atlasState.explode?0:.7;atlasState.layers.body=true;atlasLayerUI();atlasDraw();}
function showAtlas(){
 detail=null;tab='map';atlasState={parts:atlasGeometry(car,model),yaw:.66,pitch:.56,zoom:1,explode:0,selected:null,layers:{body:true,motor:true,drive:true,fuel:true,brake:true,wire:true,cool:true},hits:[]};
 $('main').innerHTML='<button onclick="mapPage()">← Назад</button><h2>Интерактивный 3D-атлас</h2><p class="badge">'+esc(names[car])+' • '+esc(model)+' • OFFLINE</p><canvas id="atlasCanvas" style="width:100%;height:360px;border-radius:14px;touch-action:none;display:block"></canvas><div class="row" style="margin:10px 0"><button onclick="atlasPreset(\'iso\')">3D</button><button onclick="atlasPreset(\'top\')">Сверху</button><button onclick="atlasPreset(\'bottom\')">Снизу</button><button onclick="atlasPreset(\'side\')">Сбоку</button><button onclick="atlasZoom(.82)">−</button><button onclick="atlasZoom(1.22)">+</button></div><div class="row" id="atlasLayers"></div><button class="card" onclick="atlasExplode()">Разнести кузов и двигатель</button><div class="card" id="atlasSelection">Нажмите на узел модели, чтобы посмотреть описание и расположение.</div><h3>Доступные узлы</h3><div id="atlasParts"></div><p class="warning">Учебная 3D-модель. Геометрия, точки крепления и траектории трубок и жгутов условные. Не используйте их как монтажный чертёж или точную прокладку для ремонта.</p><p class="muted">Вращайте пальцем, масштабируйте двумя пальцами или кнопками. Отключайте слои для просмотра внутренних узлов.</p>';
 atlasLayerUI();const seen=new Set();
 $('atlasParts').innerHTML=atlasState.parts.filter(p=>p.id&&!seen.has(p.id)&&seen.add(p.id)).map(p=>'<button class="card" onclick="atlasSelect(\''+p.id+'\',\''+esc(p.name)+'\')"><strong>'+esc(p.name)+'</strong><small>'+esc(ATLAS_LAYERS.find(l=>l[0]===p.layer)[1])+'</small></button>').join('');
 const c=$('atlasCanvas'),pointers=new Map();let moved=false;let lastDistance=0;
 c.addEventListener('pointerdown',e=>{c.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===1)moved=false;else{moved=true;const [a,b]=[...pointers.values()];lastDistance=Math.hypot(a.x-b.x,a.y-b.y);}});
 c.addEventListener('pointermove',e=>{const old=pointers.get(e.pointerId);if(!old)return;const dx=e.clientX-old.x,dy=e.clientY-old.y;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2){const [a,b]=[...pointers.values()],d=Math.hypot(a.x-b.x,a.y-b.y);if(lastDistance>0)atlasZoom(d/lastDistance);lastDistance=d;moved=true;}else if(pointers.size===1&&(moved||Math.hypot(dx,dy)>2)){moved=true;atlasState.yaw+=dx*.009;atlasState.pitch=Math.max(-1.56,Math.min(1.56,atlasState.pitch+dy*.009));atlasDraw();}});
 c.addEventListener('pointerup',e=>{pointers.delete(e.pointerId);if(!moved&&!pointers.size){const r=c.getBoundingClientRect();atlasPick(e.clientX-r.left,e.clientY-r.top);}if(!pointers.size)lastDistance=0;});
 c.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);moved=true;lastDistance=0;});
 c.addEventListener('wheel',e=>{e.preventDefault();atlasZoom(e.deltaY<0?1.1:.9);},{passive:false});
 atlasDraw();window.scrollTo(0,0);
}
function activateAtlas(){
 const originalMap=mapPage;mapPage=function(){atlasState=null;originalMap();$('main').insertAdjacentHTML('afterbegin','<button class="card" onclick="showAtlas()"><strong>◈ Интерактивный 3D-атлас</strong><small>Кузов, двигатель, трансмиссия, магистрали, проводка</small></button>');};
 const oldBack=backApp;backApp=function(){if($('atlasCanvas')){mapPage();return;}oldBack();};
}
