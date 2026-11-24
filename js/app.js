// =========================================================================
// PENGATURAN DATA KOTA (Foto Ikon Kota Diambil Langsung dari Wikipedia API)
// =========================================================================
const DAFTAR_KOTA = [
  {
    id: 'jakarta',
    nama: 'DKI Jakarta',
    julukan: 'Ibu Kota & Wisata Modern',
    ikonWiki: 'Monumen Nasional',
    deskripsi: 'Pusat hiburan keluarga, taman rekreasi, museum sejarah, hingga wisata pantai di utara Jakarta.',
    wisata: [
      'Taman Impian Jaya Ancol',
      'Dunia Fantasi',
      'Taman Mini Indonesia Indah',
      'Monumen Nasional',
      'Kota Tua Jakarta',
      'Kebun Binatang Ragunan'
    ]
  },
  {
    id: 'bandung',
    nama: 'Bandung',
    julukan: 'Paris van Java',
    ikonWiki: 'Gedung Sate',
    deskripsi: 'Terkenal dengan wisata alam pegunungan yang sejuk, kawah vulkanik, dan bangunan bersejarah.',
    wisata: [
      'Kawah Putih',
      'Tangkuban Parahu',
      'Gedung Sate',
      'Jalan Braga',
      'Situ Patenggang',
      'Trans Studio Bandung'
    ]
  },
  {
    id: 'yogyakarta',
    nama: 'Yogyakarta',
    julukan: 'Kota Pelajar & Budaya',
    ikonWiki: 'Candi Prambanan',
    deskripsi: 'Kaya akan warisan budaya Jawa, keraton, candi megah, serta pantai selatan yang eksotis.',
    wisata: [
      'Candi Prambanan',
      'Keraton Ngayogyakarta Hadiningrat',
      'Jalan Malioboro',
      'Taman Sari Yogyakarta',
      'Pantai Parangtritis',
      'Tugu Yogyakarta'
    ]
  },
  {
    id: 'bali',
    nama: 'Bali',
    julukan: 'Pulau Dewata',
    ikonWiki: 'Tanah Lot',
    deskripsi: 'Destinasi kelas dunia dengan pantai pasir putih, pura di tepi tebing, dan persawahan terasering.',
    wisata: [
      'Pantai Kuta',
      'Tanah Lot',
      'Pura Luhur Uluwatu',
      'Garuda Wisnu Kencana',
      'Danau Batur',
      'Ubud'
    ]
  },
  {
    id: 'malang',
    nama: 'Malang & Batu',
    julukan: 'Kota Apel & Wisata Keluarga',
    ikonWiki: 'Gunung Bromo',
    deskripsi: 'Surga taman bermain modern, museum transportasi unik, dan gerbang menuju Gunung Bromo.',
    wisata: [
      'Jawa Timur Park 1',
      'Museum Angkut',
      'Gunung Bromo',
      'Coban Rondo',
      'Batu Night Spectacular',
      'Pantai Balekambang'
    ]
  }
];

// =========================================================================
// ELEMEN DOM
// =========================================================================
const cityMenuSection = document.getElementById('city-menu-section');
const cityMenuContainer = document.getElementById('city-menu-container');
const wisataSection = document.getElementById('wisata-section');
const wisataContainer = document.getElementById('wisata-container');
const activeCityTitle = document.getElementById('active-city-title');
const activeCityDesc = document.getElementById('active-city-desc');
const backToCitiesBtn = document.getElementById('back-to-cities-btn');
const brandHome = document.getElementById('brand-home');

const loadingEl = document.getElementById('loading');
const alertBox = document.getElementById('alert-box');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

let currentWisataList = [];
const detailModal = new bootstrap.Modal(document.getElementById('detailModal'));
const PLACEHOLDER_IMG = 'https://placehold.co/600x400/e9ecef/6c757d?text=Memuat+Foto...';

