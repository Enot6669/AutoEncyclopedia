function scopedFasteners(){
 return FASTENERS.filter(r=>car==='niva'
  ?model.startsWith('21213')&&(/21213/.test(r[1]))
  :(/11183|11186/.test(model)&&r[1]==='11183/11186')||r[1].startsWith('Datsun:'));
}
function techTable(headers,rows){
 return '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px;text-align:left"><thead><tr>'+headers.map(x=>'<th style="padding:10px;background:#29434a">'+esc(x)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map(x=>'<td style="padding:9px;border-bottom:1px solid #3e535b;vertical-align:top">'+esc(x)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
}
function sourceNote(id){
 const s=TECH_SOURCES[id];return s?'<small>Источник: '+esc(s[0])+' · <a href="'+esc(s[1])+'">ссылка (необязательно)</a></small>':'';
}
function fastenerCards(rows){
 if(!rows.length)return '<p class="warning">Для выбранной модификации точных данных в этом выпуске пока нет. Не переносите размеры и моменты с другой версии.</p>';
 return rows.map(r=>'<div class="card"><strong>'+esc(r[0])+'</strong><small>'+esc(r[1])+'</small>'+techTable(['Параметр','Значение'],[['Резьба / размер',r[2]],['Длина',r[3]],['Ключ / инструмент',r[4]],['Момент (Н·м)',r[5]],['Количество в каталоге',r[6]],['Артикул',r[7]],['Прочность / одноразовость','Сверить по каталогу и процедуре']])+sourceNote(r[8])+(r[0]==='Гайки крышки клапанов'?'<br>'+sourceNote('valveCover'):'')+'</div>').join('');
}
function renderFasteners(){
 const q=document.getElementById('fastenerSearch').value.trim().toLowerCase();
 const rows=scopedFasteners().filter(r=>r.join(' ').toLowerCase().includes(q));
 document.getElementById('fastenerResults').innerHTML='<small>Найдено: '+rows.length+'</small>'+fastenerCards(rows);
}
function flowDiagram(items){
 if(!items||!items.length)return '';
 return '<h3>Функциональная схема</h3><div style="display:grid;gap:6px;text-align:center">'+items.map((item,i)=>'<div style="padding:12px;border:1px solid #54776d;border-radius:10px;background:#29434a">'+esc(item)+'</div>'+(i<items.length-1?'<span style="color:#77dfac">↓</span>':'')).join('')+'</div><small>Условная последовательность / связь узлов, не монтажная схема и не распиновка.</small>';
}
function boltDiagram(){
 return '<svg viewBox="0 0 320 175" role="img" aria-label="Измерение болта"><g fill="#53756e" stroke="#b5d6c7" stroke-width="2"><path d="M30 55H65V115H30Z"/><path d="M65 75H270V95H65Z"/></g><g stroke="#b5d6c7" stroke-width="2">'+Array.from({length:18},(_,i)=>'<path d="M'+(135+i*7)+' 75 l7 20"/>').join('')+'</g><g stroke="#f6b66d" stroke-width="1.5" fill="none"><path d="M65 122V153M270 102V153M65 145H270M30 44V22M65 44V22M30 27H65M282 75H305M282 95H305M296 75V95"/></g><g font-size="11" fill="#fff"><text x="110" y="163">Длина под головкой L</text><text x="80" y="22">Размер ключа — по граням</text><text x="274" y="65">d</text><text x="150" y="61">Шаг P — между витками</text></g></svg><small>Учебное изображение; размеры измеряются на конкретной детали.</small>';
}
function technicalExtra(x){
 let t=flowDiagram(x.flow);
 if(x.standardTable)t+=boltDiagram()+techTable(['Резьба','Шаг, мм','Ключ ISO, мм','Шайба d×D×t, мм'],STANDARD)+'<p class="warning">Это размеры нового стандартного крепежа ISO. Для старого DIN/ГОСТ и специального автомобильного крепежа головки M10/M12 могут быть 17/19 мм вместо 16/18. Размер ключа проверяйте на детали. Таблица не устанавливает момент затяжки.</p>'+sourceNote('dims');
 if(x.fuseTable)t+=techTable(['Позиция','А','Цепь'],FUSES_2014)+sourceNote('datsunFuse')+'<p class="warning">Только фрагмент карты руководства 2014 года, не универсальная карта всех комплектаций.</p>';
 if(x.fastenerTable)t+='<h3>Крепёж выбранной модификации</h3><input id="fastenerSearch" placeholder="Поиск: M6, номер, узел..." oninput="renderFasteners()"><div id="fastenerResults">'+fastenerCards(scopedFasteners())+'</div>';
 else{const rows=scopedFasteners().filter(r=>r[9]===x.id);if(rows.length)t+='<h3>Крепёж и моменты</h3>'+fastenerCards(rows);}
 if(x.source&&!x.fuseTable&&!x.standardTable)t+=sourceNote(x.source);
 return t;
}
// Integrate with the existing navigation without changing stored user records.
function activateTechnicalUI(){
 const originalDetail=showDetail;
 showDetail=function(id){
  originalDetail(id);
  const x=DATA.find(x=>x.id===id);
  if(x){ const extra=technicalExtra(x); if(extra)$('main').insertAdjacentHTML('beforeend',extra); }
 };
 const originalRender=render;
 render=function(){
  originalRender();
  if(!detail&&tab==='catalog'){
   const r=$('results');
   if(r)r.insertAdjacentHTML('beforebegin','<button class="card" onclick="openCard(\'fastener-catalog\')"><strong>🔩 Крепёж и моменты затяжки</strong><small>Резьба, длина, ключи, количество, номера деталей</small></button><button class="card" onclick="openCard(\'fastener-guide\')"><strong>Размеры болтов, гаек, шайб</strong><small>Таблица ISO и измерение резьбы</small></button>');
  }
 };
}
