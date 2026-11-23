var rooms = [
  ["Standart katta", "Standart", 90, "r1", 2, 28],
  ["Standart ikki kishilik", "Standart", 85, "r4", 2, 26],
  ["Klassik xona", "Standart", 80, "r1", 2, 24],
  ["Registon manzarali", "Standart", 110, "r6", 2, 30],
  ["Oilaviy xona", "Standart", 120, "r7", 4, 38],
  ["Tejamkor xona", "Standart", 70, "r4", 1, 20],
  ["Lyuks oliy", "Lyuks", 160, "r2", 2, 45],
  ["Lyuks hammomli", "Lyuks", 180, "r3", 2, 48],
  ["Lyuks Panorama", "Lyuks", 190, "r6", 3, 52],
  ["Lyuks Marmar", "Lyuks", 175, "r3", 2, 46],
  ["Lyuks Oilaviy", "Lyuks", 210, "r7", 4, 60],
  ["Lyuks Romantik", "Lyuks", 170, "r8", 2, 42],
  ["Kichik apartament", "Apartament", 260, "r2", 2, 70],
  ["Prezident apartamenti", "Apartament", 520, "r8", 4, 140],
  ["Tomdagi apartament", "Apartament", 450, "r5", 3, 120],
  ["Shoh apartamenti", "Apartament", 390, "r8", 2, 95],
  ["Registon apartamenti", "Apartament", 320, "r6", 3, 85],
  ["Osmon apartamenti", "Apartament", 480, "r5", 4, 130],
];
var cart = JSON.parse(localStorage.getItem("zumrad-cart") || "[]");
var selected = rooms[0];
var observer = new IntersectionObserver(
  function (list) {
    list.forEach(function (e) {
      if (e.isIntersecting) e.target.classList.add("v");
    });
  },
  { threshold: 0.12 },
);
document.querySelectorAll(".rv").forEach(function (s) {
  observer.observe(s);
});

function showRooms(filter) {
  var html = "";
  for (var i = 0; i < rooms.length; i++) {
    var r = rooms[i];
    if (filter !== "all" && r[1] !== filter) continue;
    html +=
      '<div class="card" style="transition-delay:' +
      (i % 3) * 0.12 +
      's" onmousemove="tilt(event,this)" onmouseleave="this.style.removeProperty(\'--rx\');this.style.removeProperty(\'--ry\')"><div class="im"><span class="pbadge">$' +
      r[2] +
      '</span><img src="img/' +
      r[3] +
      '.jpg" alt="' +
      r[0] +
      '" loading="lazy"></div>' +
      '<div class="in"><p class="tag">' +
      r[1] +
      "</p><h3>" +
      r[0] +
      '</h3><div class="meta"><span>' +
      r[4] +
      " mehmon</span><span>" +
      r[5] +
      " m²</span><span>★ " +
      (4.6 + (i % 4) / 10).toFixed(1) +
      "</span></div>" +
      '<div class="row"><b>$' +
      r[2] +
      ' <small>/kecha</small></b><span><button onclick="chooseRoom(' +
      i +
      ')">Tanlash</button><button class="add" onclick="addToCart(' +
      i +
      ')">Savatga</button></span></div></div></div>';
  }
  document.getElementById("grid").innerHTML = html;
  document.querySelectorAll(".card").forEach(function (c) {
    observer.observe(c);
  });
}

function chooseRoom(i) {
  selected = rooms[i];
  document.getElementById("room").value = i;
  updateTotal();
  location.hash = "bron";
}

function updateTotal() {
  selected = rooms[document.getElementById("room").value];
  var a = new Date(document.getElementById("in").value),
    b = new Date(document.getElementById("out").value);
  var nights = Math.max(1, Math.round((b - a) / 86400000) || 1);
  document.getElementById("chosen").textContent = selected[0];
  document.getElementById("total").textContent =
    "$" + selected[2] * nights + " (" + nights + " kecha)";
}

var options = "";
for (var i = 0; i < rooms.length; i++)
  options +=
    '<option value="' +
    i +
    '">' +
    rooms[i][0] +
    " — $" +
    rooms[i][2] +
    "</option>";
document.getElementById("room").innerHTML = options;
["room", "in", "out"].forEach(function (id) {
  document.getElementById(id).onchange = updateTotal;
});

document.getElementById("tabs").onclick = function (e) {
  if (!e.target.dataset.f) return;
  document.querySelector(".tabs .on").classList.remove("on");
  e.target.classList.add("on");
  showRooms(e.target.dataset.f);
};

document.getElementById("form").onsubmit = function (e) {
  e.preventDefault();
  document.getElementById("msg").textContent =
    "Rahmat, " +
    document.getElementById("name").value +
    "! " +
    selected[0] +
    " band qilindi. Tez orada qo'ng'iroq qilamiz.";
  this.reset();
  updateTotal();
};

