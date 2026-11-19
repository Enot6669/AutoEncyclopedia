const PHOTO_ALIASES={'niva-fuse':'fuse','datsun-fuse':'fuse','crank-n':'crank','crank-d':'crank','fuel':'tank','fuel-level':'pump'};
function articlePhoto(x){
 const key=x.image||PHOTO_ALIASES[x.id]||x.id,p=PHOTOS[key];
 if(!p)return '<p class="muted">Для этой детали пока нет проверенной фотографии. Ниже — условная схема и текстовый ориентир.</p>';
 return '<figure class="card" style="margin:12px 0"><img src="'+esc(p.file)+'" alt="'+esc(p.caption)+'" style="display:block;width:100%;max-height:500px;object-fit:contain;border-radius:10px" onclick="zoomPhoto(\''+key+'\')"><figcaption><p>'+esc(p.caption)+'</p><small>Нажмите, чтобы увеличить. '+esc(p.author)+' · '+esc(p.license)+' · '+esc(p.modified)+' <br><a href="'+esc(p.source)+'">Источник</a>'+(p.licenseUrl?' · <a href="'+esc(p.licenseUrl)+'">Лицензия</a>':'')+'</small></figcaption></figure>';
}
function zoomPhoto(key){
 const p=PHOTOS[key];if(!p)return;
 const d=document.createElement('dialog');d.style.cssText='width:100%;max-width:100%;height:100%;max-height:100%;margin:0;background:#10191f;color:white;border:0;padding:10px;overflow:auto';
 d.innerHTML='<button autofocus>← Закрыть</button><p>'+esc(p.caption)+'</p><img style="width:100%;height:auto;object-fit:contain" src="'+esc(p.file)+'" alt="'+esc(p.caption)+'">';
 d.querySelector('button').onclick=()=>d.close();d.addEventListener('close',()=>d.remove());document.body.append(d);d.showModal();
}
function fuelDiagram(x){
 let c=x.car==='both'?car:x.car;
 let carb=x.mode==='carb'||(c==='niva'&&model.includes('карбюратор')&&x.mode!=='injection');
 let early=c==='niva'&&!carb;
 let supply=carb?['Бак','Фильтр','Мех. насос','Карбюратор']:['Бак / модуль','Фильтр','Рампа','Форсунки'];
 const box=(x,y,w,t,color='#29434a')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="36" rx="8" fill="'+color+'" stroke="#99b6ba"/><text x="'+(x+w/2)+'" y="'+(y+22)+'" fill="#fff" text-anchor="middle" font-size="11">'+t+'</text>';
 const line=(x1,y1,x2,y2,col,dash='')=>'<path d="M'+x1+' '+y1+' L'+x2+' '+y2+'" stroke="'+col+'" stroke-width="3" '+(dash?'stroke-dasharray="6 4"':'')+' marker-end="url(#arrow)" fill="none"/>';
 let s='<svg viewBox="0 0 320 345" role="img" aria-label="Функциональная схема топливной системы"><defs><marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="#e4edf0"/></marker></defs>';
 s+='<text x="160" y="18" fill="#b5d6c7" text-anchor="middle" font-size="12">ПЕРЕД • МОТОРНЫЙ ОТСЕК</text>';
 s+=box(108,30,104,supply[3])+box(108,88,104,supply[2])+box(108,146,104,supply[1])+box(108,238,104,supply[0]);
 s+=line(160,238,160,182,'#77dfac')+line(160,146,160,124,'#77dfac')+line(160,88,160,66,'#77dfac');
 if(carb||early){s+='<path d="M108 '+(carb?48:106)+' H45 V256 H108" stroke="#f6b66d" stroke-width="3" stroke-dasharray="6 4" fill="none" marker-end="url(#arrow)"/><text x="36" y="165" transform="rotate(-90 36 165)" fill="#f6b66d" font-size="11">Обратка, если есть</text>';}
 if(!carb){s+=box(224,182,86,'Адсорбер','#594632')+box(224,30,86,'Впуск','#594632')+'<path d="M212 256 H267 V218 M267 182 V66" stroke="#e2c46b" stroke-width="3" stroke-dasharray="4 4" fill="none" marker-end="url(#arrow)"/><text x="278" y="145" fill="#e2c46b" font-size="10" transform="rotate(-90 278 145)">Пары / продувка</text>';}
 s+='<text x="160" y="298" text-anchor="middle" fill="#b5d6c7" font-size="11">ЗАД • БАК / ГОРЛОВИНА</text><text x="10" y="318" fill="#77dfac" font-size="10">● Подача бензина</text><text x="10" y="334" fill="#f6b66d" font-size="10">– – Обратка / пары (см. описание)</text></svg>';
 return '<h3>Схема трубопроводов</h3>'+s+'<p class="muted">Функциональная схема, не точная прокладка шлангов по кузову. '+(early?'Изображён ранний вариант с обраткой; у поздних версий она может отсутствовать.':carb?'Обратный слив предусмотрен не у всех карбюраторных исполнений.':'Для 11183/11186; на 21127 сверяйте конкретную комплектацию.')+'</p>';
}
function wiringDiagram(){
 return '<h3>Функциональная схема питания</h3><svg viewBox="0 0 320 220" role="img" aria-label="Питание насоса"><g fill="#29434a" stroke="#99b6ba"><rect x="10" y="15" width="92" height="34" rx="7"/><rect x="114" y="15" width="95" height="34" rx="7"/><rect x="221" y="15" width="90" height="34" rx="7"/><rect x="221" y="90" width="90" height="34" rx="7"/><rect x="10" y="90" width="92" height="34" rx="7"/><rect x="221" y="165" width="90" height="34" rx="7"/></g><g fill="#fff" font-size="11" text-anchor="middle"><text x="56" y="36">АКБ</text><text x="161" y="36">Предохранитель</text><text x="266" y="36">Реле</text><text x="266" y="111">Насос</text><text x="56" y="111">ЭБУ</text><text x="266" y="186">Масса</text></g><g stroke="#f6b66d" stroke-width="3" fill="none"><path d="M102 32 H114 M209 32 H221 M266 49 V90 M266 124 V165"/></g><path d="M102 107 H170 V58 H235 V49" fill="none" stroke="#77dfac" stroke-width="3" stroke-dasharray="5 4"/><text x="115" y="138" fill="#77dfac" font-size="10">Управление реле</text></svg><p class="muted">Оранжевый — силовая цепь, зелёный — управление. Цвета условные, реальные пины и цвета проводов сверяются по заводской электросхеме.</p>';
}
function gallery(){return '<h2>Фото деталей • офлайн</h2><p class="muted">Фотографии и учебные изображения хранятся внутри приложения. Примеры других автомобилей подписаны.</p>'+Object.keys(PHOTOS).map(id=>articlePhoto({id})).join('')}
