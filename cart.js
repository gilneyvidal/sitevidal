(function(){
  const qs = s => document.querySelector(s);
  const qsa = s => Array.from(document.querySelectorAll(s));
  const fmt = v => v.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});

  const state = {
    items: JSON.parse(localStorage.getItem('cart_items') || '[]')
  };

  function save(){ localStorage.setItem('cart_items', JSON.stringify(state.items)); }
  function count(){ return state.items.reduce((a,i)=> a + (i.unit==='un' ? (i.qty||1) : 1), 0); }
  function subtotal(i){
    if(i.unit === 'm2'){
      const area = Math.max(i.minArea || 0.5, +(i.area || 0));
      return area * i.price;
    }else{
      const q = Math.max(1, i.qty||1);
      return q * i.price;
    }
  }
  function total(){ return state.items.reduce((a,i)=> a + subtotal(i), 0); }

  function render(){
    const container = qs('#cartItems');
    const totalEl = qs('#cartTotal');
    const countEl = qs('#cartCount');
    if(!container || !totalEl || !countEl) return;
    container.innerHTML = '';
    state.items.forEach((i, idx) => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      const details = [];
      if(i.unit==='m2'){
        details.push(`Área: ${Math.max(i.minArea||0.5, +(i.area||0)).toFixed(2)} m²`);
        if(i.width && i.height) details.push(`(${Number(i.width).toFixed(2)} x ${Number(i.height).toFixed(2)} m)`);
      } else {
        details.push(`Qtd: ${Math.max(1, i.qty||1)}`);
      }
      div.innerHTML = `
        <div>
          <strong>${i.name}</strong><br/>
          <small>${details.join(' ')}</small><br/>
          <small>Valor unitário: R$ ${fmt(i.price)} ${i.unit==='m2' ? '/m²' : '/un'}</small>
        </div>
        <div style="text-align:right">
          <div><strong>R$ ${fmt(subtotal(i))}</strong></div>
          <button class="btn btn-sm" data-remove="${idx}" style="margin-top:6px;background:#ef4444;color:white">Remover</button>
        </div>
      `;
      container.appendChild(div);
    });
    totalEl.textContent = fmt(total());
    countEl.textContent = count();

    qsa('[data-remove]').forEach(b=>{
      b.addEventListener('click', ()=>{
        const idx = +b.getAttribute('data-remove');
        state.items.splice(idx,1);
        save(); render();
      });
    });
  }

  function openDrawer(){ qs('#cartDrawer')?.classList.add('open'); qs('#cartDrawer')?.setAttribute('aria-hidden','false'); }
  function closeDrawer(){ qs('#cartDrawer')?.classList.remove('open'); qs('#cartDrawer')?.setAttribute('aria-hidden','true'); }

  function buildWhatsAppMessage(){
    let msg = `Olá! Quero finalizar meu pedido:%0A%0A`;
    state.items.forEach((i, k) => {
      if(i.unit==='m2'){
        const area = Math.max(i.minArea||0.5, +(i.area||0));
        msg += `${k+1}) ${i.name} - Área: ${area.toFixed(2)} m²`;
        if(i.width && i.height) msg += ` (${Number(i.width).toFixed(2)} x ${Number(i.height).toFixed(2)} m)`;
        msg += ` - Subtotal: R$ ${fmt(subtotal(i))}%0A`;
      } else {
        const q = Math.max(1, i.qty||1);
        msg += `${k+1}) ${i.name} - Qtd: ${q} - Subtotal: R$ ${fmt(subtotal(i))}%0A`;
      }
    });
    msg += `%0ATotal: R$ ${fmt(total())}%0A%0A`;
    msg += `Meu nome: %0AObservações: `;
    return msg;
  }

  function checkout(){
    const url = `https://wa.me/5511968649673?text=${buildWhatsAppMessage()}`;
    window.open(url, '_blank');
  }

  // Public API
  window.Cart = {
    addItem(p){
      // para itens /m2: se não vier area aqui (vindo de cards), pedir default 1x1 => aplica minArea
      if(p.unit === 'm2'){
        const area = p.area || 1;
        state.items.push({...p, area});
      } else {
        const qty = p.qty || 1;
        state.items.push({...p, qty});
      }
      save(); render();
      openDrawer();
    }
  };

  // Bind header cart
  document.addEventListener('click', (e)=>{
    const t = e.target;
    if(t && t.id === 'openCartBtn'){ e.preventDefault(); openDrawer(); }
    if(t && t.id === 'closeCartBtn'){ e.preventDefault(); closeDrawer(); }
    if(t && t.id === 'checkoutBtn'){ e.preventDefault(); if(state.items.length) checkout(); }
  });

  // Init
  render();
})();