window.onscroll = function () {
  document.querySelector("header").classList.toggle("s", scrollY > 50);
  document.getElementById("progress").style.width =
    (scrollY / (document.body.scrollHeight - innerHeight)) * 100 + "%";
};

// Savat
function addToCart(i) {
  cart.push(i);
  renderCart();
  var c = document.getElementById("count");
  c.classList.remove("pop");
  void c.offsetWidth;
  c.classList.add("pop");
  toast(rooms[i][0] + " savatga qo'shildi");
}
function removeFromCart(k) {
  cart.splice(k, 1);
  renderCart();
}
function renderCart() {
  localStorage.setItem("zumrad-cart", JSON.stringify(cart));
  var html = "",
    sum = 0;
  cart.forEach(function (i, k) {
    var r = rooms[i];
    sum += r[2];
    html +=
      '<li><img src="img/' +
      r[3] +
      '.jpg" alt=""><div>' +
      r[0] +
      "<br><small>$" +
      r[2] +
      ' / kecha</small></div><button onclick="removeFromCart(' +
      k +
      ")\">O'chirish</button></li>";
  });
  document.getElementById("items").innerHTML =
    html || "<li>Savat hozircha bo'sh</li>";
  document.getElementById("count").textContent = cart.length;
  document.getElementById("csum").textContent = "$" + sum;
}
function toggleCart(open) {
  document.getElementById("cart").classList.toggle("open", open);
  document.getElementById("shade").classList.toggle("open", open);
}
document.getElementById("cartBtn").onclick = function () {
  toggleCart(true);
};
document.getElementById("close").onclick = document.getElementById(
  "shade",
).onclick = function () {
  toggleCart(false);
};
document.getElementById("checkout").onclick = function () {
  if (!cart.length) return toast("Avval xona qo'shing");
  cart = [];
  renderCart();
  toggleCart(false);
  toast("Rahmat! Bronlaringiz qabul qilindi.");
};

function toast(text) {
  var t = document.getElementById("toast");
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(t.timer);
  t.timer = setTimeout(function () {
    t.classList.remove("show");
  }, 2500);
}

// Dark / Light rejim
function setTheme(mode) {
  document.documentElement.dataset.theme = mode;
  document.getElementById("theme").textContent =
    mode === "light" ? "Qorong'i" : "Yorug'";
  localStorage.setItem("zumrad-theme", mode);
}
document.getElementById("theme").onclick = function () {
  setTheme(
    document.documentElement.dataset.theme === "light" ? "dark" : "light",
  );
};
setTheme(localStorage.getItem("zumrad-theme") || "dark");

// setInterval: hero rasmi almashadi
var heroPics = ["hero", "lobby", "r6", "r5", "spa"],
  h = 0,
  img = document.getElementById("heroImg");
setInterval(function () {
  h = (h + 1) % heroPics.length;
  img.style.opacity = 0;
  setTimeout(function () {
    img.src = "img/" + heroPics[h] + ".jpg";
    img.style.opacity = 1;
  }, 600);
}, 4000);

// setInterval: shiorlar va fikrlar almashadi
var slogans = [
  "Har bir xona — alohida hikoya.",
  "Samarqand manzarasi derazangizda.",
  "Nonushta — har kuni bepul.",
];
var reviews = [
  ["Hayotimdagi eng yaxshi dam olish edi.", "Malika, Toshkent"],
  ["Xizmat ko'rsatish a'lo darajada!", "Jon, London"],
  ["Hammom va basseyn ajoyib.", "Aziz, Buxoro"],
];
var s = 0;
setInterval(function () {
  s++;
  document.getElementById("slogan").textContent = slogans[s % slogans.length];
  document.getElementById("review").textContent =
    '"' + reviews[s % reviews.length][0] + '"';
  document.getElementById("author").textContent =
    "— " + reviews[s % reviews.length][1];
}, 3500);

// setInterval: taklif tugashigacha vaqt
setInterval(function () {
  var now = new Date(),
    end = new Date();
  end.setHours(24, 0, 0, 0);
  var t = Math.floor((end - now) / 1000),
    pad = function (n) {
      return String(n).padStart(2, "0");
    };
  document.getElementById("timer").textContent =
    pad(Math.floor(t / 3600)) +
    ":" +
    pad(Math.floor((t % 3600) / 60)) +
    ":" +
    pad(t % 60);
}, 1000);

showRooms("all");
updateTotal();
renderCart();

// Kartani sichqoncha bilan qiyshaytirish
function tilt(e, card) {
  var b = card.getBoundingClientRect();
  card.style.setProperty(
    "--ry",
    ((e.clientX - b.left) / b.width - 0.5) * 10 + "deg",
  );
  card.style.setProperty(
    "--rx",
    ((e.clientY - b.top) / b.height - 0.5) * -10 + "deg",
  );
}

// Kirib kelish animatsiyasi
setTimeout(function () {
  document.body.classList.add("ready");
}, 1600);
