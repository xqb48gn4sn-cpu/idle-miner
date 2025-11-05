// Prosty idle clicker
let coins = 0;
let cps = 0; // coins per second
const coinsEl = document.getElementById('coins');
const cpsEl = document.getElementById('cps');
const mineBtn = document.getElementById('mineBtn');
const upgrades = Array.from(document.querySelectorAll('.upgrade'));

// Load saved
const saved = JSON.parse(localStorage.getItem('idleminer_v1') || '{}');
if (saved.coins) coins = saved.coins;
if (saved.cps) cps = saved.cps;
render();

mineBtn.addEventListener('click', () => {
  coins += 1;
  render();
});

upgrades.forEach(el => {
  const cost = parseFloat(el.dataset.cost);
  const add = parseFloat(el.dataset.cps);
  const buyBtn = el.querySelector('.buy');
  buyBtn.addEventListener('click', () => {
    if (coins >= cost) {
      coins -= cost;
      cps += add;
      // increase cost by 20% (simple economy)
      const newCost = Math.ceil(cost * 1.2);
      el.dataset.cost = newCost;
      el.querySelector('.cost').textContent = newCost;
      render();
      save();
    } else {
      // optional: flash red
      el.style.animation = 'shake .3s';
      setTimeout(()=> el.style.animation='', 300);
    }
  });
});

// income ticker
setInterval(()=>{
  coins += cps;
  render();
}, 1000);

// save periodically
setInterval(save, 5000);

function render(){
  coinsEl.textContent = Math.floor(coins);
  cpsEl.textContent = Math.round(cps*100)/100;
}

function save(){
  localStorage.setItem('idleminer_v1', JSON.stringify({coins, cps}));
}

/* Simple consent/banner logic */
const consentKey = 'idleminer_consent';
const consent = localStorage.getItem(consentKey);
const consentBanner = document.getElementById('consent-banner');
const acceptBtn = document.getElementById('accept-consent');
const declineBtn = document.getElementById('decline-consent');

if (!consent) {
  consentBanner.classList.remove('hidden');
} else if (consent === 'yes') {
  loadAdsIfPresent();
}

acceptBtn?.addEventListener('click', () => {
  localStorage.setItem(consentKey, 'yes');
  consentBanner.classList.add('hidden');
  loadAdsIfPresent();
});
declineBtn?.addEventListener('click', () => {
  localStorage.setItem(consentKey, 'no');
  consentBanner.classList.add('hidden');
});

function loadAdsIfPresent(){
  // Jeśli w index.html wkleisz kod AdSense (przykład w komentarzu),
  // to powyżej wystarczy uruchomić reklamy - AdSense automatycznie spróbuje się załadować.
  // TUTAJ możesz też dynamicznie wstrzyknąć skrypt adsbygoogle, jeśli chcesz.
  // Przykłnik jak by to wyglądało (tylko przykład - nie wklejaj kluczy tu):
  // let s = document.createElement('script');
  // s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  // s.async = true;
  // s.onload = () => (adsbygoogle=window.adsbygoogle||[]).push({});
  // document.head.appendChild(s);
}
