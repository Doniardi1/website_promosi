// ===============================
// FILTER & SEARCH PRODUK
// ===============================
const filterButtons = document.querySelectorAll('[data-filter]');
const searchInput = document.getElementById('searchInput');

function getProductCards() {
  return document.querySelectorAll('#productGrid > div[data-category]');
}

// Klik tombol filter
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    applyFilter(btn.dataset.filter, searchInput.value.toLowerCase());
  });
});

// Search input
searchInput.addEventListener('input', () => {
  const activeBtn = document.querySelector('[data-filter].active');
  const activeFilter = activeBtn ? activeBtn.dataset.filter : 'all';

  applyFilter(activeFilter, searchInput.value.toLowerCase());
});

function applyFilter(filter, search) {
  getProductCards().forEach(card => {
    const category = card.dataset.category;
    const titleEl = card.querySelector('.card-title');

    if (!titleEl) {
      card.classList.add('d-none');
      return;
    }

    const title = titleEl.textContent.toLowerCase();

    const show =
      (filter === 'all' || category === filter) &&
      title.includes(search);

    card.classList.toggle('d-none', !show);
  });
}

// ===============================
// KERANJANG BELANJA
// ===============================
let cart = [];
const ONGKIR_PETI = 150000;

// Elemen cart
const cartBtn = document.getElementById("openCart");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const totalHarga = document.getElementById("totalHarga");
const ongkirHarga = document.getElementById("ongkirHarga");
const ongkirText = document.getElementById("ongkirText");
const alamatInput = document.getElementById("buyerAddress");
const alamatLabel = document.getElementById("alamatLabel");

// ===============================
// TAMBAH KE KERANJANG
// ===============================
document.querySelectorAll(".addToCart").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price);
    const category = btn.dataset.category;

    const item = cart.find(i => i.name === name);
    if (item) {
      item.qty++;
    } else {
      cart.push({ name, price, qty: 1, category });
    }
    updateCart();
  });
});

function updateCart() {
  cartItems.innerHTML = "";
  cartCount.textContent = cart.reduce((s, i) => s + i.qty, 0);

  let total = 0;
  let adaPeti = false;

  cart.forEach((item, i) => {
    total += item.price * item.qty;
    if (item.category === "peti") adaPeti = true;

    const row = document.createElement("div");
    row.className = "d-flex justify-content-between align-items-center mb-2";

    row.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        <small>Rp ${item.price.toLocaleString()}</small>
      </div>
      <div>
        <button class="btn btn-sm btn-outline-danger" onclick="kurangi(${i})">−</button>
        <span class="mx-2">${item.qty}</span>
        <button class="btn btn-sm btn-outline-primary" onclick="tambah(${i})">+</button>
      </div>
    `;
    cartItems.appendChild(row);
  });

  // Ongkir peti
  if (adaPeti) {
    ongkirText.classList.remove("d-none");
    alamatInput.classList.remove("d-none");
    alamatLabel.classList.remove("d-none");

    ongkirHarga.textContent = ONGKIR_PETI.toLocaleString();
    total += ONGKIR_PETI;
  } else {
    ongkirText.classList.add("d-none");
    alamatInput.classList.add("d-none");
    alamatLabel.classList.add("d-none");
    alamatInput.value = "";
  }

  totalHarga.textContent = total.toLocaleString();
}

function tambah(i) {
  cart[i].qty++;
  updateCart();
}

function kurangi(i) {
  cart[i].qty--;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  updateCart();
}

// ===============================
// MODAL KERANJANG
// ===============================
cartBtn.onclick = () => cartModal.style.display = "flex";
closeCart.onclick = () => cartModal.style.display = "none";
cartModal.onclick = e => {
  if (e.target === cartModal) cartModal.style.display = "none";
};

// ===============================
// CHECKOUT WHATSAPP
// ===============================
document.getElementById("checkoutWA").addEventListener("click", () => {
  if (cart.length === 0) return alert("Keranjang kosong!");

  const name = document.getElementById("buyerName").value.trim();
  if (!name) return alert("Nama pembeli wajib diisi");

  const adaPeti = cart.some(i => i.category === "peti");
  const address = alamatInput.value.trim();

  if (adaPeti && !address.startsWith("http")) {
    return alert("Masukkan link Google Maps yang valid!");
  }

  let pesan = `Atas Nama: ${name}%0A%0APesanan:%0A`;

  cart.forEach(i => {
    pesan += `• ${i.name} x${i.qty} = Rp ${(i.price * i.qty).toLocaleString()}%0A`;
  });

  if (adaPeti) {
    pesan += `%0AAlamat (Google Maps):%0A${address}%0A`;
    pesan += `Ongkir Peti: Rp ${ONGKIR_PETI.toLocaleString()}%0A`;
  }

  pesan += `%0ATotal Bayar: Rp ${totalHarga.textContent}%0A`;
  pesan += `%0ATerima kasih`;

  const nomorWA = "6281234567890"; // GANTI NOMOR ADMIN
  window.open(`https://wa.me/${nomorWA}?text=${pesan}`, "_blank");
});

// INIT
applyFilter('all', '');
updateCart();
