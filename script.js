// Preços - SEM menção a fornecedores
const precos = {
    'cartao-fosco': { 100: 89, 250: 149, 500: 219, 1000: 349 },
    'cartao-brilho': { 100: 59, 250: 99, 500: 159, 1000: 249 },
    'panfleto-frente': { 500: 129, 1000: 199, 2500: 349, 5000: 549 },
    'panfleto-duplo': { 500: 179, 1000: 279, 2500: 499, 5000: 799 },
    'camiseta-dry': { 1: 45, 5: 199, 10: 349, 20: 599 },
    'camiseta-algodao': { 1: 39, 5: 175, 10: 299, 20: 499 },
    'dtf-a4': { 1: 24, 5: 99, 10: 179, 20: 299 },
    'lona-440': { m2: 67.80 },
    'adesivo-recorte': { metro: 70.00 },
    'adesivo-impresso': { m2: 79.80 },
    'acm': { m2: 180.00 },
    'toldo-cortina': { m2: 340.00 },
    'toldo-retratil': { m2: 520.00 }
};

const nomes = {
    'cartao-fosco': 'Cartão Fosco Premium',
    'cartao-brilho': 'Cartão Brilho Econômico',
    'panfleto-frente': 'Panfleto Frente Colorida',
    'panfleto-duplo': 'Panfleto Frente/Verso',
    'camiseta-dry': 'Camiseta Dry Fit',
    'camiseta-algodao': 'Camiseta 100% Algodão',
    'dtf-a4': 'Transfer DTF A4',
    'lona-440': 'Lona Impressão Digital 440g',
    'adesivo-recorte': 'Adesivo Vinil Recorte',
    'adesivo-impresso': 'Adesivo Impresso',
    'acm': 'Fachada ACM',
    'toldo-cortina': 'Toldo Cortina',
    'toldo-retratil': 'Toldo Retrátil'
};

// Carousel
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.carousel-dot');

function changeSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

setInterval(() => {
    let next = (currentSlide + 1) % slides.length;
    changeSlide(next);
}, 5000);

// WhatsApp
function toggleWhatsApp() {
    document.getElementById('whatsappOptions').classList.toggle('active');
}

// Fechar ao clicar fora
document.addEventListener('click', (e) => {
    const container = document.querySelector('.whatsapp-container');
    if (!container.contains(e.target)) {
        document.getElementById('whatsappOptions').classList.remove('active');
    }
});

// Atualizar preço exibido
function atualizarPreco(select) {
    const opcao = select.options[select.selectedIndex];
    const preco = opcao.getAttribute('data-preco');
    const display = select.parentElement.querySelector('.preco-display');
    if (display) display.textContent = `R$ ${preco},00`;
}

