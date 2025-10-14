// ========== CARRINHO DE COMPRAS ==========

let cart = JSON.parse(localStorage.getItem('vidalCart')) || [];

// Atualizar contador do carrinho
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountEl = document.querySelector('.cart-count');
  if (cartCountEl) cartCountEl.textContent = count;
}

// Adicionar item ao carrinho
function addToCart(name, price, quantity = 1) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) existingItem.quantity += quantity;
  else cart.push({ name, price: parseFloat(price), quantity });

  localStorage.setItem('vidalCart', JSON.stringify(cart));
  updateCartCount();
  renderCart();

  const cartIcon = document.querySelector('.cart-icon');
  if (cartIcon) {
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => { cartIcon.style.transform = 'scale(1)'; }, 300);
  }
}

// Remover item do carrinho
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('vidalCart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// Renderizar carrinho
function renderCart() {
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  if (!cartItemsEl || !cartTotalEl) return;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-cart" style="font-size:3rem;margin-bottom:1rem;opacity:0.3;"></i><p>Seu carrinho está vazio</p></div>';
    cartTotalEl.textContent = 'R$ 0,00';
    return;
  }

  let total = 0;
  let html = '';
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    html += `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>Qtd: ${item.quantity} × ${formatBRL(item.price)}</p>
          <p class="cart-item-price">${formatBRL(itemTotal)}</p>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${index})"><i class="fas fa-trash"></i></button>
      </div>
    `;
  });

  cartItemsEl.innerHTML = html;
  cartTotalEl.textContent = formatBRL(total);
}

// Formatar moeda BRL
function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Toggle carrinho lateral
function toggleCart(forceOpen = false) {
  const sidebar = document.getElementById('cartSidebar');
  if (!sidebar) return;
  if (forceOpen) sidebar.classList.add('open');
  else sidebar.classList.toggle('open');
}

// Gerar PDF (via impressão)
function generatePDF() {
  if (cart.length === 0) { alert('Seu carrinho está vazio!'); return; }

  let total = 0;
  let itemsHTML = '';
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    itemsHTML += `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #ddd;">${item.name}</td>
        <td style="padding:8px;border-bottom:1px solid #ddd;text-align:center;">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #ddd;text-align:right;">${formatBRL(item.price)}</td>
        <td style="padding:8px;border-bottom:1px solid #ddd;text-align:right;">${formatBRL(itemTotal)}</td>
      </tr>
    `;
  });

  const pdfWindow = window.open('', '_blank');
  pdfWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Orçamento - Vidal Design Solutions</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { color: #2563eb; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #2563eb; color: white; padding: 10px; text-align: left; }
        .total { font-size: 1.5rem; font-weight: bold; color: #2563eb; text-align: right; margin-top: 20px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; }
        .footer p { margin: 5px 0; }
      </style>
    </head>
    <body>
      <h1>Vidal Design Solutions</h1>
      <h2>Orçamento</h2>
      <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>

      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th style="text-align:center;">Quantidade</th>
            <th style="text-align:right;">Preço Unit.</th>
            <th style="text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <div class="total">TOTAL: ${formatBRL(total)}</div>

      <div class="footer">
        <h3>Contato</h3>
        <p><strong>WhatsApp:</strong> +55 (11) 96864-9673</p>
        <p><strong>E-mail:</strong> vidaldesignsolutions@gmail.com</p>
        <p><strong>Endereço:</strong> Rua Antonio Cordeiro, 57 – CEP 08715-470</p>
        <p><strong>Google:</strong> https://share.google/Tx0IXgmBnEP4UI1g0</p>
      </div>

      <script>window.onload = function() { window.print(); }</script>
    </body>
    </html>
  `);
  pdfWindow.document.close();
}

// Enviar pelo WhatsApp
function sendWhatsApp() {
  if (cart.length === 0) { alert('Seu carrinho está vazio!'); return; }

  let total = 0;
  let message = '*Olá! Gostaria de fazer um orçamento:*%0A%0A';
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    message += `▪️ *${item.name}*%0A`;
    message += `   Qtd: ${item.quantity} × ${formatBRL(item.price)} = ${formatBRL(itemTotal)}%0A%0A`;
  });
  message += `*TOTAL: ${formatBRL(total)}*%0A%0A`;
  message += `Aguardo retorno! 😊`;

  const whatsappURL = `https://wa.me/5511968649673?text=${message}`;
  window.open(whatsappURL, '_blank');
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
  renderCart();

  // Fechar carrinho ao clicar fora
  document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('cartSidebar');
    const cartIcon = document.querySelector('.cart-icon');
    if (sidebar && sidebar.classList.contains('open')) {
      if (!sidebar.contains(e.target) && !cartIcon?.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    }
  });
});
