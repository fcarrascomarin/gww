/**
 * Interacciones de la web pública.
 * No almacena perfiles, registros de monitoreo ni información privada.
 */
(() => {
  'use strict';

  const menuButton = document.getElementById('menu-toggle');
  const menu = document.getElementById('site-nav');
  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }

  const methods = [...document.querySelectorAll('.method')];
  function closeMethods(returnFocus = false) {
    let last = null;
    for (const item of methods) {
      const button = item.querySelector('.method-trigger');
      const detail = item.querySelector('.method-popover');
      if (button.getAttribute('aria-expanded') === 'true') last = button;
      button.setAttribute('aria-expanded', 'false');
      detail.hidden = true;
    }
    if (returnFocus && last) last.focus();
  }
  for (const item of methods) {
    const trigger = item.querySelector('.method-trigger');
    const detail = item.querySelector('.method-popover');
    trigger.addEventListener('click', () => {
      const willOpen = trigger.getAttribute('aria-expanded') !== 'true';
      closeMethods();
      trigger.setAttribute('aria-expanded', String(willOpen));
      detail.hidden = !willOpen;
    });
    item.querySelector('.method-close').addEventListener('click', () => closeMethods(true));
  }
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMethods(true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.method')) closeMethods();
  });

  async function loadJson(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`No se pudo leer ${path}: ${response.status}`);
    return response.json();
  }

  async function loadVideos() {
    const container = document.getElementById('video-grid');
    if (!container) return;
    try {
      const videos = await loadJson('data/videos.json');
      if (!Array.isArray(videos)) throw new Error('Formato de videos incorrecto');
      for (const record of videos) {
        if (!/^[A-Za-z0-9_-]{11}$/.test(record.id)) continue;
        const title = String(record.titulo || 'Registro audiovisual');
        const poster = String(record.poster || '');
        if (!/^assets\/[a-z0-9-]+\.(webp|png|jpg)$/i.test(poster)) continue;
        const card = document.createElement('article');
        card.className = 'video-card';
        const media = document.createElement('div');
        media.className = 'video-media';
        const play = document.createElement('button');
        play.type = 'button';
        play.className = 'video-play';
        play.setAttribute('aria-label', `Reproducir video: ${title}`);
        const image = document.createElement('img');
        image.src = poster;
        image.alt = '';
        image.loading = 'lazy';
        const ring = document.createElement('span');
        ring.className = 'play-ring';
        ring.textContent = '▶';
        ring.setAttribute('aria-hidden', 'true');
        play.append(image, ring);
        play.addEventListener('click', () => {
          const frame = document.createElement('iframe');
          frame.src = `https://www.youtube-nocookie.com/embed/${record.id}?autoplay=1&rel=0`;
          frame.title = title;
          frame.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';
          frame.allowFullscreen = true;
          frame.referrerPolicy = 'strict-origin-when-cross-origin';
          media.replaceChildren(frame);
        });
        media.append(play);
        const heading = document.createElement('h3');
        heading.textContent = title;
        const description = document.createElement('p');
        description.textContent = String(record.descripcion || '');
        const source = document.createElement('a');
        source.href = `https://www.youtube.com/watch?v=${record.id}`;
        source.target = '_blank';
        source.rel = 'noopener noreferrer';
        source.className = 'video-source-link';
        source.textContent = 'Ver en YouTube ↗';
        card.append(media, heading, description, source);
        container.append(card);
      }
    } catch (error) {
      console.error('Archivo audiovisual:', error);
      const message = document.createElement('p');
      message.textContent = 'El contenido audiovisual no está disponible en este momento.';
      container.append(message);
    }
  }

  async function loadOrganizationLogos() {
    const container = document.getElementById('organization-logos');
    if (!container) return;
    try {
      const organizations = await loadJson('data/logos-red.json');
      if (!Array.isArray(organizations)) throw new Error('Formato de logos incorrecto');
      for (const item of organizations) {
        if (item.autorizado !== true || typeof item.nombre !== 'string') continue;
        if (!/^assets\/logos-red\/[a-z0-9-]+\.(png|webp|svg)$/i.test(item.archivo || '')) continue;
        const wrapper = document.createElement('div');
        wrapper.className = 'organization-logo';
        const image = document.createElement('img');
        image.src = item.archivo;
        image.alt = `Logo de ${item.nombre}`;
        image.loading = 'lazy';
        const label = document.createElement('span');
        label.textContent = item.nombre;
        wrapper.append(image, label);
        container.append(wrapper);
      }
    } catch (error) {
      console.error('Logos institucionales:', error);
    }
  }

  void loadVideos();
  void loadOrganizationLogos();
})();
