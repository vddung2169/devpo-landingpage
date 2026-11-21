/* Dev Pồ · bản demo bố cục mới.
   Dữ liệu chép từ data/products.ts (giá, ảnh, tình trạng). Riêng giá Quốc tế
   trong phiếu so giá là SỐ TẠM, cần Dev Pồ cung cấp giá thật. */

const IMG = "../public/";
const ZALO = "https://zalo.me/4289073059490896771";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Phiếu so giá (hero) ----------
const COMPARE = [
  { id: "17pm", label: "17 Pro Max", img: "products/17promax.png", lock: 25590000, qt: 31490000, spec: "256GB · Pin 100% · Likenew / Fullbox" },
  { id: "16pm", label: "16 Pro Max", img: "products/16promax.png", lock: 17990000, qt: 23490000, spec: "256GB · Pin 9x–100% · Hình thức 98–99%" },
  { id: "15pm", label: "15 Pro Max", img: "products/15promax.png", lock: 14990000, qt: 18990000, spec: "256GB · Pin 8x–100% · Hình thức 98–99%" },
  { id: "14pm", label: "14 Pro Max", img: "products/iphone14promax.png", lock: 11990000, qt: 14990000, spec: "128GB · Pin 8x–100% · Hình thức 98–99%" },
];

const vnd = (n) => n.toLocaleString("vi-VN").replace(/,/g, ".") + "đ";

const receipt = document.querySelector(".receipt");
const chipBox = document.getElementById("model-chips");
const qtEl = document.getElementById("qt-price");
const lockEl = document.getElementById("lock-price");
const saveEl = document.getElementById("saving");
const imgEl = document.getElementById("receipt-img");
const specEl = document.getElementById("receipt-spec");
let countRaf = 0;

function countTo(el, from, to, duration, delay) {
  cancelAnimationFrame(countRaf);
  el.textContent = vnd(from);
  const start = performance.now() + delay;
  const tick = (now) => {
    const t = Math.min(Math.max((now - start) / duration, 0), 1);
    const eased = 1 - Math.pow(1 - t, 4);
    // làm tròn tới nghìn đồng để số chạy trông như bảng giá thật
    el.textContent = vnd(Math.round((from + (to - from) * eased) / 1000) * 1000);
    if (t < 1) countRaf = requestAnimationFrame(tick);
  };
  countRaf = requestAnimationFrame(tick);
}

function showModel(model, animate) {
  imgEl.src = IMG + model.img;
  imgEl.alt = "iPhone " + model.label + " Lock";
  qtEl.textContent = vnd(model.qt);
  saveEl.textContent = vnd(model.qt - model.lock);
  specEl.textContent = model.spec;

  if (!animate || reduceMotion) {
    lockEl.textContent = vnd(model.lock);
    return;
  }
  // Khởi động lại chuỗi: máy trượt vào → gạch giá Quốc tế → giá Lock chạy xuống → đóng dấu số tiền giữ lại
  receipt.classList.remove("is-playing");
  void receipt.offsetWidth;
  receipt.classList.add("is-playing");
  countTo(lockEl, model.qt, model.lock, 1000, 750);
}

COMPARE.forEach((model, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.role = "radio";
  b.textContent = model.label;
  b.setAttribute("aria-checked", i === 0 ? "true" : "false");
  b.addEventListener("click", () => {
    chipBox.querySelectorAll("button").forEach((x) => x.setAttribute("aria-checked", "false"));
    b.setAttribute("aria-checked", "true");
    showModel(model, true);
  });
  chipBox.appendChild(b);
});
// Phím mũi tên trong nhóm chip
chipBox.addEventListener("keydown", (e) => {
  if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
  const btns = [...chipBox.querySelectorAll("button")];
  const i = btns.indexOf(document.activeElement);
  const next = btns[(i + (e.key === "ArrowRight" ? 1 : -1) + btns.length) % btns.length];
  next.focus();
  next.click();
});
showModel(COMPARE[0], true);

// ---------- Lưới máy ----------
const PRODUCTS = [
  { cat: "lock", name: "iPhone 17 Pro Max Lock", img: "products/17promax.png", tag: "Mới về", price: 25590000, was: 28500000, spec: "256GB · Pin 100% · Fullbox" },
  { cat: "lock", name: "iPhone 17 Pro Lock", img: "products/17promax.png", tag: "Hot nhất", price: 22590000, was: 25000000, spec: "256GB · Pin 100% · Likenew" },
  { cat: "lock", name: "iPhone 16 Pro Max Lock", img: "products/16promax.png", tag: "Bán chạy", price: 17990000, was: 21990000, spec: "256GB · Pin 9x–100%" },
  { cat: "lock", name: "iPhone 17 Air", img: "products/iphone17air.png", price: 16990000, was: 17000000, spec: "256GB · Pin 100% · Likenew" },
  { cat: "lock", name: "iPhone 15 Pro Max", img: "products/15promax.png", tag: "Bán chạy", price: 14990000, was: 17000000, spec: "256GB / 512GB · Pin 8x–100%" },
  { cat: "lock", name: "iPhone 14 Pro Max", img: "products/iphone14promax.png", price: 11990000, was: 12900000, spec: "128GB / 256GB · Pin 8x–100%" },
  { cat: "lock", name: "iPhone 16", img: "products/iphone16.png", price: 10990000, was: 11900000, spec: "128GB · Pin 9x–100% · Likenew" },
  { cat: "ipad", name: "iPad Pro 2020 11 inch", img: "products/ipadpro2020.png", price: 12290000, spec: "128GB · 4G" },
  { cat: "ipad", name: "iPad Air 5", img: "products/ipadair5.png", tag: "Bán chạy", price: 10990000, spec: "64GB / 256GB · Wi-Fi / 4G" },
  { cat: "ipad", name: "iPad Air 4", img: "products/ipadair4.png", price: 7390000, spec: "64GB / 256GB · Wi-Fi / 4G" },
  { cat: "ipad", name: "iPad Gen 9 (2021)", img: "products/ipadgen9.png", price: 4990000, was: 5990000, spec: "64GB · 4G · Pin 9x%" },
  { cat: "ipad", name: "iPad Gen 7", img: "products/ipadgen7.png", price: 1990000, spec: "32GB · 4G" },
];

