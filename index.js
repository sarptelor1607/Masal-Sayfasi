// =========================================
//   MASAL VERİLERİ
//   Yeni masal eklemek için buraya kopyala:
//   { id, title, icon, coverColor, content }
// =========================================
const STORIES = [
    {
        id: 1,
        title: "Sarp, Ece ve Ay Işığı Ormanı",
        icon: "🌙",
        coverColor: "#1a0a3e",
        content: `

Bir zamanlar, tepelerle çevrili sakin bir kasabada Sarp adında genç bir delikanlı yaşardı. Açık tenli, kumral saçlı ve meraklı bakışlara sahipti. Geceleri gökyüzünü izlemeyi çok severdi; çünkü yıldızların her birinin içinde saklı bir hikâye olduğuna inanırdı.

En yakın dostu ise küçük ve neşeli evcil hayvanı Sushi idi. Sushi her zaman maceraya hazırdı ve çoğu zaman Sarp’ı beklenmedik yolculuklara sürüklerdi.

Bir gece gökyüzündeki yıldızlar her zamankinden daha parlak görünüyordu. Sarp bunu fark ettiğinde içinde tuhaf ama güzel bir his uyandı.

Tam o sırada Sushi pencerenin önüne atladı ve heyecanla dışarıyı işaret eder gibi baktı.

“Anlaşılan bir macera bizi çağırıyor,” dedi Sarp gülümseyerek.

Sarp paltosunu giydi ve Sushi ile birlikte dışarı çıktı. Gökyüzündeki en parlak yıldızın gösterdiği yönde yürümeye başladılar.

Bir süre sonra kasabanın yakınındaki Ay Işığı Ormanı’na ulaştılar. Bu orman geceleri ay ışığını yakalayıp gümüş gibi parlayan yapraklarıyla ünlüydü.

Sarp ormanın içine adım attığında rüzgâr hafifçe esiyor, ağaçlar fısıldar gibi sesler çıkarıyordu.

Tam o sırada ileride yumuşak bir ışık gördü.

Işığa doğru yaklaştığında, ay ışığının altında duran bir kız fark etti.

Kızın uzun saçları omuzlarından aşağı dalga dalga dökülüyordu. Saçlarının rengi ay ışığında altın gibi parlıyordu ama içinde koyu kahverenginin sıcak tonları saklıydı. Boyu zarifti, yaklaşık Sarp’ın omzuna geliyordu.

Bu kız Ece idi.

Buğday teni ay ışığında yumuşak bir şekilde parlıyor, koyu renk gözleri ise gece gökyüzü kadar derin görünüyordu.

Ece hafifçe gülümsedi.

“Merhaba,” dedi.

Sarp bir an şaşırdı ama sonra kendini toparladı.

“Merhaba… Ben Sarp.”

Ece başını hafifçe eğdi.

“Ben de Ece.”

Tam o sırada Sushi küçük bir zıplayış yaptı ve Ece’nin yanına gidip onun etrafında dolaşmaya başladı. Ece gülerek Sushi’yi okşadı.

“Sanırım beni çoktan sevdi,” dedi.

“Evet,” dedi Sarp gülerek. “Sushi insanların kalbini hemen anlayabilir.”

Ece gökyüzüne baktı. Yıldızlar gerçekten olağanüstü parlaktı.

“Bugün özel bir gece,” dedi Ece.
“Ay Işığı Ormanı sadece bazı geceler böyle parlar. Bu gece dileklerin gerçekleştiği gecelerden biri.”

Sarp merakla sordu:

“Peki senin dileğin neydi?”

Ece biraz düşündü. Gözleri yıldızlara yansıyan ışıkla daha da parlak görünüyordu.

“Belki de,” dedi yumuşak bir sesle,
“beni anlayacak birini bulmak.”

Sarp gülümsedi.

“Sanırım yıldızlar dileğini duymuş.”

O gece üçü birlikte ormanda yürüdüler. Parlayan ağaçların arasından geçtiler, küçük bir dere kenarında oturup yıldızları izlediler.

Sushi bazen kelebeklerin peşinden koşuyor, bazen de gelip ikisinin yanında kıvrılıyordu.

Gece ilerledikçe Sarp bir şeyi fark etti.

Yıldızlar gerçekten hikâyeler anlatıyordu.

Ama o gece anlatılan hikâye gökyüzünde değil, Ay Işığı Ormanı’nın içinde başlamıştı.

Bu, Sarp, Ece ve Sushi’nin ilk masalıydı.

Ve yıldızlara bakılırsa…
önlerinde daha anlatılacak çok macera vardı.`
    }
];

