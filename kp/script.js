const journeyTabs = document.querySelectorAll(".journey-tabs span");
  const journeyDesc = document.querySelector(".journey-desc");

  const journeyData = {
    future: "Erigo berencana memperluas pasar internasional, meningkatkan kualitas produksi, serta membuka flagship store di berbagai negara.",
    now: "Erigo kini menjadi salah satu brand fashion terbesar di Indonesia dengan jutaan pelanggan dan penjualan stabil setiap bulannya.",
    "2022": "Tahun 2022, Erigo tampil di New York Fashion Week dan mendapatkan perhatian global dari berbagai media internasional.",
    "2019": "Pada 2019, Erigo mengalami pertumbuhan besar berkat viral di media sosial dan kolaborasi dengan influencer terkenal."
  };

  journeyTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      
      // Hilangkan active dari semua tab
      journeyTabs.forEach(t => t.classList.remove("active"));
      
      // Tambahkan active ke tab yang diklik
      tab.classList.add("active");
      
      // Ambil tahun dari atribut data-year
      const year = tab.getAttribute("data-year");
      
      // Ganti cerita sesuai tahun
      journeyDesc.textContent = journeyData[year];
    });
  });