// =========================================================================
// 1. RENDER MENU PILIH KOTA (FOTO OTOMATIS DARI WIKIPEDIA PUBLIC API)
// =========================================================================
async function renderCityMenu() {
  cityMenuContainer.innerHTML = DAFTAR_KOTA.map((kota) => `
    <div class="col">
      <div class="card h-100 shadow-sm border-0 wisata-card overflow-hidden">
        <div class="position-relative">
          <img id="city-img-${kota.id}" src="${PLACEHOLDER_IMG}" class="w-100" style="height: 180px; object-fit: cover;" alt="${kota.nama}">
          <div class="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-50 p-2 d-flex justify-content-between align-items-center">
            <span class="badge bg-primary">${kota.wisata.length} Destinasi</span>
          </div>
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title fw-bold mb-1 mt-1">${kota.nama}</h5>
          <p class="text-primary small fw-semibold mb-2">${kota.julukan}</p>
          <p class="card-text text-muted small">${kota.deskripsi}</p>
          <button class="btn btn-primary btn-sm mt-auto pilih-kota-btn" data-city-id="${kota.id}">
            Lihat Wisata di ${kota.nama} →
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Ambil foto asli semua kota sekaligus lewat 1x fetch ke Wikipedia API
  const titles = DAFTAR_KOTA.map((k) => k.ikonWiki).join('|');
  const apiUrl = `https://id.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1&titles=${encodeURIComponent(titles)}&prop=pageimages&pithumbsize=600`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const data = await res.json();
    if (!data.query || !data.query.pages) return;

    const pages = Object.values(data.query.pages);
    DAFTAR_KOTA.forEach((kota) => {
      const match = pages.find((p) => p.title.toLowerCase() === kota.ikonWiki.toLowerCase());
      if (match && match.thumbnail) {
        const imgEl = document.getElementById(`city-img-${kota.id}`);
        if (imgEl) imgEl.src = match.thumbnail.source;
      }
    });
  } catch (err) {
    console.error('Gagal memuat foto sampul kota:', err);
  }
}

// Klik tombol pada Kartu Kota
cityMenuContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('pilih-kota-btn')) {
    const cityId = e.target.getAttribute('data-city-id');
    const kota = DAFTAR_KOTA.find((k) => k.id === cityId);
    if (kota) {
      openCityWisata(kota);
    }
  }
});

// =========================================================================
// 2. AMBIL DATA DARI WIKIPEDIA PUBLIC API (ASYNC/AWAIT)
// =========================================================================
async function openCityWisata(kota) {
  showWisataView(`📍 Tempat Wisata di ${kota.nama}`, kota.deskripsi);

  const titlesParam = kota.wisata.join('|');
  const apiUrl = `https://id.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1&titles=${encodeURIComponent(titlesParam)}&prop=pageimages|extracts|coordinates|info&inprop=url&pithumbsize=500&exintro=1&explaintext=1`;

  await executeFetch(apiUrl, `wisata di ${kota.nama}`, () => openCityWisata(kota));
}

async function searchWisata(keyword) {
  showWisataView(`🔍 Hasil Pencarian: "${keyword}"`, 'Menampilkan destinasi wisata dari Wikipedia Public API.');

  const apiUrl = `https://id.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodeURIComponent(keyword + ' wisata Indonesia')}&gsrlimit=9&prop=pageimages|extracts|coordinates|info&inprop=url&pithumbsize=500&exintro=1&explaintext=1`;

  await executeFetch(apiUrl, keyword, () => searchWisata(keyword));
}

async function executeFetch(apiUrl, label, retryCallback) {
  showLoading(true);
  hideAlert();
  wisataContainer.innerHTML = '';

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const data = await response.json();

    if (!data.query || !data.query.pages) {
      showAlert('warning', `Data untuk "<strong>${label}</strong>" tidak ditemukan.`);
      return;
    }

    currentWisataList = Object.values(data.query.pages).filter((p) => p.missing === undefined);

    if (currentWisataList.length === 0) {
      showAlert('warning', `Data untuk "<strong>${label}</strong>" tidak ditemukan.`);
      return;
    }

    renderWisataCards(currentWisataList);

  } catch (error) {
    console.error('Gagal mengambil data:', error);
    showAlert('danger', `Gagal terhubung ke Public API. Periksa koneksi internet Anda. <br><button id="retry-btn" class="btn btn-sm btn-outline-danger mt-2">Coba Lagi</button>`);
    document.getElementById('retry-btn')?.addEventListener('click', retryCallback);
  } finally {
    showLoading(false);
  }
}