// =========================================
//   SAYFA BÖLME AYARLARI
// =========================================
const CHARS_PER_PAGE = 580; // Her sayfaya düşen yaklaşık karakter

// =========================================
//   DURUM
// =========================================
let currentStoryIndex = null;
let pages = [];       // Kitap sayfaları (HTML string[])
let currentSpread = 0; // Hangi çift sayfadayız
let isFlipping = false;
let isMobile = false;

// =========================================
//   YILDIZ ANİMASYONU
// =========================================
function initStars() {
    const canvas = document.getElementById('stars-canvas');
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Yıldızları oluştur
    const stars = Array.from({ length: 280 }, () => ({
        x: Math.random(),
        y: Math.random() * 0.75, // Ormanın üzerinde
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.005 + 0.002,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() < 0.15 ? '#ffd0d0' : (Math.random() < 0.15 ? '#d0d8ff' : '#fffde0')
    }));

    // Yıldız kaymesi
    const shootingStars = [];
    function maybeAddShootingStar() {
        if (Math.random() < 0.004 && shootingStars.length < 2) {
            shootingStars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height * 0.4,
                len: Math.random() * 120 + 60,
                speed: Math.random() * 8 + 5,
                angle: Math.PI / 4 + (Math.random() - 0.5) * 0.5,
                alpha: 1,
                life: 0
            });
        }
    }

    function draw(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Gece gökyüzü gradyanı
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0,    '#050318');
        grad.addColorStop(0.4,  '#0d0a2e');
        grad.addColorStop(0.72, '#0a1520');
        grad.addColorStop(1,    '#040d04');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Nebula lekesi
        const nebula = ctx.createRadialGradient(
            canvas.width * 0.6, canvas.height * 0.25, 10,
            canvas.width * 0.6, canvas.height * 0.25, canvas.width * 0.35
        );
        nebula.addColorStop(0, 'rgba(80, 30, 120, 0.12)');
        nebula.addColorStop(1, 'transparent');
        ctx.fillStyle = nebula;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Yıldızlar
        stars.forEach(s => {
            const tw = Math.sin(time * s.speed + s.phase);
            const alpha = 0.4 + 0.6 * (tw * 0.5 + 0.5);
            ctx.beginPath();
            ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
            ctx.fillStyle = s.color;
            ctx.globalAlpha = alpha;
            ctx.fill();

            // Parlak yıldızlar için ışıma
            if (s.r > 1.2) {
                const glow = ctx.createRadialGradient(
                    s.x * canvas.width, s.y * canvas.height, 0,
                    s.x * canvas.width, s.y * canvas.height, s.r * 5
                );
                glow.addColorStop(0, s.color.replace(')', ', 0.3)').replace('rgb', 'rgba'));
                glow.addColorStop(1, 'transparent');
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r * 5, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        ctx.globalAlpha = 1;

        // Kayan yıldızlar
        maybeAddShootingStar();
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const ss = shootingStars[i];
            ss.x += Math.cos(ss.angle) * ss.speed;
            ss.y += Math.sin(ss.angle) * ss.speed;
            ss.life++;
            ss.alpha = Math.max(0, 1 - ss.life / 50);

            const tail = ctx.createLinearGradient(
                ss.x, ss.y,
                ss.x - Math.cos(ss.angle) * ss.len,
                ss.y - Math.sin(ss.angle) * ss.len
            );
            tail.addColorStop(0, `rgba(255, 255, 240, ${ss.alpha})`);
            tail.addColorStop(1, 'transparent');

            ctx.beginPath();
            ctx.moveTo(ss.x, ss.y);
            ctx.lineTo(ss.x - Math.cos(ss.angle) * ss.len, ss.y - Math.sin(ss.angle) * ss.len);
            ctx.strokeStyle = tail;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            if (ss.life > 50) shootingStars.splice(i, 1);
        }

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}

// =========================================
//   ATEŞBÖCEKLERİ
// =========================================
function initFireflies() {
    const container = document.getElementById('fireflies');
    const count = 22;

    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = 'firefly';

        const x = Math.random() * 100;
        const y = 50 + Math.random() * 45; // Alt kısım (orman bölgesi)
        const dur  = (6 + Math.random() * 10).toFixed(1);
        const blink = (1.5 + Math.random() * 2.5).toFixed(1);
        const dx1 = `${(Math.random() - 0.5) * 120}px`;
        const dy1 = `${(Math.random() - 0.5) * 80}px`;
        const dx2 = `${(Math.random() - 0.5) * 120}px`;
        const dy2 = `${(Math.random() - 0.5) * 80}px`;
        const dx3 = `${(Math.random() - 0.5) * 100}px`;
        const dy3 = `${(Math.random() - 0.5) * 60}px`;

        el.style.cssText = `
            left: ${x}%;
            top: ${y}%;
            --duration: ${dur}s;
            --blink: ${blink}s;
            --dx1: ${dx1}; --dy1: ${dy1};
            --dx2: ${dx2}; --dy2: ${dy2};
            --dx3: ${dx3}; --dy3: ${dy3};
            animation-delay: ${(Math.random() * 5).toFixed(1)}s;
            width: ${2 + Math.random() * 3}px;
            height: ${2 + Math.random() * 3}px;
        `;

        container.appendChild(el);
    }
}

