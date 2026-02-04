// Dados de preços - EXATAMENTE conforme fornecedores (sem menção aos nomes)
const precos = {
    // Papelaria (quantidades fixas)
    'cartao-fosco': { 100: 89, 250: 149, 500: 219, 1000: 349 },
    'cartao-brilho': { 100: 59, 250: 99, 500: 159, 1000: 249 },
    'panfleto-frente': { 500: 129, 1000: 199, 2500: 349, 5000: 549 },
    'panfleto-duplo': { 500: 179, 1000: 279, 2500: 499, 5000: 799 },
    'camiseta-dry': { 1: 45, 5: 199, 10: 349, 20: 599 },
    'camiseta-algodao': { 1: 39, 5: 175, 10: 299, 20: 499 },
    'dtf-a4': { 1: 24, 5: 99, 10: 179, 20: 299 },
    
    // Sinalização (por m² ou metro)
    'lona-440': { m2: 67.80 },
    'adesivo-recorte': { metro: 70.00 },
    'adesivo-impresso': { m2: 79.80 },
    'acm': { m2: 180.00 },
    
    // Toldos (por m²)
    'toldo-cortina': { m2: 340.00 },
    'toldo-retratil': { m2: 520.00 }
};

// Nomes amigáveis
const nomesProdutos = {
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
    if (display) {
        display.textContent = `R$ ${preco},00`;
    }
}

// Calculadora Rápida - SEMPRE arredonda para cima para a quantidade válida mais próxima
function calcularRapido() {
    const produto = document.getElementById('produto-rapido').value;
    const quantidade = parseFloat(document.getElementById('quantidade-rapida').value);
    const resultadoDiv = document.getElementById('resultado-rapido');
    
    if (!produto || !quantidade || quantidade <= 0) {
        alert('Por favor, selecione um produto e digite uma quantidade válida.');
        return;
    }
    
    let nomeProduto = nomesProdutos[produto] || produto;
    let mensagem = '';
    let total = 0;
    
    // Verificar se é produto por m²/metro ou por quantidade fixa
    if (precos[produto].m2) {
        // Produto por m²
        total = (quantidade * precos[produto].m2).toFixed(2);
        mensagem = `
            <strong>${nomeProduto}</strong><br>
            Área: ${quantidade} m²<br>
            <span style="font-size: 28px; font-weight: 900;">R$ ${total}</span><br>
            <small>R$ ${precos[produto].m2}/m²</small>
        `;
    } else if (precos[produto].metro) {
        // Produto por metro linear
        total = (quantidade * precos[produto].metro).toFixed(2);
        mensagem = `
            <strong>${nomeProduto}</strong><br>
            ${quantidade} metros<br>
            <span style="font-size: 28px; font-weight: 900;">R$ ${total}</span><br>
            <small>R$ ${precos[produto].metro}/m</small>
        `;
    } else {
        // Produto com quantidades fixas - ARREDONDAR PARA CIMA
        const quantidades = Object.keys(precos[produto]).map(Number).sort((a,b) => a-b);
        let quantidadeSelecionada = quantidades[quantidades.length - 1];
        
        for (let q of quantidades) {
            if (q >= quantidade) {
                quantidadeSelecionada = q;
                break;
            }
        }
        
        total = precos[produto][quantidadeSelecionada];
        const precoUnitario = (total / quantidadeSelecionada).toFixed(2);
        
        mensagem = `
            <strong>${nomeProduto}</strong><br>
            <small>Você pediu: ${quantidade} un → Quantidade válida: ${quantidadeSelecionada} un</small><br>
            <span style="font-size: 28px; font-weight: 900;">R$ ${total},00</span><br>
            <small>~ R$ ${precoUnitario} por unidade</small>
        `;
    }
    
    // Adicionar botões de WhatsApp
    mensagem += `
        <div style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
            <a href="https://wa.me/5511968649673?text=Olá! Quero fazer pedido de ${encodeURIComponent(nomeProduto)}, quantidade: ${quantidade}. Valor: R$ ${total}" 
               target="_blank" style="flex: 1; min-width: 140px; background: white; color: #25d366; padding: 10px; border-radius: 25px; text-decoration: none; font-weight: 700; text-align: center;">
                <i class="fab fa-whatsapp"></i> Gilney
            </a>
            <a href="https://wa.me/5511949141803?text=Olá! Quero fazer pedido de ${encodeURIComponent(nomeProduto)}, quantidade: ${quantidade}. Valor: R$ ${total}" 
               target="_blank" style="flex: 1; min-width: 140px; background: white; color: #25d366; padding: 10px; border-radius: 25px; text-decoration: none; font-weight: 700; text-align: center;">
                <i class="fab fa-whatsapp"></i> Elisete
            </a>
        </div>
    `;
    
    resultadoDiv.innerHTML = mensagem;
    resultadoDiv.classList.add('show');
    resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Cálculo M2 para cards
function calcularM2(btn, nomeProduto, precoM2) {
    const card = btn.closest('.produto-card');
    const largura = parseFloat(card.querySelector('.largura').value);
    const altura = parseFloat(card.querySelector('.altura').value);
    
    if (!largura || !altura || largura <= 0 || altura <= 0) {
        alert('Por favor, preencha largura e altura válidas.');
        return;
    }
    
    const area = (largura * altura).toFixed(2);
    const total = (area * precoM2).toFixed(2);
    
    const escolha = confirm(`Área: ${area} m²\nTotal: R$ ${total}\n\nDeseja falar com Gilney (OK) ou Elisete (Cancelar)?`);
    const numero = escolha ? '5511968649673' : '5511949141803';
    const atendente = escolha ? 'Gilney' : 'Elisete';
    
    const mensagem = `Olá ${atendente}! Quero orçamento de ${nomeProduto}. Medidas: ${largura}m x ${altura}m = ${area}m². Valor: R$ ${total}`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, '_blank');
}

