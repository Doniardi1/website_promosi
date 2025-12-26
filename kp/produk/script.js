// Filter & Search (produk)
  const filterButtons = document.querySelectorAll('[data-filter]');
  const searchInput = document.getElementById('searchInput');
  const navSearch = document.getElementById('navSearch');
  const productCards = document.querySelectorAll('#productGrid > .col-6, #productGrid > .col-6.col-md-4, #productGrid > .col-6.col-md-4.col-lg-3, #productGrid > .col-6.col-md-4.col-lg-3');

  // Normalize product card selection
  function allProductCards() {
    return Array.from(document.querySelectorAll('#productGrid .col-6, #productGrid .col-12, #productGrid .col-4, #productGrid .col-3, #productGrid [data-category]'));
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      applyFilterAndSearch(filter, searchInput.value.trim().toLowerCase());
    });
  });

  navSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') e.preventDefault();
  });

  searchInput.addEventListener('input', () => {
    const activeFilter = document.querySelector('[data-filter].active').getAttribute('data-filter');
    applyFilterAndSearch(activeFilter, searchInput.value.trim().toLowerCase());
  });

  function applyFilterAndSearch(filter, search) {
    const cards = allProductCards();
    cards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const titleEl = card.querySelector('.card-title');
      const title = titleEl ? titleEl.textContent.toLowerCase() : '';
      const matchFilter = (filter === 'all' || category === filter);
      const matchSearch = title.includes(search);
      card.style.display = (matchFilter && matchSearch) ? 'block' : 'none';
    });
  }
  // Keranjang & Checkout
  let cart = [];

  const cartBtn = document.getElementById('openCart');
  const cartCount = document.getElementById('cartCount');
  const cartModal = document.getElementById('cartModal');
  const closeCart = document.getElementById('closeCart');
  const cartItems = document.getElementById('cartItems');
  const totalHarga = document.getElementById('totalHarga');
  const checkoutWA = document.getElementById('checkoutWA');

  // Tambah ke keranjang (dari tombol produk)
  document.querySelectorAll('.addToCart').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price);

      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ name, price, qty: 1 });
      }

      updateCart();
      // Optional: tunjukkan modal sebentar / atau animasi kecil
      // cartModal.style.display = "flex";
    });
  });

  function updateCart() {
    cartCount.textContent = cart.length;
    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
      total += item.price * item.qty;

      // setiap item row
      const row = document.createElement('div');
      row.className = 'd-flex justify-content-between align-items-center mb-3';

      const left = document.createElement('div');
      left.innerHTML = `<strong>${item.name}</strong><br><small>Rp ${item.price.toLocaleString()}</small>`;

      const center = document.createElement('div');
      center.className = 'd-flex align-items-center';
      // tombol kurang
      const btnMinus = document.createElement('button');
      btnMinus.className = 'btn btn-sm btn-outline-danger';
      btnMinus.textContent = '−';
      btnMinus.style.width = '34px';
      btnMinus.style.height = '34px';
      btnMinus.addEventListener('click', () => {
        kurangi(index);
      });

      // qty display
      const qtySpan = document.createElement('span');
      qtySpan.className = 'mx-2 fw-bold';
      qtySpan.textContent = item.qty;

      // tombol tambah
      const btnPlus = document.createElement('button');
      btnPlus.className = 'btn btn-sm btn-outline-primary';
      btnPlus.textContent = '+';
      btnPlus.style.width = '34px';
      btnPlus.style.height = '34px';
      btnPlus.addEventListener('click', () => {
        tambah(index);
      });

      center.appendChild(btnMinus);
      center.appendChild(qtySpan);
      center.appendChild(btnPlus);

      const right = document.createElement('div');
      right.style.minWidth = '90px';
      right.style.textAlign = 'right';
      right.innerHTML = `<strong>Rp ${(item.price * item.qty).toLocaleString()}</strong>`;

      row.appendChild(left);
      row.appendChild(center);
      row.appendChild(right);

      cartItems.appendChild(row);
    });

    totalHarga.textContent = total.toLocaleString();
  }

  function tambah(i) {
    if (!cart[i]) return;
    cart[i].qty++;
    updateCart();
  }

  function kurangi(i) {
    if (!cart[i]) return;
    cart[i].qty--;
    if (cart[i].qty <= 0) {
      cart.splice(i, 1);
    }
    updateCart();
  }

  // buka/tutup modal
  cartBtn.addEventListener('click', () => {
    cartModal.style.display = "flex";
  });
  closeCart.addEventListener('click', () => {
    cartModal.style.display = "none";
  });

  // close modal by clicking outside box
  cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) cartModal.style.display = "none";
  });

  // Checkout ke WhatsApp
  checkoutWA.addEventListener('click', () => {
    if (cart.length === 0) return alert("Keranjang kosong!");

    const buyerName = document.getElementById("buyerName").value.trim();
    if (buyerName === "") return alert("Mohon isi nama pembeli.");

    let pesan = `Atas Nama: ${buyerName}%0A%0APesanan:%0A`;

    cart.forEach(item => {
      pesan += `• ${item.name} x${item.qty} = Rp ${(item.price * item.qty).toLocaleString()}%0A`;
    });

    pesan += `%0ATotal: Rp ${totalHarga.textContent}%0A`;
    pesan += "%0ATerima kasih.";

    const nomorWA = "6281234567890"; // <-- GANTI NOMOR WA DI SINI (format: 62812xxxx)

    // Buka chat WA
    window.open(`https://wa.me/${nomorWA}?text=${pesan}`, "_blank");
  });

  // initial update (kosong)
  updateCart();