// =========================================
//   SAHNE NAVİGASYONU
// =========================================
function showScene(id) {
    document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// =========================================
//   MASAL LİSTESİ
// =========================================
function renderStoryList() {
    const grid = document.getElementById('stories-grid');
    grid.innerHTML = '';

    STORIES.forEach((story, i) => {
        const card = document.createElement('div');
        card.className = 'story-card';
        card.style.animationDelay = `${i * 0.08}s`;
        card.innerHTML = `
            <div class="card-book" style="background: linear-gradient(135deg, ${story.coverColor} 0%, ${adjustColor(story.coverColor, 30)} 100%);">
                <div class="card-icon">${story.icon}</div>
                <div class="card-title">${story.title}</div>
                <div class="card-number">${i + 1}</div>
            </div>
        `;
        card.addEventListener('click', () => openStory(i));
        grid.appendChild(card);
    });
}

function adjustColor(hex, amount) {
    // Rengi biraz aydınlatmak için
    try {
        const num = parseInt(hex.replace('#',''), 16);
        const r = Math.min(255, (num >> 16) + amount);
        const g = Math.min(255, ((num >> 8) & 0xff) + amount);
        const b = Math.min(255, (num & 0xff) + amount);
        return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
    } catch { return hex; }
}

// =========================================
//   KİTAP AÇMA
// =========================================
function openStory(storyIndex) {
    currentStoryIndex = storyIndex;
    const story = STORIES[storyIndex];

    // Metni sayfalara böl
    pages = buildPages(story);

    currentSpread = 0;
    isFlipping = false;

    renderSpread();
    showScene('scene-reader');
}

// =========================================
//   METNİ SAYFALARA BÖLME
// =========================================
function buildPages(story) {
    const pageList = [];

    // Kapak sayfası (sol - boş süslü)
    pageList.push({ type: 'blank-cover' });

    // Kapak sayfası (sağ - başlık)
    pageList.push({
        type: 'cover',
        html: `<div class="cover-page">
            <div class="cover-icon">${story.icon}</div>
            <div class="cover-title">${story.title}</div>
            <div class="cover-subtitle">Sana özel bir masal</div>
            <div class="cover-ornament">✦ ✦ ✦</div>
        </div>`
    });

    // İçerik sayfaları
    const paragraphs = story.content
        .split(/\n+/)
        .map(p => p.trim())
        .filter(p => p.length > 0);

    let currentPageHtml = '';
    let currentLength = 0;
    let isFirstContentPage = true;

    function pushPage(html, isFirst = false) {
        pageList.push({ type: 'content', html, isFirst });
    }

    for (const para of paragraphs) {
        const paraHtml = `<p>${para}</p>`;
        const paraLen = para.length;

        if (currentLength > 0 && currentLength + paraLen > CHARS_PER_PAGE) {
            pushPage(currentPageHtml, isFirstContentPage);
            isFirstContentPage = false;
            currentPageHtml = paraHtml;
            currentLength = paraLen;
        } else {
            currentPageHtml += paraHtml;
            currentLength += paraLen;
        }
    }

    if (currentPageHtml) {
        pushPage(currentPageHtml, isFirstContentPage);
    }

    // Son sayfa
    pageList.push({
        type: 'end',
        html: `<div class="end-page">
            <div class="end-text">Son.</div>
            <div>✦</div>
            <div class="end-fin">~ Son ~</div>
        </div>`
    });

    // Çift sayıya tamamla
    if (pageList.length % 2 !== 0) {
        pageList.push({ type: 'blank-cover' });
    }

    return pageList;
}

function getPageHtml(index) {
    if (index < 0 || index >= pages.length) return '';
    const p = pages[index];
    if (!p) return '';
    if (p.type === 'blank-cover') return '';
    if (p.type === 'cover' || p.type === 'end') return p.html;
    return p.html || '';
}

// =========================================
//   SPREAD RENDER
// =========================================
function renderSpread() {
    isMobile = window.innerWidth <= 640;

    const li = currentSpread * 2;
    const ri = currentSpread * 2 + 1;
    const totalSpreads = Math.ceil(pages.length / 2);

    // Sol sayfa
    const leftEl = document.getElementById('text-left');
    const leftNum = document.getElementById('num-left');
    if (leftEl) {
        leftEl.innerHTML = getPageHtml(li);
        leftNum.textContent = li > 0 ? li : '';
    }

    // Sağ sayfa
    const rightEl = document.getElementById('text-right');
    const rightNum = document.getElementById('num-right');
    if (rightEl) {
        rightEl.innerHTML = getPageHtml(ri);
        rightNum.textContent = (ri < pages.length && ri > 0) ? ri : '';
    }

    // Kontroller
    const counter = document.getElementById('spread-counter');
    if (counter) {
        counter.textContent = `${currentSpread + 1} / ${totalSpreads}`;
    }

    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    if (prevBtn) prevBtn.disabled = currentSpread === 0;
    if (nextBtn) nextBtn.disabled = currentSpread >= totalSpreads - 1;
}

// =========================================
//   SAYFA ÇEVİRME - İLERİ
// =========================================
function goNext() {
    if (isFlipping) return;
    const totalSpreads = Math.ceil(pages.length / 2);
    if (currentSpread >= totalSpreads - 1) return;

    isFlipping = true;

    const nextLi = (currentSpread + 1) * 2;
    const nextRi = (currentSpread + 1) * 2 + 1;
    const currRi = currentSpread * 2 + 1;

    // Flip front = mevcut sağ sayfa
    document.getElementById('flip-fwd-front').innerHTML = getPageHtml(currRi);
    // Flip back = sonraki sol sayfa
    document.getElementById('flip-fwd-back').innerHTML = getPageHtml(nextLi);

    // Sağ sayfa arka plana sonraki sağ sayfayı göster
    document.getElementById('text-right').innerHTML = getPageHtml(nextRi);
    document.getElementById('num-right').textContent = (nextRi < pages.length && nextRi > 0) ? nextRi : '';

    const wrapper = document.getElementById('flipper-fwd');
    const flipper = document.getElementById('flipper-fwd-inner');

    wrapper.style.display = 'block';
    flipper.style.transition = 'none';
    flipper.style.transform = 'rotateY(0deg)';

    // Kısa gecikme sonra animasyonu başlat
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            flipper.style.transition = 'transform 0.75s cubic-bezier(0.645, 0.045, 0.355, 1.000)';
            flipper.style.transform = 'rotateY(-180deg)';
        });
    });

    setTimeout(() => {
        currentSpread++;
        wrapper.style.display = 'none';
        flipper.style.transition = 'none';
        flipper.style.transform = 'rotateY(0deg)';

        // Sol sayfayı da güncelle
        document.getElementById('text-left').innerHTML = getPageHtml(nextLi);
        document.getElementById('num-left').textContent = nextLi > 0 ? nextLi : '';

        updateControls();
        isFlipping = false;
    }, 780);
}

