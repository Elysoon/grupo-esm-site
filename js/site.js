(function(){
  'use strict';
  var WA='5591996374849';
  var pages=[].slice.call(document.querySelectorAll('[data-page]'));
  var links=[].slice.call(document.querySelectorAll('#nav a[data-r]'));
  var nav=document.getElementById('nav'), mb=document.getElementById('menuBtn');
  var servBtn=document.getElementById('servBtn'), painel=document.getElementById('menuServicos'), drop=painel.parentNode;
  var reduzMov=matchMedia('(prefers-reduced-motion: reduce)');
  var largo=matchMedia('(min-width: 901px)');
  var atual=null, primeira=true, DADOS=null, sistemaAtual=null;
  var NOMES={gestao:'Gestão',operacoes:'Operações',tecnologia:'Tecnologia'};
  var SITUACAO={disponivel:'Disponível',desenvolvimento:'Em desenvolvimento',encomenda:'Sob encomenda'};
  function el(tag,cls,txt){var e=document.createElement(tag); if(cls) e.className=cls; if(txt!=null) e.textContent=txt; return e;}
  function wa(texto){ return 'https://wa.me/'+WA+'?text='+encodeURIComponent(texto); }
  function pendente(v){ return !v || /\[PREENCHER/.test(v); }

  // ---------- Navegação entre páginas ----------
  function route(){
    var hash=(location.hash||'#inicio').slice(1);
    var alvo=null, page=null;
    if(/^[a-z0-9-]{1,60}$/.test(hash)){
      if(hash.indexOf('sistema-')===0){ page=document.querySelector('[data-page="sistema"]'); mostrarSistema(hash.slice(8)); }
      else page=pages.filter(function(p){return p.dataset.page===hash;})[0]||null;
      if(!page){ alvo=document.getElementById(hash); if(alvo) page=alvo.closest('[data-page]'); }
    }
    if(!page && alvo && atual){ alvo.focus(); return; } // "Pular para o conteúdo"
    if(!page) page=pages[0];
    atual=page;
    pages.forEach(function(p){p.hidden=p!==page;});
    var id=page.dataset.page;
    document.title=id==='sistema'&&sistemaAtual?sistemaAtual.nome+' · Grupo ESM':page.dataset.title;
    links.forEach(function(a){
      var on=a.dataset.r===id||(id==='sistema'&&a.dataset.r==='sistemas');
      a.classList.toggle('on',on && !a.closest('.drop-painel'));
      if(on) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    });
    servBtn.classList.toggle('on',id.indexOf('servicos')===0);
    fecharMenu(); fecharServicos(false);
    if(alvo){ alvo.scrollIntoView(); }
    else { window.scrollTo(0,0); if(!primeira){ var h=page.querySelector('h1'); if(h) h.focus({preventScroll:true}); } }
    primeira=false;
  }
  window.addEventListener('hashchange',route);

  // ---------- Menu do celular ----------
  function fecharMenu(){ nav.classList.remove('open'); mb.setAttribute('aria-expanded','false'); }
  mb.addEventListener('click',function(){var o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',String(o));});

  // ---------- Menu Serviços ----------
  function posicionar(){
    var b=servBtn.getBoundingClientRect();
    painel.style.left=Math.max(12,Math.min(b.left-8,innerWidth-painel.offsetWidth-12))+'px';
    painel.style.top=(b.bottom+12)+'px';
    painel.style.transformOrigin=(b.left+b.width/2-parseFloat(painel.style.left))+'px -12px';
  }
  function abrirServicos(){
    if(largo.matches){ document.body.appendChild(painel); painel.classList.add('flutuante'); }
    painel.hidden=false; servBtn.setAttribute('aria-expanded','true');
    if(largo.matches) posicionar();
    if(!reduzMov.matches){ painel.classList.remove('abrindo'); void painel.offsetWidth; painel.classList.add('abrindo'); }
  }
  function fecharServicos(foco){
    if(painel.hidden) return;
    painel.hidden=true; painel.classList.remove('abrindo','flutuante'); servBtn.setAttribute('aria-expanded','false');
    if(painel.parentNode!==drop) drop.appendChild(painel);
    if(foco) servBtn.focus();
  }
  servBtn.addEventListener('click',function(e){ e.stopPropagation(); painel.hidden?abrirServicos():fecharServicos(false); });
  document.addEventListener('click',function(e){ if(!painel.hidden && !painel.contains(e.target) && e.target!==servBtn) fecharServicos(false); });
  addEventListener('resize',function(){ if(!painel.hidden && painel.classList.contains('flutuante')) posicionar(); });
  addEventListener('scroll',function(){ if(!painel.hidden && painel.classList.contains('flutuante')) fecharServicos(false); },{passive:true});
  document.addEventListener('keydown',function(e){
    if(e.key!=='Escape') return;
    if(!painel.hidden) fecharServicos(true);
    else if(nav.classList.contains('open')){ fecharMenu(); mb.focus(); }
  });

  // ---------- Cards ----------
  function seguro(url){ return /^https:\/\/[^\s"'<>]+$/.test(url||'') ? url : null; }
  function situacaoTexto(s){ return SITUACAO[s.situacao]||'Situação a confirmar'; }
  function acao(s){ // botão conforme a situação do sistema
    if(s.situacao==='desenvolvimento') return {txt:'Entrar na lista de espera',msg:'Olá, Grupo ESM! Quero entrar na lista de espera do '+s.nome+'.'};
    if(s.situacao==='encomenda') return {txt:'Pedir orçamento',msg:'Olá, Grupo ESM! Quero um orçamento de '+s.nome+'.'};
    return {txt:'Pedir demonstração',msg:'Olá, Grupo ESM! Quero uma demonstração do '+s.nome+'.'};
  }
  function empresa(d){
    var a=el('article','partner lg');
    var id=el('div','partner-id');
    if(d.selo) id.appendChild(el('span','badge',d.selo));
    var h=el('h3'), partes=String(d.nome||'').split(' ');
    h.appendChild(el('b',null,partes.shift())); if(partes.length) h.appendChild(document.createTextNode(' '+partes.join(' ')));
    id.appendChild(h);
    if(d.descricao) id.appendChild(el('p',null,d.descricao));
    if(d.pilares&&d.pilares.length) id.appendChild(el('p','pilares-emp','Pilar: '+d.pilares.map(function(p){return NOMES[p]||p;}).join(', ')));
    if(d.dados && d.dados.length){
      var kv=el('div','kv');
      d.dados.forEach(function(x){var r=el('div'); r.appendChild(el('span',null,x.rotulo)); r.appendChild(el('b',null,x.valor)); kv.appendChild(r);});
      id.appendChild(kv);
    }
    var url=seguro(d.site);
    if(url){ var l=el('a','btn lg lg-tinta','Visitar o site da '+d.nome); l.href=url; l.target='_blank'; l.rel='noopener noreferrer'; id.appendChild(l); }
    a.appendChild(id);
    var sv=el('div','partner-svc');
    (d.servicos||[]).forEach(function(g){
      var box=el('div','group'); box.appendChild(el('h4',null,g.grupo));
      var tags=el('div','tags'); (g.itens||[]).forEach(function(i){tags.appendChild(el('span',null,i));});
      box.appendChild(tags); sv.appendChild(box);
    });
    a.appendChild(sv);
    return a;
  }
  function sistemaCard(s){
    var a=el('article','proj lg');
    a.appendChild(el('span','kind',(NOMES[s.pilar]||'')+' · '+(s.segmentos||[]).join(', ')));
    var h=el('h3'), l=el('a',null,s.nome); l.href='#sistema-'+s.id; h.appendChild(l); a.appendChild(h);
    a.appendChild(el('p',null,s.resumo));
    if(SITUACAO[s.situacao]) a.appendChild(el('span','situacao s-'+s.situacao,situacaoTexto(s)));
    var rod=el('div','proj-acoes');
    var ver=el('a','more','Ver detalhes'); ver.href='#sistema-'+s.id; ver.setAttribute('aria-label','Ver detalhes do '+s.nome); rod.appendChild(ver);
    var ac=acao(s), b=el('a','btn lg lg-tinta btn-p',ac.txt); b.href=wa(ac.msg); b.target='_blank'; b.rel='noopener noreferrer'; b.setAttribute('aria-label',ac.txt+': '+s.nome); rod.appendChild(b);
    a.appendChild(rod);
    return a;
  }

  // ---------- Loja, credenciamento e rede ----------
  function precoTexto(v){ return pendente(v)?'Preço a confirmar':v; }
  function botaoCompra(item,txtCompra,msgSemLink){
    var link=seguro(item.linkCompra), b;
    if(link && !pendente(item.preco)){ b=el('a','btn lg lg-tinta btn-p',txtCompra); b.href=link; }
    else { b=el('a','btn lg lg-clear btn-p','Pedir valores'); b.href=wa(msgSemLink); }
    b.target='_blank'; b.rel='noopener noreferrer'; b.setAttribute('aria-label',b.textContent+': '+item.nome);
    return b;
  }
  function lojaCard(item,tipo){
    var a=el('article','proj lg');
    a.appendChild(el('span','kind',tipo==='sistemas'?(NOMES[item.pilar]||'')+' · assinatura':''));
    var h=el('h3');
    if(tipo==='sistemas'){ var l=el('a',null,item.nome); l.href='#sistema-'+item.id; h.appendChild(l); } else h.textContent=item.nome;
    a.appendChild(h);
    a.appendChild(el('p',null,item.resumo));
    a.appendChild(el('p','preco'+(pendente(item.preco)?' preco-pendente':''),precoTexto(item.preco)));
    var rod=el('div','proj-acoes');
    if(tipo==='sistemas'){ var ver=el('a','more','Ver detalhes'); ver.href='#sistema-'+item.id; ver.setAttribute('aria-label','Ver detalhes do '+item.nome); rod.appendChild(ver); }
    rod.appendChild(botaoCompra(item,tipo==='sistemas'?'Assinar':'Comprar','Olá, Grupo ESM! Quero saber os valores de '+item.nome+'.'));
    a.appendChild(rod);
    return a;
  }
  function planoCard(pl){
    var a=el('article','proj lg plano');
    a.appendChild(el('span','kind','Plano'));
    a.appendChild(el('h3',null,pl.nome));
    a.appendChild(el('p','preco'+(pendente(pl.preco)?' preco-pendente':''),precoTexto(pl.preco)));
    var ul=el('ul','beneficios'); (pl.beneficios||[]).forEach(function(b){ul.appendChild(el('li',null,b));}); a.appendChild(ul);
    var link=seguro(pl.linkCompra), b;
    if(link && !pendente(pl.preco)){ b=el('a','btn lg lg-tinta btn-p','Assinar o plano '+pl.nome); b.href=link; }
    else { b=el('a','btn lg lg-clear btn-p','Quero o plano '+pl.nome); b.href=wa('Olá, Grupo ESM! Quero credenciar minha empresa no plano '+pl.nome+'.\nCNPJ:\nServiços:\nCidades que atendo:'); }
    b.target='_blank'; b.rel='noopener noreferrer'; a.appendChild(b);
    return a;
  }
  function credCard(c){
    var a=el('article','proj lg');
    a.appendChild(el('span','kind',(c.pilares||[]).map(function(p){return NOMES[p]||p;}).join(', ')+(c.cidade?' · '+c.cidade:'')));
    a.appendChild(el('h3',null,c.nome));
    if(c.descricao) a.appendChild(el('p',null,c.descricao));
    if(c.servicos&&c.servicos.length){ var t=el('div','tags'); c.servicos.forEach(function(x){t.appendChild(el('span',null,x));}); a.appendChild(t); }
    if(c.cnpj) a.appendChild(el('p','fornecido','CNPJ '+c.cnpj));
    var rod=el('div','proj-acoes');
    var u=seguro(c.site); if(u){ var l=el('a','more','Site da empresa'); l.href=u; l.target='_blank'; l.rel='noopener noreferrer'; rod.appendChild(l); }
    if(c.whatsapp && /^\d{10,13}$/.test(c.whatsapp)){ var b=el('a','btn lg lg-clear btn-p','Falar com a empresa'); b.href='https://wa.me/'+c.whatsapp; b.target='_blank'; b.rel='noopener noreferrer'; rod.appendChild(b); }
    a.appendChild(rod);
    return a;
  }
  var credPilar='', credCidade='';
  function desenharRede(){
    [].slice.call(document.querySelectorAll('[data-lista-loja]')).forEach(function(c){
      var tipo=c.getAttribute('data-lista-loja'); c.textContent='';
      var lista=(DADOS.sistemas||[]).filter(function(s){return s.id!=='sob-medida' && s.situacao!=='desenvolvimento' && s.naLoja!==false;});
      if(!lista.length){
        var v=el('div','vazio'); v.appendChild(el('p',null,c.getAttribute('data-vazio')||'Nada por aqui ainda.'));
        c.appendChild(v); return;
      }
      lista.forEach(function(i){c.appendChild(lojaCard(i,tipo));});
    });
    [].slice.call(document.querySelectorAll('[data-lista-planos]')).forEach(function(c){
      c.textContent=''; ((DADOS.credenciamento||{}).planos||[]).forEach(function(pl){c.appendChild(planoCard(pl));});
    });
    var lc=document.getElementById('listaCred');
    if(lc){
      lc.textContent='';
      var lista=(DADOS.credenciados||[]).filter(function(c){return (!credPilar||(c.pilares||[]).indexOf(credPilar)>=0)&&(!credCidade||c.cidade===credCidade);});
      document.getElementById('contagemCred').textContent=lista.length+(lista.length===1?' empresa credenciada':' empresas credenciadas');
      if(!lista.length){
        var v=el('div','vazio'); v.appendChild(el('p',null,(DADOS.credenciados||[]).length?'Nenhuma empresa credenciada neste filtro.':'A rede está começando. Seja a primeira empresa credenciada da sua cidade.'));
        var ln=el('a','more','Ver os planos de credenciamento'); ln.href='#credenciamento'; v.appendChild(ln); lc.appendChild(v);
      }
      lista.forEach(function(c){lc.appendChild(credCard(c));});
    }
    var com=(DADOS.afiliados||{}).comissao, pc=document.getElementById('afComissao');
    if(pc && !pendente(com)) pc.textContent='Quando a empresa assina, você recebe '+com+' de comissão.';
  }
  function preencherRede(){
    var sel=document.getElementById('filtroCredCidade'), vistas={};
    (DADOS.credenciados||[]).forEach(function(c){ if(c.cidade&&!vistas[c.cidade]){vistas[c.cidade]=1; var o=el('option',null,c.cidade); o.value=c.cidade; sel.appendChild(o);} });
    sel.addEventListener('change',function(){credCidade=sel.value;desenharRede();});
    var sp=document.getElementById('filtroCredPilar'); sp.addEventListener('change',function(){credPilar=sp.value;desenharRede();});
  }
  document.getElementById('btnOrcServico').href=wa('Olá, Grupo ESM! Quero um orçamento de serviço (manutenção, instalação ou sistema).');
  document.getElementById('btnAfiliado').href=wa('Olá, Grupo ESM! Quero ser afiliado e indicar os sistemas do grupo.');

  // ---------- Listas (data/dados.json) ----------
  var filtroPilar='todos', filtroSeg='';
  function desenhar(){
    if(!DADOS) return;
    [].slice.call(document.querySelectorAll('[data-lista-sistemas]')).forEach(function(c){
      var p=c.getAttribute('data-lista-sistemas'); c.textContent='';
      var lista=(DADOS.sistemas||[]).filter(function(s){return p==='todos'||s.pilar===p;});
      if(c.id==='catalogo'){
        lista=lista.filter(function(s){return !filtroSeg||(s.segmentos||[]).indexOf(filtroSeg)>=0;});
        document.getElementById('contagem').textContent=lista.length+(lista.length===1?' sistema':' sistemas');
        if(!lista.length) c.appendChild(el('p','vazio','Nenhum sistema neste filtro. Faça o diagnóstico ou peça um projeto sob medida.'));
      }
      lista.forEach(function(s){c.appendChild(sistemaCard(s));});
    });
    [].slice.call(document.querySelectorAll('[data-lista-empresas]')).forEach(function(c){
      var p=c.getAttribute('data-lista-empresas'); c.textContent='';
      var lista=(DADOS.empresas||[]).filter(function(e){return p==='todos'||(e.pilares||[]).indexOf(p)>=0;});
      if(!lista.length) c.appendChild(el('p','vazio',c.getAttribute('data-vazio')||'Nenhuma empresa cadastrada ainda.'));
      lista.forEach(function(e){c.appendChild(empresa(e));});
    });
    desenharRede();
    if(atual&&atual.dataset.page==='sistema') route();
  }
  function preencherFiltros(){
    var sel=document.getElementById('filtroSegmento'), vistos={};
    (DADOS.sistemas||[]).forEach(function(s){(s.segmentos||[]).forEach(function(g){ if(!vistos[g]){vistos[g]=1; var o=el('option',null,g); o.value=g; sel.appendChild(o);} });});
    sel.addEventListener('change',function(){filtroSeg=sel.value;desenhar();});
    var redes=document.getElementById('redes');
    ((DADOS.contato||{}).redes||[]).forEach(function(r){ var u=seguro(r.url); if(!u) return; var a=el('a',null,r.nome); a.href=u; a.target='_blank'; a.rel='noopener noreferrer'; redes.appendChild(a); });
  }
  [].slice.call(document.querySelectorAll('[data-filtro]')).forEach(function(b){
    b.addEventListener('click',function(){
      document.querySelectorAll('[data-filtro]').forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});
      filtroPilar=b.getAttribute('data-filtro');
      document.getElementById('catalogo').setAttribute('data-lista-sistemas',filtroPilar); desenhar();
    });
  });
  function carregar(){
    function ok(d){DADOS=d;preencherFiltros();preencherRede();desenhar();}
    if(window.DADOS_GRUPO_ESM){ ok(window.DADOS_GRUPO_ESM); return; }
    fetch('data/dados.json',{cache:'no-cache'}).then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); })
      .then(ok)
      .catch(function(){
        [].slice.call(document.querySelectorAll('[data-lista-sistemas],[data-lista-empresas],[data-lista-loja],[data-lista-planos],#listaCred')).forEach(function(c){c.textContent='';c.appendChild(el('p','note','Não foi possível carregar esta lista agora. Recarregue a página ou fale com a gente pelo WhatsApp (91) 99637-4849.'));});
      });
  }

  // ---------- Página de cada sistema ----------
  function mostrarSistema(idSis){
    if(!DADOS) return;
    var s=(DADOS.sistemas||[]).filter(function(x){return x.id===idSis;})[0];
    if(!s){ sistemaAtual=null; document.getElementById('sNome').textContent='Sistema não encontrado'; document.getElementById('sResumo').textContent='Veja a lista completa no catálogo.'; ['sProblema','sParaQuem','sNomeCrumb','sFornecido','sSituacao'].forEach(function(i){document.getElementById(i).textContent='';}); document.getElementById('sRecursos').textContent=''; document.getElementById('sAcoes').textContent=''; document.getElementById('sSegmentos').textContent=''; return; }
    sistemaAtual=s;
    document.getElementById('sNome').textContent=s.nome;
    document.getElementById('sNomeCrumb').textContent=s.nome;
    document.getElementById('sResumo').textContent=s.resumo;
    var st=document.getElementById('sSituacao'); st.textContent=(NOMES[s.pilar]||'')+(SITUACAO[s.situacao]?' · '+situacaoTexto(s):''); st.className='situacao '+(SITUACAO[s.situacao]?'s-'+s.situacao:'s-pendente');
    document.getElementById('sProblema').textContent=pendente(s.problema)?'':s.problema; document.getElementById('sProblema').closest('article').hidden=pendente(s.problema);
    document.getElementById('sParaQuem').textContent=s.paraQuem;
    var seg=document.getElementById('sSegmentos'); seg.textContent=''; (s.segmentos||[]).forEach(function(g){seg.appendChild(el('span',null,g));});
    var ul=document.getElementById('sRecursos'); ul.textContent=''; var rec=(s.recursos||[]).filter(function(r){return !pendente(r);}); rec.forEach(function(r){ul.appendChild(el('li',null,r));}); ul.closest('article').hidden=!rec.length;
    var ac=document.getElementById('sAcoes'); ac.textContent='';
    var link=seguro(s.linkCompra);
    if(link && !pendente(s.preco)){ var c=el('a','btn lg lg-tinta','Assinar · '+s.preco); c.href=link; c.target='_blank'; c.rel='noopener noreferrer'; ac.appendChild(c); }
    var a=acao(s), b=el('a',link&&!pendente(s.preco)?'btn lg lg-clear':'btn lg lg-tinta',a.txt); b.href=wa(a.msg); b.target='_blank'; b.rel='noopener noreferrer'; ac.appendChild(b);
    var d=el('button','btn lg lg-clear','Qual sistema é para mim?'); d.type='button'; d.setAttribute('data-diagnostico',''); d.addEventListener('click',function(){abrirDiag(d);}); ac.appendChild(d);
    // Identificação de quem vende (exigida na venda pela internet)
    document.getElementById('sFornecido').textContent=s.cnpj?'Fornecido por: '+s.fornecedor+' – CNPJ '+s.cnpj:'Sistema do Grupo ESM. A empresa do grupo que fornece este sistema aparece, com razão social e CNPJ, na proposta e no contrato.';
  }

  // ---------- Envio pelo WhatsApp com consentimento (contato) ----------
  function limpo(id){return document.getElementById(id).value.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g,'').trim().slice(0,1000);}
  (function(){
    var ok=document.getElementById('fOk'), btn=document.getElementById('fSend');
    function build(){
      btn.href=wa('Olá, Grupo ESM!'+(limpo('fNome')?' Meu nome é '+limpo('fNome')+'.':'')+'\nAssunto: '+limpo('fArea')+(limpo('fMsg')?'\n'+limpo('fMsg'):'')+(limpo('fFone')?'\nTelefone: '+limpo('fFone'):''));
      btn.setAttribute('aria-disabled',ok.checked?'false':'true');
    }
    ['fNome','fFone','fArea','fMsg','fOk'].forEach(function(id){var e=document.getElementById(id);e.addEventListener('input',build);e.addEventListener('change',build);});
    btn.addEventListener('click',function(e){ if(!ok.checked){ e.preventDefault(); ok.focus(); } });
    document.getElementById('form').addEventListener('submit',function(e){e.preventDefault();build();if(ok.checked)btn.click();});
    build();
  })();
  document.getElementById('btnParceiro').href=wa('Olá, Grupo ESM! Tenho uma empresa e quero conversar sobre fazer parte do grupo.');

  // ---------- Diagnóstico "Qual sistema é para mim?" ----------
  var diag=document.getElementById('diag'), fundo=document.getElementById('diagFundo'), origem=null;
  var dForm=document.getElementById('diagForm'), dRes=document.getElementById('diagResultado'), dLista=document.getElementById('diagLista'), dOk=document.getElementById('dOk');
  var respostas=null;
  function textoOpcao(id){var s=document.getElementById(id);return s.options[s.selectedIndex].text;}
  function recomendar(){
    var ramo=document.getElementById('dRamo').value, dor=document.getElementById('dDor').value;
    var equipe=+document.getElementById('dEquipe').value, modelo=document.getElementById('dModelo').value;
    var lista=(DADOS&&DADOS.sistemas||[]).map(function(s){
      var d=s.diag||{}, p=0;
      if((d.dores||[]).indexOf(dor)>=0) p+=5;
      if((d.ramos||[]).indexOf(ramo)>=0) p+=2;
      if(d.equipe && equipe<2) p-=3;
      if(d.whitelabel && modelo==='whitelabel') p+=2;
      if(s.id==='sob-medida' && modelo==='medida') p+=4;
      return {s:s,p:p};
    }).filter(function(x){return x.p>=4;}).sort(function(a,b){return b.p-a.p;}).slice(0,3).map(function(x){return x.s;});
    if(!lista.length) lista=(DADOS.sistemas||[]).filter(function(s){return s.id==='sob-medida';});
    return lista;
  }
  function resumoRespostas(){
    return 'Ramo: '+textoOpcao('dRamo')+'\nEquipe: '+textoOpcao('dEquipe')+'\nMaior dor: '+textoOpcao('dDor')+'\nHoje: '+textoOpcao('dHoje')+'\nPrefiro: '+textoOpcao('dModelo');
  }
  function atualizarBotoesDiag(){
    [].slice.call(dLista.querySelectorAll('a.btn')).forEach(function(b){ b.setAttribute('aria-disabled',dOk.checked?'false':'true'); });
  }
  dOk.addEventListener('change',atualizarBotoesDiag);
  dForm.addEventListener('submit',function(e){
    e.preventDefault();
    respostas=resumoRespostas(); dLista.textContent='';
    recomendar().forEach(function(s){
      var item=el('div','diag-item');
      var t=el('div'); var h=el('b',null,s.nome); t.appendChild(h); t.appendChild(el('span',null,s.resumo)); item.appendChild(t);
      var a=acao(s), b=el('a','btn lg lg-tinta btn-p',a.txt); b.href=wa(a.msg+'\n\nMinhas respostas no diagnóstico:\n'+respostas); b.target='_blank'; b.rel='noopener noreferrer';
      b.setAttribute('aria-label',a.txt+': '+s.nome);
      b.addEventListener('click',function(ev){ if(!dOk.checked){ ev.preventDefault(); dOk.focus(); } });
      item.appendChild(b); dLista.appendChild(item);
    });
    dForm.hidden=true; dRes.hidden=false; atualizarBotoesDiag();
    var p=dRes.querySelector('a.btn'); if(p) p.focus(); else dOk.focus();
  });
  document.getElementById('diagRefazer').addEventListener('click',function(){ dRes.hidden=true; dForm.hidden=false; document.getElementById('dRamo').focus(); });

  var MOLA='linear(0, .22 8%, .64 18%, .96 30%, 1.08 40%, 1.06 50%, 1.01 62%, .99 75%, 1)';
  function animar(elm,quadros,dur){
    if(reduzMov.matches||!elm.animate) return null;
    try{ return elm.animate(quadros,{duration:dur,easing:MOLA}); }
    catch(e){ return elm.animate(quadros,{duration:dur,easing:'cubic-bezier(.2,.9,.25,1.15)'}); }
  }
  function deBotao(){
    if(!origem||!origem.isConnected) return null;
    var b=origem.getBoundingClientRect(), d=diag.getBoundingClientRect();
    if(!b.width) return null;
    var dx=(b.left+b.width/2)-(d.left+d.width/2), dy=(b.top+b.height/2)-(d.top+d.height/2);
    return 'translate(-50%,-50%) translate('+dx+'px,'+dy+'px) scale('+(b.width/d.width).toFixed(3)+','+(b.height/d.height).toFixed(3)+')';
  }
  function abrirDiag(btn){
    origem=btn; fundo.hidden=false; diag.hidden=false; dRes.hidden=true; dForm.hidden=false;
    var de=deBotao();
    if(de) animar(diag,[{transform:de,borderRadius:'999px',opacity:.6},{transform:'translate(-50%,-50%)',borderRadius:'20px',opacity:1}],620);
    animar(fundo,[{opacity:0},{opacity:1}],300);
    setTimeout(function(){document.getElementById('dRamo').focus();},reduzMov.matches?0:250);
  }
  function fecharDiag(){
    if(diag.hidden) return;
    var de=deBotao(), a=de?animar(diag,[{transform:'translate(-50%,-50%)',opacity:1},{transform:de,opacity:0}],260):null;
    var fim=function(){diag.hidden=true;fundo.hidden=true;if(origem&&origem.isConnected) origem.focus();};
    if(a) a.onfinish=fim; else fim();
  }
  [].slice.call(document.querySelectorAll('[data-diagnostico]')).forEach(function(b){b.addEventListener('click',function(){abrirDiag(b);});});
  document.getElementById('diagFechar').addEventListener('click',fecharDiag);
  fundo.addEventListener('click',fecharDiag);
  diag.addEventListener('keydown',function(e){
    if(e.key==='Escape'){ e.stopPropagation(); fecharDiag(); return; }
    if(e.key!=='Tab') return; // mantém o foco dentro da janela
    var f=[].slice.call(diag.querySelectorAll('button,select,input,textarea,a[href]')).filter(function(x){return !x.disabled&&x.offsetParent!==null;});
    var p=f[0], u=f[f.length-1];
    if(e.shiftKey&&document.activeElement===p){e.preventDefault();u.focus();}
    else if(!e.shiftKey&&document.activeElement===u){e.preventDefault();p.focus();}
  });

  // ---------- Conferência visual: ?abrir=servicos | ?abrir=diagnostico | ?rolar=N ----------
  var abrir=(location.search.match(/[?&]abrir=([a-z]+)/)||[])[1];
  var rolar=+((location.search.match(/[?&]rolar=(\d+)/)||[])[1]||0);

  carregar(); route();
  if(rolar) setTimeout(function(){window.scrollTo({top:rolar,behavior:'instant'});},60);
  if(abrir==='servicos') setTimeout(abrirServicos,50);
  if(abrir==='diagnostico') setTimeout(function(){abrirDiag(document.querySelector('[data-diagnostico]'));},50);
  document.getElementById('ano').textContent=String(new Date().getFullYear());
})();
