'use strict';
const $ = (id) => document.getElementById(id);

const menuButton = $('menuButton');
const nav = $('nav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open', !expanded);
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
}

async function loadPublicShowcase() {
  const container = $('publicCards');
  const regionSelect = $('publicRegion');
  const methodSelect = $('publicMethod');
  const countNode = $('publicCount');
  if (!container) return;
  let entries = [];
  try {
    const response = await fetch('data/public-showcase.json');
    entries = await response.json();
  } catch (error) {
    container.innerHTML = '<p class="load-error">No fue posible cargar la muestra pública.</p>';
    return;
  }

  const render = () => {
    const region = regionSelect?.value || 'Todas';
    const method = methodSelect?.value || 'Todas';
    const filtered = entries.filter((item) => {
      const regionOk = region === 'Todas' || item.region === region;
      const methodOk = method === 'Todas' || item.monitoreo.includes(method);
      return regionOk && methodOk;
    });
    if (countNode) countNode.textContent = `${filtered.length} fichas públicas piloto`;
    container.innerHTML = '';
    filtered.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'public-card';
      card.innerHTML = `
        <div class="public-card-head">
          <div>
            <span class="public-card-kicker">${item.region}</span>
            <h3>${item.cuerpo_agua}</h3>
            <p class="public-city">${item.ciudad}</p>
          </div>
          <span class="public-badge">${item.monitoreo.length} métodos</span>
        </div>
        <dl class="public-meta">
          <div><dt>Cuenca</dt><dd>${item.cuenca}</dd></div>
          <div><dt>Preocupación ambiental</dt><dd>${item.preocupacion_ambiental}</dd></div>
          <div><dt>Área protegida</dt><dd>${item.area_protegida}</dd></div>
          <div><dt>Usos humanos</dt><dd>${item.usos_humanos}</dd></div>
          <div><dt>Voluntariado / equipo</dt><dd>${item.tipo_voluntarios}</dd></div>
          <div><dt>Tipos de monitoreo</dt><dd>${item.monitoreo.join(', ')}</dd></div>
        </dl>
        <div class="public-card-foot">
          <span>Fuente: ${item.fuente}</span>
        </div>`;
      container.appendChild(card);
    });
  };
  regionSelect?.addEventListener('change', render);
  methodSelect?.addEventListener('change', render);
  render();
}
loadPublicShowcase();