// =========================================================================
// 3. RENDER CARD WISATA & MODAL DETAIL
// =========================================================================
function renderWisataCards(items) {
  wisataContainer.innerHTML = items.map((item) => {
    const imgUrl = item.thumbnail ? item.thumbnail.source : PLACEHOLDER_IMG;
    const deskripsi = item.extract || 'Penjelasan singkat belum tersedia.';
    const lokasiBadge = item.coordinates
      ? `<span class="badge bg-success-subtle text-success mb-2">📍 Koordinat Tersedia</span>`
      : `<span class="badge bg-secondary-subtle text-secondary mb-2">🗺️ Destinasi Indonesia</span>`;

    return `
      <div class="col">
        <div class="card h-100 shadow-sm border-0 wisata-card">
          <img src="${imgUrl}" class="card-img-top wisata-img" alt="${item.title}">
          <div class="card-body d-flex flex-column">
            <div>${lokasiBadge}</div>
            <h5 class="card-title fw-bold">${item.title}</h5>
            <p class="card-text text-muted small wisata-desc">${deskripsi}</p>
            <button class="btn btn-outline-primary btn-sm mt-auto detail-btn" data-id="${item.pageid}">
              Lihat Detail & Lokasi
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

wisataContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('detail-btn')) {
    const pageId = Number(e.target.getAttribute('data-id'));
    const selected = currentWisataList.find((item) => item.pageid === pageId);
    if (selected) openDetailModal(selected);
  }
});

function openDetailModal(item) {
  const imgUrl = item.thumbnail ? item.thumbnail.source : PLACEHOLDER_IMG;
  const mapsBtn = document.getElementById('modal-maps-btn');
  const wikiBtn = document.getElementById('modal-wiki-btn');

  document.getElementById('modal-title').textContent = item.title;
  wikiBtn.href = item.fullurl;

  let lokasiInfo = '<p class="text-muted small mb-3">📍 Lokasi: Indonesia</p>';
  if (item.coordinates && item.coordinates.length > 0) {
    const { lat, lon } = item.coordinates[0];
    lokasiInfo = `<p class="text-success small fw-semibold mb-3">📍 Koordinat Lokasi: ${lat.toFixed(4)}, ${lon.toFixed(4)}</p>`;
    mapsBtn.href = `https://www.google.com/maps?q=${lat},${lon}`;
    mapsBtn.classList.remove('d-none');
  } else {
    mapsBtn.classList.add('d-none');
  }

  document.getElementById('modal-body').innerHTML = `
    <img src="${imgUrl}" class="img-fluid rounded mb-3 w-100" style="max-height: 320px; object-fit: cover;" alt="${item.title}">
    ${lokasiInfo}
    <h6 class="fw-bold">Penjelasan Tempat Wisata</h6>
    <p style="white-space: pre-line;">${item.extract || 'Penjelasan lengkap tersedia di Wikipedia.'}</p>
  `;

  detailModal.show();
}

// =========================================================================
// 4. NAVIGASI TAMPILAN & HELPER
// =========================================================================
function showCityMenu() {
  wisataSection.classList.add('d-none');
  cityMenuSection.classList.remove('d-none');
  searchInput.value = '';
}

function showWisataView(title, desc) {
  cityMenuSection.classList.add('d-none');
  wisataSection.classList.remove('d-none');
  activeCityTitle.textContent = title;
  activeCityDesc.textContent = desc;
}

function showLoading(isLoading) {
  loadingEl.classList.toggle('d-none', !isLoading);
}

function showAlert(type, message) {
  alertBox.className = `alert alert-${type} text-center`;
  alertBox.innerHTML = message;
  alertBox.classList.remove('d-none');
}

function hideAlert() {
  alertBox.classList.add('d-none');
}

backToCitiesBtn.addEventListener('click', showCityMenu);
brandHome.addEventListener('click', (e) => {
  e.preventDefault();
  showCityMenu();
});

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) searchWisata(query);
});

renderCityMenu();