// =========================================
//   SAYFA ÇEVİRME - GERİ
// =========================================
function goPrev() {
    if (isFlipping || currentSpread <= 0) return;

    isFlipping = true;

    const prevLi = (currentSpread - 1) * 2;
    const prevRi = (currentSpread - 1) * 2 + 1;
    const currLi = currentSpread * 2;

    // Flip front = mevcut sol sayfa
    document.getElementById('flip-bwd-front').innerHTML = getPageHtml(currLi);
    // Flip back = önceki sağ sayfa
    document.getElementById('flip-bwd-back').innerHTML = getPageHtml(prevRi);

    // Sol sayfa arka plana önceki sol sayfayı göster
    document.getElementById('text-left').innerHTML = getPageHtml(prevLi);
    document.getElementById('num-left').textContent = prevLi > 0 ? prevLi : '';

    const wrapper = document.getElementById('flipper-bwd');
    const flipper = document.getElementById('flipper-bwd-inner');

    wrapper.style.display = 'block';
    flipper.style.transition = 'none';
    flipper.style.transform = 'rotateY(180deg)';

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            flipper.style.transition = 'transform 0.75s cubic-bezier(0.645, 0.045, 0.355, 1.000)';
            flipper.style.transform = 'rotateY(0deg)';
        });
    });

    setTimeout(() => {
        currentSpread--;
        wrapper.style.display = 'none';
        flipper.style.transition = 'none';
        flipper.style.transform = 'rotateY(180deg)';

        document.getElementById('text-right').innerHTML = getPageHtml(currentSpread * 2 + 1);
        document.getElementById('num-right').textContent =
            (currentSpread * 2 + 1 < pages.length) ? currentSpread * 2 + 1 : '';

        updateControls();
        isFlipping = false;
    }, 780);
}

