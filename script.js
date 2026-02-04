// Preços
const precos={
'cartao-fosco':{100:89,250:149,500:219,1000:349},
'cartao-brilho':{100:59,250:99,500:159,1000:249},
'panfleto':{500:129,1000:199,2500:349},
'camiseta':{1:45,5:199,10:349},
'lona':{m2:67.80},
'adesivo-recorte':{metro:70},
'adesivo-impresso':{m2:79.80},
'acm':{m2:180},
'toldo-cortina':{m2:340},
'toldo-retratil':{m2:520}
};

const nomes={'cartao-fosco':'Cartão Fosco','cartao-brilho':'Cartão Brilho','panfleto':'Panfleto','camiseta':'Camiseta','lona':'Lona','adesivo-recorte':'Adesivo Recorte','adesivo-impresso':'Adesivo Impresso','acm':'Fachada ACM','toldo-cortina':'Toldo Cortina','toldo-retratil':'Toldo Retrátil'};

function toggleMenu(){document.getElementById('mainNav').classList.toggle('active')}

function atualizarPreco(select){
const opt=select.options[select.selectedIndex];
const display=select.parentElement.querySelector('.preco-display');
if(display)display.textContent='R$ '+opt.getAttribute('data-preco')+',00';
}

function calcularRapido(){
const prod=document.getElementById('produto-rapido').value;
const qtd=parseFloat(document.getElementById('quantidade-rapida').value);
const res=document.getElementById('resultado-rapido');
if(!prod||!qtd||qtd<=0){alert('Preencha todos os campos');return}

let nome=nomes[prod]||prod,total=0,msg='';

if(precos[prod].m2){
total=(qtd*precos[prod].m2).toFixed(2);
msg=`<strong>${nome}</strong><br>${qtd}m² = <span style="font-size:28px;font-weight:900">R$ ${total}</span>`;
}else if(precos[prod].metro){
total=(qtd*precos[prod].metro).toFixed(2);
msg=`<strong>${nome}</strong><br>${qtd}m = <span style="font-size:28px;font-weight:900">R$ ${total}</span>`;
}else{
const qtds=Object.keys(precos[prod]).map(Number).sort((a,b)=>a-b);
let qtdSel=qtds[qtds.length-1];
for(let q of qtds){if(q>=qtd){qtdSel=q;break}}
total=precos[prod][qtdSel];
msg=`<strong>${nome}</strong><br>Você pediu:${qtd}→${qtdSel}un<br><span style="font-size:28px;font-weight:900">R$ ${total},00</span>`;
}

msg+=`<div style="margin-top:15px;display:flex;gap:10px;flex-wrap:wrap"><a href="https://wa.me/5511968649673?text=Pedido:${encodeURIComponent(nome)},Qtd:${qtd},Valor:R$${total}" target="_blank" style="flex:1;min-width:140px;background:#fff;color:#25d366;padding:10px;border-radius:25px;text-align:center;font-weight:700;text-decoration:none">Gilney</a><a href="https://wa.me/5511949141803?text=Pedido:${encodeURIComponent(nome)},Qtd:${qtd},Valor:R$${total}" target="_blank" style="flex:1;min-width:140px;background:#fff;color:#25d366;padding:10px;border-radius:25px;text-align:center;font-weight:700;text-decoration:none">Elisete</a></div>`;

res.innerHTML=msg;res.classList.add('show');res.scrollIntoView({behavior:'smooth'});
}

function calcularM2(btn,nome,precoM2){
const card=btn.closest('.produto-card');
const larg=parseFloat(card.querySelector('.largura').value);
const alt=parseFloat(card.querySelector('.altura').value);
if(!larg||!alt||larg<=0||alt<=0){alert('Preencha largura e altura');return}
const area=(larg*alt).toFixed(2);
const total=(area*precoM2).toFixed(2);
const esc=confirm(`Área:${area}m²= R$ ${total}\n\nOK=Gilney | Cancelar=Elisete`);
const num=esc?'5511968649673':'5511949141803';
const aten=esc?'Gilney':'Elisete';
window.open(`https://wa.me/${num}?text=Orçamento:${encodeURIComponent(nome)},${larg}m x${alt}m=${area}m², R$${total}, Atendente:${aten}`,'_blank');
}

function calcularLinear(btn,nome,precoMetro){
const card=btn.closest('.produto-card');
const m=parseFloat(card.querySelector('.metros').value);
if(!m||m<=0){alert('Preencha os metros');return}
const total=(m*precoMetro).toFixed(2);
const esc=confirm(`Total:${m}m x R$${precoMetro}= R$ ${total}\n\nOK=Gilney | Cancelar=Elisete`);
const num=esc?'5511968649673':'5511949141803';
const aten=esc?'Gilney':'Elisete';
window.open(`https://wa.me/${num}?text=Orçamento:${encodeURIComponent(nome)},${m}m, R$${total}, Atendente:${aten}`,'_blank');
}

function fazerPedido(nome,el){
const card=el.closest('.produto-card');
const sel=card.querySelector('.quantidade-select');
const opt=sel.options[sel.selectedIndex];
const qtd=opt.value;
const preco=opt.getAttribute('data-preco');
const esc=confirm(`OK=Gilney | Cancelar=Elisete`);
const num=esc?'5511968649673':'5511949141803';
const aten=esc?'Gilney':'Elisete';
window.open(`https://wa.me/${num}?text=Pedido:${encodeURIComponent(nome)},${qtd}un, R$${preco},00, Atendente:${aten}`,'_blank');
}

function pedirOrcamento(nome){
const esc=confirm(`Orçamento para ${nome}\n\nOK=Gilney | Cancelar=Elisete`);
const num=esc?'5511968649673':'5511949141803';
const aten=esc?'Gilney':'Elisete';
window.open(`https://wa.me/${num}?text=Orçamento:${encodeURIComponent(nome)}, Atendente:${aten}`,'_blank');
}

document.querySelectorAll('.quantidade-select').forEach(s=>atualizarPreco(s));