const grid = document.getElementById("product-grid");
const tabs = document.querySelectorAll(".tabs [role=tab]");

function productCard(p) {
  const save = p.was && p.price ? p.was - p.price : 0;
  return `
    <a class="product" href="#" aria-label="${p.name}">
      <div class="product-media">
        <img src="${IMG + p.img}" alt="" loading="lazy" width="500" height="500" />
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
      </div>
      <h3 class="product-name">${p.name}</h3>
      <p class="product-spec">${p.spec}</p>
      <p class="product-price">
        <span class="now">${p.price ? "Từ " + vnd(p.price) : "Liên hệ"}</span>
        ${p.was ? `<span class="was">${vnd(p.was)}</span>` : ""}
      </p>
      ${save >= 500000 ? `<p class="product-save">Rẻ hơn ${vnd(save)}</p>` : ""}
    </a>`;
}

const askTile = `
  <a class="product-ask" href="${ZALO}" target="_blank" rel="noopener">
    <strong>Không thấy đời máy bạn cần?</strong>
    <span>Nhắn Dev Pồ đời máy, dung lượng, màu. Máy mới về được báo trước.</span>
    <span class="link-arrow">Nhắn Zalo</span>
  </a>`;

function renderGrid(cat) {
  const list = PRODUCTS.filter((p) => p.cat === cat);
  if (!list.length) {
    grid.innerHTML = `
      <div class="empty">
        <p><strong>Chưa có dữ liệu iPhone Quốc tế</strong></p>
        <p class="muted">Trên web hiện tại cũng chưa có sản phẩm Quốc tế nào. <span class="ph">Cần bổ sung danh sách máy Quốc tế và giá</span></p>
      </div>`;
    return;
  }
  grid.innerHTML = list.map(productCard).join("") + askTile;
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
    tab.setAttribute("aria-selected", "true");
    renderGrid(tab.dataset.cat);
  });
});
renderGrid("lock");

// ---------- Ảnh khách ----------
const FEEDBACK = ["IMG_3592", "IMG_2855", "IMG_3593", "IMG_2856", "IMG_3594", "IMG_2857", "IMG_3595", "IMG_2858"];
document.getElementById("gallery").innerHTML = FEEDBACK.map(
  (f, i) => `<figure><img src="${IMG}feedback/${f}.JPG" alt="Khách nhận máy tại Dev Pồ, ảnh ${i + 1}" loading="lazy" width="1536" height="2048" /></figure>`,
).join("");

// ---------- Hỏi đáp (6 câu khách hỏi nhiều nhất, rút gọn từ FaqSection) ----------
const FAQ = [
  ["iPhone Lock có dùng được sim Việt Nam không?", "Dùng được bình thường qua sim ghép: nghe gọi, nhắn tin, 4G/5G như máy Quốc tế. Dev Pồ cài sẵn trước khi giao."],
  ["Cập nhật iOS xong bị mất sóng thì sao?", "Mang máy qua cửa hàng hoặc nhắn kỹ thuật, Dev Pồ xử lý miễn phí trọn đời máy."],
  ["Mua online có được kiểm tra máy trước không?", "Có. Dev Pồ gửi video máy thật trước khi chốt, và bạn kiểm tra máy khi nhận hàng."],
  ["Có trả góp không?", "Có trả góp 0% qua thẻ tín dụng và các app tài chính. Nhắn Zalo để được tính gói phù hợp."],
  ["Bảo hành phần cứng bao lâu?", "Cần bổ sung: thời gian bảo hành phần cứng (máy, pin, màn hình) và điều kiện đổi trả."],
  ["Làm sao kiểm tra máy là hàng zin?", "Bấm *#06# để lấy IMEI rồi tra trên công cụ Check IMEI của Dev Pồ. Ở cửa hàng, kỹ thuật kiểm tra cùng bạn."],
];
document.getElementById("faq").innerHTML = FAQ.map(
  ([q, a]) => `<details><summary>${q}</summary><p>${a.startsWith("Cần bổ sung") ? `<span class="ph">${a}</span>` : a}</p></details>`,
).join("");