function updateControls() {
    const totalSpreads = Math.ceil(pages.length / 2);
    const counter = document.getElementById('spread-counter');
    if (counter) counter.textContent = `${currentSpread + 1} / ${totalSpreads}`;
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    if (prevBtn) prevBtn.disabled = currentSpread === 0;
    if (nextBtn) nextBtn.disabled = currentSpread >= totalSpreads - 1;
}

// =========================================
//   KLAVYE DESTEĞİ
// =========================================
document.addEventListener('keydown', (e) => {
    const readerActive = document.getElementById('scene-reader').classList.contains('active');
    if (!readerActive) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext();
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goPrev();
});

// =========================================
//   DOKUNMA DESTEĞİ (MOBİL)
// =========================================
let touchStartX = 0;
document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    const readerActive = document.getElementById('scene-reader').classList.contains('active');
    if (!readerActive) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
        dx < 0 ? goNext() : goPrev();
    }
}, { passive: true });

// =========================================
//   BUTON BAĞLAMALARI
// =========================================
function bindButtons() {
    document.getElementById('btn-enter').addEventListener('click', () => {
        renderStoryList();
        showScene('scene-list');
    });

    document.getElementById('btn-back-landing').addEventListener('click', () => {
        showScene('scene-landing');
    });

    document.getElementById('btn-back-list').addEventListener('click', () => {
        showScene('scene-list');
    });

    document.getElementById('btn-next').addEventListener('click', goNext);
    document.getElementById('btn-prev').addEventListener('click', goPrev);
}

// =========================================
//   BAŞLAT
// =========================================
window.addEventListener('DOMContentLoaded', () => {
    initStars();
    initFireflies();
    bindButtons();

    window.addEventListener('resize', () => {
        isMobile = window.innerWidth <= 640;
    });
});
