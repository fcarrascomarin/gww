'use strict';
/* Catálogo histórico/documental, NO datos de observación.
   Fuente: Memoria Global Water Watch Chile 2024. No se atribuye a agrupaciones ni monitores. */
const documentedWaters=[
 {name:'Río Elqui',region:'Coquimbo',type:'Río'},
 {name:'Río Penco',region:'Biobío',type:'Río'},
 {name:'Río Nonguén',region:'Biobío',type:'Río'},
 {name:'Río Andalién',region:'Biobío',type:'Río'},
 {name:'Río Laja',region:'Biobío',type:'Río'},
 {name:'Laguna La Señoraza',region:'Biobío',type:'Laguna'},
 {name:'Laguna Antihuala',region:'Biobío',type:'Laguna'},
 {name:'Humedal Price',region:'Biobío',type:'Humedal'},
 {name:'Humedal Los Batros',region:'Biobío',type:'Humedal'},
 {name:'Río Curanilahue',region:'Biobío',type:'Río'},
 {name:'Lago Villarrica',region:'La Araucanía',type:'Lago'},
 {name:'Humedal Angachilla',region:'Los Ríos',type:'Humedal'},
 {name:'Río Maullín',region:'Los Lagos',type:'Río'},
 {name:'Río Futaleufú',region:'Los Lagos',type:'Río'}
];
const $ = (id)=>document.getElementById(id);
const strip=(s)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const waterList=$('waterList'),search=$('waterSearch'),region=$('regionSelect'),info=$('waterInfo');
let selected=null;
function renderList(){
 const query=strip(search.value.trim());
 const match=documentedWaters.filter(w=>(region.value==='todos'||w.region===region.value)&&strip(w.name).includes(query));
 waterList.replaceChildren();
 if(!match.length){const p=document.createElement('p');p.textContent='No hay coincidencias en el catálogo histórico mostrado.';p.style.cssText='font-size:12px;color:#5d7278;padding:15px';waterList.append(p);return;}
 match.forEach(w=>{
  const button=document.createElement('button');button.type='button';button.className='water-entry'+(selected===w.name?' selected':'');
  const main=document.createElement('span');const title=document.createElement('strong');title.textContent=w.name;const desc=document.createElement('small');desc.textContent=`${w.type} · Región de ${w.region}`;main.append(title,desc);
  const arr=document.createElement('span');arr.className='arr';arr.textContent='↗';button.append(main,arr);
  button.addEventListener('click',()=>{selected=w.name;info.replaceChildren();const b=document.createElement('b');b.textContent=w.name;const s=document.createElement('span');s.textContent=`${w.type} · Región de ${w.region}. Mencionado en la Memoria GWW Chile 2024. Sin mediciones públicas habilitadas en esta versión; no se muestra localización exacta.`;info.append(b,s);renderList();});
  waterList.append(button);
 });
}
if(waterList&&search&&region){search.addEventListener('input',renderList);region.addEventListener('change',renderList);renderList();}
const tabHistory=$('tab-history'),tabPublic=$('tab-public'),panelHistory=$('panel-history'),panelPublic=$('panel-public');
function tab(which){const history=which==='history';tabHistory.classList.toggle('active',history);tabPublic.classList.toggle('active',!history);tabHistory.setAttribute('aria-selected',String(history));tabPublic.setAttribute('aria-selected',String(!history));panelHistory.hidden=!history;panelPublic.hidden=history;}
if(tabHistory&&tabPublic){tabHistory.addEventListener('click',()=>tab('history'));tabPublic.addEventListener('click',()=>tab('public'));}
const menuButton=$('menuButton'),nav=$('nav');
if(menuButton&&nav){menuButton.addEventListener('click',()=>{const expanded=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!expanded));nav.classList.toggle('open',!expanded)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false')}));}