// Cálculo Linear
function calcularLinear(btn, nomeProduto, precoMetro) {
    const card = btn.closest('.produto-card');
    const metros = parseFloat(card.querySelector('.metros').value);
    
    if (!metros || metros <= 0) {
        alert('Por favor, preencha os metros válidos.');
        return;
    }
    
    const total = (metros * precoMetro).toFixed(2);
    
    const escolha = confirm(`Total: ${metros}m x R$ ${precoMetro} = R$ ${total}\n\nDeseja falar com Gilney (OK) ou Elisete (Cancelar)?`);
    const numero = escolha ? '5511968649673' : '5511949141803';
    const atendente = escolha ? 'Gilney' : 'Elisete';
    
    const mensagem = `Olá ${atendente}! Quero orçamento de ${nomeProduto}. Metros: ${metros}m. Valor: R$ ${total}`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, '_blank');
}

// Pedido padrão
function fazerPedido(nomeProduto, elemento) {
    const card = elemento.closest('.produto-card');
    const select = card.querySelector('.quantidade-select');
    const opcao = select.options[select.selectedIndex];
    const quantidade = opcao.value;
    const preco = opcao.getAttribute('data-preco');
    
    const escolha = confirm(`Deseja falar com Gilney (OK) ou Elisete (Cancelar)?`);
    const numero = escolha ? '5511968649673' : '5511949141803';
    const atendente = escolha ? 'Gilney' : 'Elisete';
    
    const mensagem = `Olá ${atendente}! Quero fazer pedido de ${nomeProduto}, ${quantidade} unidades por R$ ${preco},00.`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, '_blank');
}

// Menu mobile
function toggleMenu() {
    document.getElementById('mainNav').classList.toggle('active');
}

// Scroll para calculadora
function scrollToCalc() {
    document.querySelector('.calc-rapida').scrollIntoView({ behavior: 'smooth' });
}

// Contador de visitas simulado
function atualizarContador() {
    const contador = document.getElementById('visitCount');
    let visitas = parseInt(localStorage.getItem('visitasVidal') || '1247');
    
    // Incrementa aleatoriamente durante o dia
    setInterval(() => {
        if (Math.random() > 0.7) {
            visitas++;
            contador.textContent = visitas.toLocaleString();
            localStorage.setItem('visitasVidal', visitas);
        }
    }, 30000); // A cada 30 segundos
    
    contador.textContent = visitas.toLocaleString();
}

// Animação de números
function animarContadores() {
    const counters = document.querySelectorAll('.number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const update = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        };
        update();
    });
}

// Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('social-proof')) {
                animarContadores();
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.querySelector('.social-proof'));
    atualizarContador();
    
    // Inicializar preços
    document.querySelectorAll('.quantidade-select').forEach(select => {
        atualizarPreco(select);
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

console.log('Vidal Design Solutions - Site carregado!');
console.log('Horário: Seg-Sex 8h-18h, Sáb 9h-13h');
