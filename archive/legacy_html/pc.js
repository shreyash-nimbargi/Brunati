let selectedSampleName = "";
let selectedSize = "100ml";
let selectedPrice = 1795;

// --- NEW IMAGE LOGIC ---
function handleMissingImg(imgElement) {
    imgElement.closest('.thumb').classList.add('hidden');
    recalcGalleryLimit();
}

function recalcGalleryLimit() {
    const visibleThumbs = Array.from(document.querySelectorAll('.thumb:not(.hidden)'));
    visibleThumbs.forEach((thumb, index) => {
        if (index >= 3) thumb.classList.add('hidden');
    });
}

window.addEventListener('load', recalcGalleryLimit);

async function loadHeader() {
    try {
        const response = await fetch('header.html');
        const data = await response.text();
        const headerAnchor = document.getElementById('header-anchor');
        if(headerAnchor) headerAnchor.innerHTML = data;
    } catch (e) { console.error('Header failed to load', e); }
}
loadHeader();

function selectSize(element, size, price) {
    if (size === '50ml') {
        element.classList.add('out-of-stock');
        element.innerText = "OUT OF STOCK";
        setTimeout(() => { element.innerText = "50ml"; }, 2000);
        return; 
    }
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    selectedSize = size;
    selectedPrice = price;
    document.getElementById('display-price').innerText = `₹ ${price}.00`;
}

function openGiftModal() {
    const modal = document.getElementById('giftModal');
    document.body.classList.add('modal-open');
    modal.style.display = 'flex';
    gsap.to(modal, { opacity: 1, duration: 0.3 });
    gsap.to(modal.querySelector(".modal-content"), { y: 0, duration: 0.4, ease: "back.out(1.7)" });
}

function closeGiftModal() {
    const modal = document.getElementById('giftModal');
    gsap.to(modal, { opacity: 0, duration: 0.2, onComplete: () => {
        modal.style.display = 'none';
        if(!document.getElementById('checkoutModal').style.display || document.getElementById('checkoutModal').style.display === 'none') {
            document.body.classList.remove('modal-open');
        }
    }});
}

function selectSample(element, name) {
    document.querySelectorAll('.sample-item').forEach(item => item.classList.remove('selected'));
    element.classList.add('selected');
    selectedSampleName = name;
    const proceedBtn = document.getElementById('btn-proceed');
    proceedBtn.style.display = 'block';
    gsap.fromTo(proceedBtn, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
}

function proceedToCheckout() {
    document.getElementById('summary-sample-name').innerText = selectedSampleName;
    document.getElementById('summary-size').innerText = selectedSize;
    document.getElementById('summary-price').innerText = `₹ ${selectedPrice}.00`;
    document.getElementById('summary-total').innerText = `₹ ${selectedPrice}.00`;
    const giftModal = document.getElementById('giftModal');
    gsap.to(giftModal, { opacity: 0, duration: 0.2, onComplete: () => {
        giftModal.style.display = 'none';
        const checkoutModal = document.getElementById('checkoutModal');
        checkoutModal.style.display = 'flex';
        gsap.fromTo(checkoutModal, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        gsap.fromTo(checkoutModal.querySelector(".modal-content"), { y: 20 }, { y: 0, duration: 0.4, ease: "back.out(1.7)" });
    }});
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    gsap.to(modal, { opacity: 0, duration: 0.2, onComplete: () => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }});
}

function updateView(el, src) {
    const main = document.getElementById('mainImg');
    main.style.opacity = '0.3';
    setTimeout(() => { main.src = src; main.style.opacity = '1'; }, 150);
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
}

function toggleAcc(el) {
    const item = el.parentElement;
    const content = item.querySelector('.acc-content');
    const icon = el.querySelector('ion-icon');
    const isActive = item.classList.contains('active');

    document.querySelectorAll('.acc-item').forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
            const otherContent = otherItem.querySelector('.acc-content');
            const otherIcon = otherItem.querySelector('ion-icon');
            gsap.to(otherContent, { height: 0, duration: 0.4, ease: "power2.inOut" });
            gsap.to(otherIcon, { rotation: 0, duration: 0.4 });
            otherItem.classList.remove('active');
        }
    });

    if (!isActive) {
        item.classList.add('active');
        gsap.to(content, { height: "auto", duration: 0.5, ease: "power3.out" });
        gsap.to(icon, { rotation: 180, duration: 0.4 });
    } else {
        gsap.to(content, { height: 0, duration: 0.4, ease: "power2.inOut", onComplete: () => item.classList.remove('active') });
        gsap.to(icon, { rotation: 0, duration: 0.4 });
    }
}