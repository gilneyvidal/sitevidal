// Dados de preços (ajuste conforme sua margem de 100% sobre a FuturaIM)
const precos = {
    'cartao-fosco': {
        100: 89,
        250: 149,
        500: 219,
        1000: 349
    },
    'cartao-brilho': {
        100: 59,
        250: 99,
        500: 159,
        1000: 249
    },
    'panfleto': {
        500: 129,
        1000: 199,
        2500: 349,
        5000: 549
    },
    'panfleto-duplo': {
        500: 179,
        1000: 279,
        2500: 499,
        5000: 799
    }
};

// Calculadora Rápida do Hero
function calcularRapido() {
    const produto = document.getElementById('produto-rapido').value;
    const quantidade = parseInt(document.getElementById('quantidade-rapida').value);
    const resultadoDiv = document.getElementById('resultado-rapido');
    
    if (!produto || !quantidade) {
        alert('Por favor, selecione um produto e digite a quantidade.');
        return;
    }
    
    // Lógica simplificada para demonstração
    let precoUnitario = 0;
    let produtoNome = '';
    
    switch(produto) {
        case 'cartao-fosco':
            precoUnitario = 0.89;
            produtoNome = 'Cartão Fosco Premium';
            break;
        case 'cartao-brilho':
            precoUnitario = 0.59;
            produtoNome = 'Cartão Brilho Econômico';
            break;
        case 'panfleto':
            precoUnitario = 0.26;
            produtoNome = 'Panfleto Colorido';
            break;
        case 'brindes':
            resultadoDiv.innerHTML = `
                <strong>Brindes Personalizados</strong><br>
                Preço sob consulta.<br>
                <a href="https://wa.me/5511999999999?text=Olá! Quero orçamento de brindes personalizados." 
                   target="_blank" style="color: white; text-decoration: underline;">
                   Clique para consultar no WhatsApp
                </a>
            `;
            resultadoDiv.classList.add('show');
            return;
    }
    
    const total = (quantidade * precoUnitario).toFixed(2);
    const prazo = produto.includes('cartao') ? '5 dias úteis' : '5 dias úteis';
    
    resultadoDiv.innerHTML = `
        <strong>${produtoNome}</strong><br>
        ${quantidade} unidades: <span style="font-size: 24px; font-weight: 900;">R$ ${total}</span><br>
        <small>Entrega em ${prazo} (2 dias antes do mercado!)</small><br>
        <a href="https://wa.me/5511999999999?text=Olá! Quero fazer pedido de ${produtoNome}, ${quantidade} unidades. Valor: R$ ${total}" 
           target="_blank" style="color: white; text-decoration: underline; font-weight: 700;">
           <i class="fab fa-whatsapp"></i> Confirmar Pedido no WhatsApp
        </a>
    `;
    resultadoDiv.classList.add('show');
}

// Fazer Pedido (nos cards de produto)
function fazerPedido(nomeProduto, elemento) {
    const card = elemento.closest('.produto-card');
    const select = card.querySelector('.quantidade-select');
    const opcao = select.options[select.selectedIndex].text;
    
    const mensagem = `Olá! Quero fazer pedido de ${nomeProduto}, ${opcao}. Pode confirmar?`;
    const url = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`;
    
    window.open(url, '_blank');
}

// Consultar Brindes
function consultarBrindes() {
    const mensagem = `Olá! Vi no site que vocês trabalham com brindes personalizados. Pode me enviar o catálogo completo?`;
    const url = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Avise-me (produtos futuros)
function aviseMe(produto) {
    const email = prompt(`Deixe seu WhatsApp ou e-mail. Avisaremos quando ${produto} estiver disponível:`);
    if (email) {
        alert(`Obrigado! Entraremos em contato em breve sobre ${produto}.`);
        // Aqui você pode integrar com seu sistema de captura de leads
    }
}

// Pedir Orçamento de Toldo
function pedirOrcamentoToldo() {
    const mensagem = `Olá! Preciso de orçamento para toldo/fachada. Pode me ajudar?`;
    const url = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Scroll para calculadora
function scrollToCalc() {
    document.querySelector('.calc-rapida').scrollIntoView({ behavior: 'smooth' });
}

// Animações ao scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Contadores animados (efeito visual)
function animarContadores() {
    const counters = document.querySelectorAll('.number');
    counters.forEach(counter => {
        const target = counter.innerText;
        if (target.includes('+')) {
            // Animação simples para números
            counter.style.opacity = '0';
            setTimeout(() => {
                counter.style.transition = 'opacity 1s';
                counter.style.opacity = '1';
            }, 100);
        }
    });
}

// Disparar animações quando visíveis
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animarContadores();
        }
    });
});

observer.observe(document.querySelector('.social-proof'));

console.log('Vidal Design Solutions - Site carregado com sucesso!');
