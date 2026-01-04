const journeyTabs = document.querySelectorAll(".journey-tabs span");
  const journeyDesc = document.querySelector(".journey-desc");

  const journeyData = {
    future: "kios Nyah Seger nusukan akan mencoba ingin membuka lagi kios baru di tempat lain nantikan kios kami nantinya.",
    now: "Kios Nyah seget nusukan akan mencoba menjadi labih baik lagi dan akan menjual bunga dengan kualitas yang maksimal.",
    "2022": "Tahun 2022, kios ini berpindah kepemilikan dan akhirnya kios dijual.",
    "2019": "Pada 2019,kios ini berubah dari yang menjual agar agar menjadi sembako."
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