// Calculadora Rápida - Arredonda para cima
function calcularRapido() {
    const produto = document.getElementById('produto-rapido').value;
    const quantidade = parseFloat(document.getElementById('quantidade-rapida').value);
    const resultadoDiv = document.getElementById('resultado-rapido');
    
    if (!produto || !quantidade || quantidade <= 0) {
        alert('Por favor, selecione um produto e digite uma quantidade válida.');
        return;
    }
    
    let nomeProduto = nomes[produto] || produto;
    let mensagem = '';
    let total = 0;
    
    if (precos[produto].m2) {
        total = (quantidade * precos[produto].m2).toFixed(2);
        mensagem = `<strong>${nomeProduto}</strong><br>Área: ${quantidade} m²<br><span style="font-size:28px;font-weight:900">R$ ${total}</span>`;
    } else if (precos[produto].metro) {
        total = (quantidade * precos[produto].metro).toFixed(2);
        mensagem = `<strong>${nomeProduto}</strong><br>${quantidade} metros<br><span style="font-size:28px;font-weight:900">R$ ${total}</span>`;
    } else {
        const quantidades = Object.keys(precos[produto]).map(Number).sort((a,b) => a-b);
        let qtdSel = quantidades[quantidades.length - 1];
        for (let q of quantidades) { if (q >= quantidade) { qtdSel = q; break; } }
        total = precos[produto][qtdSel];
        mensagem = `<strong>${nomeProduto}</strong><br>Você pediu: ${quantidade} → Quantidade válida: ${qtdSel} un<br><span style="font-size:28px;font-weight:900">R$ ${total},00</span>`;
    }
    
    mensagem += `<div style="margin-top:15px;display:flex;gap:10px;flex-wrap:wrap"><a href="https://wa.me/5511968649673?text=Pedido:${encodeURIComponent(nomeProduto)},Qtd:${quantidade},Valor:R$${total}" target="_blank" style="flex:1;min-width:140px;background:#fff;color:#25d366;padding:10px;border-radius:25px;text-align:center;font-weight:700;text-decoration:none"><i class="fab fa-whatsapp"></i> Gilney</a><a href="https://wa.me/5511949141803?text=Pedido:${encodeURIComponent(nomeProduto)},Qtd:${quantidade},Valor:R$${total}" target="_blank" style="flex:1;min-width:140px;background:#fff;color:#25d366;padding:10px;border-radius:25px;text-align:center;font-weight:700;text-decoration:none"><i class="fab fa-whatsapp"></i> Elisete</a></div>`;
    
    resultadoDiv.innerHTML = mensagem;
    resultadoDiv.classList.add('show');
    resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Cálculos M2 e Linear
function calcularM2(btn, nome, precoM2) {
    const card = btn.closest('.produto-card');
    const larg = parseFloat(card.querySelector('.largura').value);
    const alt = parseFloat(card.querySelector('.altura').value);
    if (!larg || !alt || larg <= 0 || alt <= 0) { alert('Preencha largura e altura'); return; }
    const area = (larg * alt).toFixed(2);
    const total = (area * precoM2).toFixed(2);
    const esc = confirm(`Área: ${area}m² = R$ ${total}\n\nOK = Gilney\nCancelar = Elisete`);
    const num = esc ? '5511968649673' : '5511949141803';
    const aten = esc ? 'Gilney' : 'Elisete';
    window.open(`https://wa.me/${num}?text=Orçamento:${encodeURIComponent(nome)},${larg}m x ${alt}m = ${area}m², R$${total}, Atendente:${aten}`, '_blank');
}

function calcularLinear(btn, nome, precoMetro) {
    const card = btn.closest('.produto-card');
    const m = parseFloat(card.querySelector('.metros').value);
    if (!m || m <= 0) { alert('Preencha os metros'); return; }
    const total = (m * precoMetro).toFixed(2);
    const esc = confirm(`Total: ${m}m x R$${precoMetro} = R$ ${total}\n\nOK = Gilney\nCancelar = Elisete`);
    const num = esc ? '5511968649673' : '5511949141803';
    const aten = esc ? 'Gilney' : 'Elisete';
    window.open(`https://wa.me/${num}?text=Orçamento:${encodeURIComponent(nome)},${m}m, R$${total}, Atendente:${aten}`, '_blank');
}

function fazerPedido(nome, el) {
    const card = el.closest('.produto-card');
    const sel = card.querySelector('.quantidade-select');
    const opt = sel.options[sel.selectedIndex];
    const qtd = opt.value;
    const preco = opt.getAttribute('data-preco');
    const esc = confirm(`Deseja falar com Gilney (OK) ou Elisete (Cancelar)?`);
    const num = esc ? '5511968649673' : '5511949141803';
    const aten = esc ? 'Gilney' : 'Elisete';
    window.open(`https://wa.me/${num}?text=Pedido:${encodeURIComponent(nome)},${qtd}un, R$${preco},00, Atendente:${aten}`, '_blank');
}

// Menu e utilidades
function toggleMenu() { document.getElementById('mainNav').classList.toggle('active'); }
function scrollToCalc() { document.querySelector('.calc-rapida').scrollIntoView({ behavior: 'smooth' }); }

// Animações
function animarContadores() {
    const counters = document.querySelectorAll('.number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const step = target / 125;
        let current = 0;
        const update = () => {
            current += step;
            if (current < target) { counter.textContent = Math.floor(current); requestAnimationFrame(update); }
            else { counter.textContent = target; }
        };
        update();
    });
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting && entry.target.classList.contains('social-proof')) animarContadores(); });
});

document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.querySelector('.social-proof'));
    document.querySelectorAll('.quantidade-select').forEach(s => atualizarPreco(s));
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
