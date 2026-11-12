/* Web externa GWW Chile V10. Sin información de agrupaciones ni voluntariado en el mapa.
   Nunca subir bases de datos internas a un repositorio público. */
(() => {
  'use strict';
  const byId = (id) => document.getElementById(id);
  const navToggle = byId('nav-toggle');
  const navMain = byId('nav-main');
  if (navToggle && navMain) {
    navToggle.addEventListener('click', () => {
      const opened = navMain.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(opened));
      navToggle.setAttribute('aria-label', opened ? 'Cerrar menú' : 'Abrir menú');
    });
    navMain.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navMain.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded','false');
    }));
  }

  const methods = {
    fisicoquimico: {
      title:'Monitoreo fisicoquímico',
      image:'assets/monitoreo-fisicoquimico.png',
      text:'El laboratorio portátil descrito por GWW permite observar oxígeno disuelto, dureza, alcalinidad, pH, temperatura y turbidez. Estas mediciones aportan antecedentes sobre las características del agua en el lugar y momento observados.'
    },
    bacteriologico: {
      title:'Monitoreo bacteriológico',
      image:'assets/monitoreo-bacteriologico.png',
      text:'Se emplean tarjetas con medios de cultivo para observar bacterias indicadoras, entre ellas coliformes fecales, de acuerdo con las condiciones y tiempos establecidos en el protocolo. Los resultados requieren registro y lectura responsable.'
    },
    macroinvertebrados: {
      title:'Biomonitoreo de macroinvertebrados',
      image:'assets/monitoreo-macroinvertebrados.png',
      text:'La observación de macroinvertebrados bentónicos permite conocer características de los ecosistemas acuáticos. Los organismos presentan diferentes grados de sensibilidad o tolerancia ante alteraciones ambientales.'
    }
  };
  // V10: gotas orgánicas; expansión en el propio paisaje, sin ventanas modales.
  const garden=byId('metodos');
  const explainer=byId('method-explainer');
  const dropButtons=[...document.querySelectorAll('.water-drop')];
  let activeDrop=null;
  function clearMethod(restoreFocus=false){
    const prior=activeDrop;
    activeDrop=null;
    garden?.classList.remove('has-active-drop');
    dropButtons.forEach(b=>{b.classList.remove('is-active');b.setAttribute('aria-pressed','false');});
    if(explainer)explainer.hidden=true;
    if(restoreFocus&&prior)prior.focus();
  }
  function selectMethod(button){
    const method=methods[button.dataset.method];
    if(!method||!explainer)return;
    if(activeDrop===button){clearMethod(true);return;}
    activeDrop=button;
    garden?.classList.add('has-active-drop');
    dropButtons.forEach(b=>{
      const on=b===button;
      b.classList.toggle('is-active',on);
      b.setAttribute('aria-pressed',String(on));
    });
    byId('method-explainer-title').textContent=method.title;
    byId('method-explainer-text').textContent=method.text;
    explainer.hidden=false;
  }
  dropButtons.forEach(button=>button.addEventListener('click',()=>selectMethod(button)));
  byId('method-explainer-close')?.addEventListener('click',()=>clearMethod(true));
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&activeDrop){clearMethod(true);}
  });

  async function readJson(path) {
    const response=await fetch(path,{cache:'no-cache'});
    if(!response.ok)throw new Error(`${response.status} ${path}`);
    return response.json();
  }
  const videoGrid=byId('video-grid');
  const videoDialog=byId('video-dialog');
  async function initVideos(){
    if(!videoGrid)return;
    try {
      const videos=await readJson('data/videos.json');
      if(!Array.isArray(videos))throw new Error('La lista de videos no es válida');
      videos.forEach((video,index)=>{
        if(!/^[a-zA-Z0-9_-]{11}$/.test(video.id))return;
        const item=document.createElement('article');item.className='video-tile';
        const button=document.createElement('button');button.type='button';button.className='video-thumb';
        button.setAttribute('aria-label',`Reproducir ${video.label || 'registro audiovisual'}`);
        const image=document.createElement('img');image.src=video.poster;image.alt='Fotografía documental utilizada como portada ilustrativa';image.loading='lazy';
        const play=document.createElement('span');play.className='video-play';play.setAttribute('aria-hidden','true');
        button.append(image,play);
        const caption=document.createElement('p');caption.textContent=video.label||`Registro audiovisual ${index+1}`;
        item.append(button,caption);videoGrid.append(item);
        button.addEventListener('click',()=>{
          const holder=byId('video-player');holder.replaceChildren();
          byId('video-dialog-title').textContent=video.label||'Memoria audiovisual';
          const frame=document.createElement('iframe');frame.title=video.label||'Registro audiovisual';frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.referrerPolicy='strict-origin-when-cross-origin';frame.allowFullscreen=true;
          frame.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id)}?autoplay=1&rel=0`;
          holder.append(frame);videoDialog.showModal();
        });
      });
    }catch(e){
      const err=document.createElement('p');err.textContent='El archivo audiovisual no está disponible. Revise la ruta data/videos.json.';videoGrid.append(err);console.error(e);
    }
  }
  initVideos();
  const closeVideo=()=>{videoDialog.close();byId('video-player').replaceChildren();};
  byId('video-close')?.addEventListener('click',closeVideo);
  videoDialog?.addEventListener('click',e=>{if(e.target===videoDialog)closeVideo();});
  videoDialog?.addEventListener('close',()=>byId('video-player').replaceChildren());

  const logoBox=byId('organization-logos');
  const logoPending=byId('organization-pending');
  async function initLogos(){
    if(!logoBox)return;
    try{
      const all=await readJson('data/logos-red.json');
      if(!Array.isArray(all))throw new Error('Formato inválido');
      const approved=all.filter(entry=>entry.autorizado===true && typeof entry.nombre==='string' && /^assets\/logos-red\/[a-z0-9-]+\.(png|webp|svg)$/i.test(entry.archivo||''));
      approved.forEach(entry=>{
        const box=document.createElement('div');box.className='organization-logo';
        const image=document.createElement('img');image.alt=`Logo de ${entry.nombre}`;image.src=entry.archivo;image.loading='lazy';
        const label=document.createElement('span');label.textContent=entry.nombre;
        box.append(image,label);logoBox.append(box);
      });
      if(approved.length&&logoPending)logoPending.hidden=true;
    }catch(e){console.error('No se cargaron logos de la red:',e);}
  }
  initLogos();
})();
