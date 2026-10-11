// Monta o catálogo a partir de uma lista de categorias:
// [{ id, codigo, nome, descricao, ferramentas: [{ nome, url }] }]
// A lista vem do JSON em <body data-fonte="..."> ou, se não houver, do <script id="dados"> da página.

const search = document.getElementById('search');
const catNav = document.getElementById('cat-nav');
const lista = document.getElementById('lista');
const countLive = document.getElementById('count-live');
const emptyMsg = document.getElementById('empty');

function normalize(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function dominio(url) {
  return new URL(url).hostname.replace(/^www\./, '');
}

function montar(categorias) {
  const total = categorias.reduce((n, c) => n + c.ferramentas.length, 0);
  const resumo = total + ' ferramentas / ' + categorias.length + ' categorias';
  countLive.textContent = resumo;

  categorias.forEach(cat => {
    const btn = el('button', 'navbtn');
    btn.type = 'button';
    btn.append(el('span', 'navcode', cat.codigo), cat.nome, el('span', 'count', cat.ferramentas.length));
    btn.addEventListener('click', () => {
      document.getElementById(cat.id).scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    catNav.append(btn);

    const section = el('section', 'cat');
    section.id = cat.id;
    section.dataset.busca = normalize(cat.nome);

    const h2 = el('h2');
    h2.append(el('span', 'catcode', cat.codigo), cat.nome, el('span', 'badge', cat.ferramentas.length));

    const grid = el('div', 'grid');
    cat.ferramentas.forEach(f => {
      const host = dominio(f.url);
      const card = el('a', 'card');
      card.href = f.url;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.dataset.busca = normalize(f.nome + ' ' + host);
      card.append(el('span', 'card-name', f.nome), el('span', 'card-domain', host));
      grid.append(card);
    });

    section.append(h2);
    if (cat.descricao) section.append(el('p', 'cat-desc', cat.descricao));
    section.append(grid);
    lista.append(section);
  });

  const secoes = Array.from(lista.querySelectorAll('.cat'));

  search.addEventListener('input', () => {
    const q = normalize(search.value.trim());
    let visiveis = 0;
    let catsVisiveis = 0;
    secoes.forEach(secao => {
      let naCategoria = 0;
      secao.querySelectorAll('.card').forEach(card => {
        const match = q === '' || (card.dataset.busca + ' ' + secao.dataset.busca).includes(q);
        card.classList.toggle('hidden', !match);
        if (match) naCategoria++;
      });
      secao.classList.toggle('hidden', naCategoria === 0);
      if (naCategoria > 0) catsVisiveis++;
      visiveis += naCategoria;
    });
    countLive.textContent = q === '' ? resumo : visiveis + ' resultado(s) / ' + catsVisiveis + ' categoria(s)';
    emptyMsg.style.display = visiveis === 0 ? 'block' : 'none';
  });

  // As seções só existem depois da montagem, então a âncora da URL é aplicada aqui.
  const alvo = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (alvo) alvo.scrollIntoView();
}

const fonte = document.body.dataset.fonte;
if (fonte) {
  fetch(fonte)
    .then(r => r.json())
    .then(montar)
    .catch(() => { countLive.textContent = 'não foi possível carregar a lista.'; });
} else {
  montar(JSON.parse(document.getElementById('dados').textContent));
}
