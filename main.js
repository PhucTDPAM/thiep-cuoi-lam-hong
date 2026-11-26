(function () {
  "use strict";
  const C = window.WEDDING;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const pick = (path) => path.split(".").reduce((o, k) => (o ? o[k] : ""), C);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const WEEKDAYS = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const parseDay = (iso) => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); };
  const API = {}; // nối các module với nhau (nhạc, tự cuộn, màn hình mở thiệp)

  /* ---------- Văn bản cơ bản ---------- */
  $$("[data-f]").forEach((el) => (el.textContent = pick(el.dataset.f)));
  const guest = new URLSearchParams(location.search).get("to");
  $("#guestName").textContent = guest ? guest.trim().slice(0, 60) : C.defaultGuest;
  $("#inviteQuote").innerHTML = C.inviteQuote;
  $("#inviteQuoteEn").textContent = C.inviteQuoteEn || "";
  $("#coverDate").textContent = C.coverDate;
  const wideMQ = matchMedia("(min-width: 1024px) and (orientation: landscape)");
  const setCover = () => ($("#coverImg").style.backgroundImage =
    `url("${(wideMQ.matches && C.images.coverDesktop) || C.images.cover}")`);
  setCover();
  wideMQ.addEventListener?.("change", setCover);
  $("#inviteImg").dataset.src = C.images.invite;
  $("#polL").dataset.src = C.images.polaroidLeft;
  $("#polR").dataset.src = C.images.polaroidRight;
  $("#timelineImg").dataset.src = C.images.timeline;
  $("#memText").textContent = C.memoriesText;
  $("#thanks").textContent = C.thankYou;

  /* ---------- Hai gia đình ---------- */
  const fam = (f) => `<h3>${esc(f.title)}</h3><p>${esc(f.father)}</p><p>${esc(f.mother)}</p><p class="place">${esc(f.place)}</p>`;
  $("#famGroom").innerHTML = fam(C.families.groom);
  $("#famBride").innerHTML = fam(C.families.bride);

  /* ---------- Sự kiện ---------- */
  const timeVN = (t) => { const [h, m] = t.split(":").map(Number); return `${h} giờ${m ? " " + pad(m) + " phút" : ""}`; };
  // Thêm vào lịch: Google Calendar + file .ics (iPhone / Outlook)
  const coupleName = `${C.groom.fullName} & ${C.bride.fullName}`;
  const utcStamp = (dt) => dt.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const eventTimes = (e) => {
    const start = new Date(`${e.date}T${e.time}:00+07:00`);
    const end = new Date(start.getTime() + (e.duration || 3) * 3600e3);
    return [utcStamp(start), utcStamp(end)];
  };
  const eventTitle = (e) => `${e.name} – ${coupleName}`;
  const eventDetails = (e) => `Trân trọng kính mời bạn tới dự ${e.name} của ${coupleName}.\n${e.venueTitle}: ${e.address}\nChỉ đường: ${e.mapUrl}`;
  const gcalUrl = (e) => {
    const [s, en] = eventTimes(e);
    const q = new URLSearchParams({ action: "TEMPLATE", text: eventTitle(e), dates: `${s}/${en}`, details: eventDetails(e), location: e.address, ctz: "Asia/Ho_Chi_Minh" });
    return "https://calendar.google.com/calendar/render?" + q.toString();
  };
  const icsEscape = (t) => String(t).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  const icsData = (e) => {
    const [s, en] = eventTimes(e);
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//ThiepCuoi//VI", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
      "BEGIN:VEVENT", `UID:${e.id || e.date}-${s}@thiep-cuoi`, `DTSTAMP:${utcStamp(new Date())}`, `DTSTART:${s}`, `DTEND:${en}`,
      `SUMMARY:${icsEscape(eventTitle(e))}`, `DESCRIPTION:${icsEscape(eventDetails(e))}`, `LOCATION:${icsEscape(e.address)}`,
      "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", `DESCRIPTION:${icsEscape("Ngày mai: " + eventTitle(e))}`, "END:VALARM",
      "BEGIN:VALARM", "TRIGGER:-PT2H", "ACTION:DISPLAY", `DESCRIPTION:${icsEscape("2 giờ nữa: " + eventTitle(e))}`, "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    return "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
  };

  $("#events").innerHTML = C.events.map((e) => {
    const d = parseDay(e.date);
    return `<article class="event reveal">
      <h2 class="ev-name">${esc(e.name)}</h2>
      <p class="ev-time">Được tổ chức vào lúc ${esc(timeVN(e.time))}</p>
      <p class="weekday">${WEEKDAYS[d.getDay()]}</p>
      <div class="date-row">
        <div class="dr-side"><span>Tháng</span><b>${pad(d.getMonth() + 1)}</b></div>
        <div class="dr-day">${pad(d.getDate())}</div>
        <div class="dr-side"><span>Năm</span><b>${d.getFullYear()}</b></div>
      </div>
      <p class="lunar">( ${esc(e.lunar)} )</p>
      <svg class="ink rings-art"><use href="#i-rings"/></svg>
      <h3 class="venue-title">${esc(e.venueTitle)}</h3>
      <p class="venue-addr">${esc(e.address)}</p>
      <a class="btn-navy" href="${esc(e.mapUrl)}" target="_blank" rel="noopener">Chỉ đường</a>
      <div class="cal-add">
        <span class="cal-add-label">Thêm vào lịch</span>
        <a class="chip" href="${esc(gcalUrl(e))}" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>Lịch Google</a>
        <a class="chip" href="${icsData(e)}" download="${esc(e.id || "su-kien")}.ics">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4M12 13v5M9.5 15.5h5"/></svg>Lịch điện thoại</a>
      </div>
    </article>`;
  }).join("");

  /* ---------- Lịch tháng ---------- */
  (function calendar() {
    const main = new Date(C.mainDateTime);
    const y = main.getFullYear(), m = main.getMonth();
    const marks = new Set(C.events.map((e) => parseDay(e.date)).filter((d) => d.getFullYear() === y && d.getMonth() === m).map((d) => d.getDate()));
    $("#calTitle").textContent = `Tháng ${pad(m + 1)} – ${y}`;
    const first = (new Date(y, m, 1).getDay() + 6) % 7; // T2 = 0
    const days = new Date(y, m + 1, 0).getDate();
    let html = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => `<div class="dow">${d}</div>`).join("");
    html += "<div></div>".repeat(first);
    for (let d = 1; d <= days; d++) {
      html += marks.has(d)
        ? `<div class="d mark"><svg viewBox="0 0 24 22"><use href="#i-heart"/></svg>${d}</div>`
        : `<div class="d">${d}</div>`;
    }
    $("#calGrid").innerHTML = html;
  })();

  /* ---------- Đếm ngược ---------- */
  (function countdown() {
    const target = new Date(C.mainDateTime).getTime();
    const els = Object.fromEntries($$("[data-cd]").map((e) => [e.dataset.cd, e]));
    const tick = () => {
      let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
      if (s === 0) { $("#countdown").outerHTML = '<p class="cd-done">Hôm nay là ngày vui của chúng mình!</p>'; return; }
      els.d.textContent = Math.floor(s / 86400); s %= 86400;
      els.h.textContent = pad(Math.floor(s / 3600)); s %= 3600;
      els.m.textContent = pad(Math.floor(s / 60));
      els.s.textContent = pad(s % 60);
      setTimeout(tick, 1000);
    };
    tick();
  })();

  /* ---------- Lịch trình ---------- */
  $("#sched").innerHTML = C.schedule.map((g) =>
    `<li class="group"><p class="day">${esc(g.day)}</p>` + g.items.map((it) => `
      <div class="item reveal">
        <svg><use href="#i-${esc(it.icon)}"/></svg>
        <span class="t">${esc(it.time)}</span>
        <div><h4>${esc(it.title)}</h4><p>${esc(it.desc)}</p></div>
      </div>`).join("") + `</li>`
  ).join("");

  /* ---------- Dresscode ---------- */
  $("#dots").innerHTML = C.dresscode.map((c) => `<span style="background:${esc(c)}"></span>`).join("");

  /* ---------- Album ---------- */
  $("#masonry").innerHTML = C.album.map((src, i) =>
    `<button class="reveal" data-i="${i}" aria-label="Xem ảnh ${i + 1}"><img class="lazy" data-src="${esc(src)}" alt="Kỷ niệm ${i + 1}"></button>`).join("");

  /* ---------- Lazy load + hiệu ứng xuất hiện ---------- */
  const loadImg = (img) => { if (img.dataset.src && !img.src) { img.decoding = "async"; img.src = img.dataset.src; } };
  if ("IntersectionObserver" in window) {
    const lazyIO = new IntersectionObserver((ents) => ents.forEach((e) => {
      if (e.isIntersecting) { loadImg(e.target); lazyIO.unobserve(e.target); }
    }), { rootMargin: "400px 0px" });
    $$("img.lazy").forEach((i) => lazyIO.observe(i));

    const revealIO = new IntersectionObserver((ents) => ents.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("show"); revealIO.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach((el) => revealIO.observe(el));
  } else {
    $$("img.lazy").forEach(loadImg);
    $$(".reveal").forEach((el) => el.classList.add("show"));
  }
  // Tên trên ảnh bìa hiện từ mờ sang rõ
  requestAnimationFrame(() => setTimeout(() => $$(".cover .fade-name").forEach((el) => el.classList.add("show")), 200));

  /* ---------- Lightbox ---------- */
  (function lightbox() {
    const lb = $("#lightbox"), img = $("#lbImg"), count = $("#lbCount");
    let idx = 0;
    const show = (i) => {
      idx = (i + C.album.length) % C.album.length;
      img.style.opacity = 0;
      img.onload = () => (img.style.opacity = 1);
      img.src = C.album[idx];
      count.textContent = `${idx + 1} / ${C.album.length}`;
    };
    const open = (i) => { show(i); lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; };
    const close = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };
    $("#masonry").addEventListener("click", (e) => { const b = e.target.closest("button[data-i]"); if (b) open(+b.dataset.i); });
    $(".lb-close", lb).onclick = close;
    $(".prev", lb).onclick = () => show(idx - 1);
    $(".next", lb).onclick = () => show(idx + 1);
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
    let x0 = null;
    lb.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    lb.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  })();

  /* ---------- Sổ lưu bút & xác nhận tham dự ---------- */
  const KEY = "wedding-wishes-v1";
  const loadWishes = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const saveWishes = (list) => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {} };
  const wishKey = (w) => (w.name || "").trim() + "|" + (w.message || "").trim();
  let remoteWishes = []; // lời chúc của mọi người, đọc từ Google Sheets
  const allWishes = () => {
    const seen = new Set(), out = [];
    const samples = C.guestbook.showSamples === false ? [] : (C.guestbook.samples || []);
    [...loadWishes(), ...remoteWishes, ...samples].forEach((w) => {
      const k = wishKey(w);
      if (w && w.name && w.message && !seen.has(k)) { seen.add(k); out.push(w); }
    });
    return out;
  };

  function renderWishes(newKey) {
    $("#wishes").innerHTML = allWishes().map((w) => {
      const isNew = newKey && wishKey(w) === newKey;
      return `<li${isNew ? ' class="new"' : ""}><b>${esc(w.name)}</b>${w.side ? `<span class="tag">${esc(w.side)}</span>` : ""}${isNew ? '<span class="tag tag-new">Vừa gửi</span>' : ""}<p>${esc(w.message)}</p></li>`;
    }).join("");
  }
  renderWishes();

  // Đọc lời chúc chung từ Google Sheets (Apps Script doGet), cập nhật mỗi phút
  (function syncRemote() {
    const url = C.guestbook.googleScriptUrl;
    if (!url) return;
    const load = () => fetch(url + (url.includes("?") ? "&" : "?") + "action=list&t=" + Date.now())
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d) ? d : d.wishes;
        if (Array.isArray(list)) { remoteWishes = list.slice(0, 300); renderWishes(); }
      })
      .catch((err) => console.warn("Không đọc được lời chúc từ Google Sheets:", err));
    load();
    setInterval(() => { if (!document.hidden) load(); }, 60000);
  })();

  // Không tham dự → khoá câu hỏi ăn cỗ
  const form = $("#gbForm");
  form.addEventListener("change", (e) => {
    if (e.target.name !== "days") return;
    const no = e.target.value.startsWith("Không");
    $("#feastSet").classList.toggle("disabled", no);
    if (no) form.feast.value = "Không";
  });

  // Gửi lên Google Sheets (nếu đã cấu hình URL Apps Script)
  async function sendToSheet(entry) {
    const url = C.guestbook.googleScriptUrl;
    if (!url) return;
    const body = new URLSearchParams(entry);
    await fetch(url, { method: "POST", mode: "no-cors", body });
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const entry = {
      name: String(fd.get("name") || "").trim(),
      message: String(fd.get("message") || "").trim(),
      side: fd.get("side") || "",
      days: fd.get("days") || "",
      feast: fd.get("feast") || "",
      guestLink: guest || "",
      time: new Date().toISOString()
    };
    if (!entry.name || !entry.message) return;
    const btn = $("button[type=submit]", form), label = btn.innerHTML, msg = $("#gbMsg");
    btn.disabled = true;
    btn.classList.add("sending");
    btn.innerHTML = '<svg class="btn-heart" viewBox="0 0 24 22"><use href="#i-heart"/></svg> Đang gửi…';
    msg.classList.remove("show");
    // gửi + chờ tối thiểu để hiệu ứng kịp chạy
    await Promise.all([sendToSheet(entry).catch((err) => console.warn("Không gửi được lên Google Sheets:", err)), sleep(700)]);
    const list = loadWishes(); list.unshift(entry); saveWishes(list);
    renderWishes(wishKey(entry));
    form.reset();
    $("#feastSet").classList.remove("disabled");
    document.activeElement && document.activeElement.blur();

    btn.classList.remove("sending"); btn.classList.add("sent");
    btn.innerHTML = '<svg viewBox="0 0 24 24" class="btn-check" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg> Đã gửi lời chúc';
    msg.textContent = `Cảm ơn ${entry.name} đã gửi lời chúc! Lời chúc của bạn đang bay tới cô dâu chú rể…`;
    msg.classList.add("show");

    // phong thư bay từ nút gửi xuống góc dưới trái → bong bóng lời chúc nảy ra
    await flyLetter(btn);
    pushWish(entry, true);
    setTimeout(() => { btn.classList.remove("sent"); btn.innerHTML = label; btn.disabled = false; }, 2200);
  });

  function flyLetter(fromEl) {
    if (REDUCED || !fromEl.animate) return Promise.resolve();
    const a = fromEl.getBoundingClientRect();
    const fr = feed.getBoundingClientRect();
    const x0 = a.left + a.width / 2, y0 = a.top + a.height / 2;
    const x1 = fr.left + 34, y1 = fr.bottom - 26;
    const el = document.createElement("div");
    el.className = "fly-letter";
    el.innerHTML = `<svg viewBox="0 0 48 34"><rect x="1.5" y="1.5" width="45" height="31" rx="4"/><path d="M2.5 3l21.5 16L45.5 3"/></svg>
      <svg class="fl-heart" viewBox="0 0 24 22"><use href="#i-heart"/></svg>`;
    el.style.left = x0 + "px"; el.style.top = y0 + "px";
    document.body.appendChild(el);
    const dx = x1 - x0, dy = y1 - y0;
    const anim = el.animate([
      { transform: "translate(-50%,-50%) translate(0,0) scale(.3) rotate(0deg)", opacity: 0 },
      { transform: "translate(-50%,-50%) translate(0,-40px) scale(1.15) rotate(-8deg)", opacity: 1, offset: .22 },
      { transform: `translate(-50%,-50%) translate(${dx * .45}px, ${dy * .45 - 90}px) scale(1) rotate(10deg)`, opacity: 1, offset: .55 },
      { transform: `translate(-50%,-50%) translate(${dx}px, ${dy}px) scale(.45) rotate(-6deg)`, opacity: .9 }
    ], { duration: 1250, easing: "cubic-bezier(.45,.05,.35,1)", fill: "forwards" });
    return anim.finished.then(() => { el.remove(); burst(x1, y1, 10, 70); }).catch(() => el.remove());
  }

  /* ---------- Lời chúc nhảy liên tục ở góc dưới bên trái ---------- */
  const feed = $("#wishFeed");
  const MAX_BUBBLES = 2, GAP = 8;
  // xếp chồng mượt: mỗi bong bóng nằm trong 1 "ô" tự trượt lên khi có bong bóng mới
  function layoutFeed() {
    let y = 0;
    [...feed.children].filter((s) => !s.classList.contains("out")).reverse().forEach((s) => {
      s.style.transform = `translateY(${-y}px)`;
      y += s.offsetHeight + GAP;
    });
  }
  function pushWish(w, mine = false) {
    if (mine) feed.classList.remove("hide");
    const slot = document.createElement("div");
    slot.className = "wish-slot" + (mine ? " mine" : "");
    slot.dataset.key = wishKey(w);
    const initial = (w.name || "?").trim().charAt(0).toUpperCase();
    slot.innerHTML = `<div class="wish-bubble">
        <span class="wb-ava">${esc(initial)}</span>
        <span class="wb-body"><b>${esc(w.name)}${mine ? ' <em>· vừa gửi</em>' : ""}</b><span>${esc(w.message)}</span></span>
        <svg class="wb-heart" viewBox="0 0 24 22"><use href="#i-heart"/></svg>
      </div>
      <svg class="wb-float f1" viewBox="0 0 24 22"><use href="#i-heart"/></svg>
      <svg class="wb-float f2" viewBox="0 0 24 22"><use href="#i-heart"/></svg>`;
    feed.appendChild(slot);
    const live = [...feed.children].filter((el) => !el.classList.contains("out"));
    live.slice(0, Math.max(0, live.length - MAX_BUBBLES)).forEach((old) => {
      old.classList.add("out");
      setTimeout(() => old.remove(), 600);
    });
    layoutFeed();
  }
  (function rotateWishes() {
    let order = [], i = 0;
    const next = () => {
      const list = allWishes();
      if (!list.length) return null;
      if (i >= order.length) { order = list.map((_, k) => k).sort(() => Math.random() - 0.5); i = 0; }
      return list[order[i++]] || list[0];
    };
    // ẩn khi đang xem ảnh bìa để không che tên cô dâu chú rể
    let onCover = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => (onCover = e.intersectionRatio > 0.35), { threshold: [0, 0.35, 1] }).observe($("#cover"));
    }
    const showing = () => new Set([...feed.children].filter((el) => !el.classList.contains("out")).map((el) => el.dataset.key));
    const busy = () => onCover || document.hidden || $(".lightbox.open") || $(".modal.open") ||
      (document.activeElement && /INPUT|TEXTAREA/.test(document.activeElement.tagName));
    const tick = () => {
      if (busy()) feed.classList.add("hide");
      else {
        feed.classList.remove("hide");
        const on = showing(), total = allWishes().length;
        let w = next(), tries = 0;
        while (w && on.has(wishKey(w)) && tries++ < total) w = next();
        if (w && !on.has(wishKey(w))) pushWish(w);
        else if (w && total <= MAX_BUBBLES) { /* đã hiện đủ, chờ lượt sau */ }
      }
      setTimeout(tick, 2600);
    };
    setTimeout(tick, 1500);
  })();

  /* ---------- Nhạc nền ---------- */
  (function music() {
    const audio = $("#bgm"), btn = $("#musicBtn");
    let userPaused = false;
    let fadeT;
    const play = (fadeIn) => {
      if (!audio.src) audio.src = C.music;
      clearInterval(fadeT);
      audio.volume = fadeIn ? 0 : 0.6;
      audio.play().then(() => {
        btn.classList.add("playing");
        if (fadeIn) {
          fadeT = setInterval(() => {
            audio.volume = Math.min(0.6, audio.volume + 0.03);
            if (audio.volume >= 0.6) clearInterval(fadeT);
          }, 80);
        }
      }).catch(() => btn.classList.remove("playing"));
    };
    const pause = () => { audio.pause(); btn.classList.remove("playing"); };
    API.playMusic = (fadeIn) => { if (!userPaused && audio.paused) play(fadeIn); };
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (audio.paused) { userPaused = false; play(); } else { userPaused = true; pause(); }
    });
    // Trình duyệt chặn tự phát – bật nhạc ở lần chạm đầu tiên
    // (khi có phong bì thì phong bì tự bật nhạc, to dần)
    const firstTouch = () => { if (document.getElementById("opener")) return; if (!userPaused && audio.paused) play(); };
    ["pointerdown", "touchstart", "keydown"].forEach((ev) => document.addEventListener(ev, firstTouch, { once: true, passive: true }));
    audio.addEventListener("error", () => btn.classList.remove("playing"));
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && !audio.paused) { audio.pause(); audio.dataset.resume = "1"; }
      else if (!document.hidden && audio.dataset.resume) { delete audio.dataset.resume; play(); }
    });
  })();

  /* ---------- Tự cuộn ---------- */
  (function autoScroll() {
    const btn = $("#autoBtn"), doc = document.documentElement;
    let on = false, paused = false, raf = 0, last = 0, acc = 0, resumeT;
    const speed = () => (innerWidth >= 1024 ? 60 : 42); // px mỗi giây
    const busy = () => paused || document.hidden || $(".lightbox.open") || $(".modal.open") ||
      (document.activeElement && /INPUT|TEXTAREA/.test(document.activeElement.tagName));
    const atBottom = () => innerHeight + scrollY >= doc.scrollHeight - 2;
    const step = (t) => {
      if (!on) return;
      const dt = last ? Math.min(64, t - last) : 0; last = t;
      if (!busy()) {
        acc += (speed() * dt) / 1000;
        const px = Math.floor(acc);
        if (px >= 1) { acc -= px; window.scrollTo({ top: scrollY + px, behavior: "instant" }); }
        if (atBottom()) { stop(); return; }
      }
      raf = requestAnimationFrame(step);
    };
    // nhãn nhỏ cạnh nút: cho khách biết đang tự cuộn / đã chuyển sang cuộn tay
    const tipEl = $("#autoTip");
    let tipT;
    const tip = (text) => {
      tipEl.textContent = text; tipEl.classList.add("show");
      clearTimeout(tipT); tipT = setTimeout(() => tipEl.classList.remove("show"), 2600);
    };
    function start() {
      if (atBottom()) window.scrollTo({ top: 0, behavior: "instant" });
      on = true; paused = false; last = 0; acc = 0;
      doc.style.scrollBehavior = "auto";
      btn.classList.add("active"); btn.setAttribute("aria-pressed", "true");
      btn.setAttribute("aria-label", "Đang tự cuộn – bấm để cuộn tay");
      tip("Đang tự cuộn · bấm ⏸ để cuộn tay");
      raf = requestAnimationFrame(step);
    }
    function stop(byUser) {
      on = false; cancelAnimationFrame(raf); clearTimeout(resumeT);
      doc.style.scrollBehavior = "";
      btn.classList.remove("active"); btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", "Bật tự cuộn");
      if (byUser) tip("Đã chuyển sang cuộn tay");
    }
    // khách tự vuốt/cuộn → tạm dừng, ngừng tay 4 giây thì cuộn tiếp
    const userPause = () => {
      if (!on) return;
      paused = true; clearTimeout(resumeT);
      resumeT = setTimeout(() => { paused = false; last = 0; }, 4000);
    };
    ["wheel", "touchstart", "touchmove"].forEach((ev) => addEventListener(ev, userPause, { passive: true }));
    addEventListener("keydown", (e) => { if (/Arrow|Page|Home|End/.test(e.key) || e.key === " ") userPause(); });
    $$(".fab-menu a").forEach((a) => a.addEventListener("click", userPause));
    API.startAuto = () => { if (!on) start(); };
    btn.addEventListener("click", (e) => { e.stopPropagation(); on ? stop(true) : start(); });
    $(".scroll-hint").addEventListener("click", () => { if (!on) start(); });
  })();

  /* ---------- Menu nhanh ---------- */
  const wrap = $("#fabWrap"), fab = $("#fab");
  const setMenu = (open) => { wrap.classList.toggle("open", open); fab.setAttribute("aria-expanded", open); };
  fab.addEventListener("click", (e) => { e.stopPropagation(); setMenu(!wrap.classList.contains("open")); });
  $$(".fab-menu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("click", (e) => { if (!wrap.contains(e.target)) setMenu(false); });

  /* ---------- Hộp mừng cưới ---------- */
  const modal = $("#giftModal");
  $("#gifts").innerHTML = C.gifts.map((g) => `
    <div class="gift">
      <h4>${esc(g.label)}</h4>
      <img src="${esc(g.qr)}" alt="QR ${esc(g.label)}" loading="lazy">
      <p>${esc(g.bank)}</p><p><b>${esc(g.account)}</b></p><p>${esc(g.owner)}</p>
      <button class="copy" data-acc="${esc(g.account)}">Sao chép STK</button>
    </div>`).join("");
  const closeModal = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };
  $("#giftBtn").onclick = () => { modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; };
  $(".modal-close", modal).onclick = closeModal;
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
    const b = e.target.closest(".copy");
    if (b) navigator.clipboard?.writeText(b.dataset.acc).then(() => { b.textContent = "Đã sao chép ✓"; setTimeout(() => (b.textContent = "Sao chép STK"), 1800); });
  });

  /* ---------- Tim, lá & cánh hoa trôi ---------- */
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SVGNS = "http://www.w3.org/2000/svg";
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pickOne = (arr) => arr[(Math.random() * arr.length) | 0];
  const makeSvg = (id, vb, w, h) => {
    const el = document.createElementNS(SVGNS, "svg");
    el.setAttribute("viewBox", vb); el.setAttribute("width", w); el.setAttribute("height", h);
    el.innerHTML = `<use href="#${id}"/>`;
    return el;
  };

  /* ---------- Bộ màu thiệp (xanh lá / hồng pastel) + nút chọn màu ---------- */
  const THEMES = {
    green: { name: "Xanh lá pastel", meta: "#FFFFFF",
      burst: ["#5FAF7A", "#86B994", "#A9D3B4", "#F2B8C6", "#FFFFFF"],
      hearts: ["#86B994", "#A9D3B4", "#F2B8C6", "#5FAF7A"], leaves: ["#86B994", "#A9D3B4", "#BFE0C8"],
      music: ["#5FAF7A", "#86B994", "#F2B8C6"] },
    pink: { name: "Hồng pastel", meta: "#FFF6F9",
      burst: ["#E07FA0", "#F2A7BE", "#F8C9D7", "#FFFFFF", "#F6B8CB"],
      hearts: ["#F2A7BE", "#F8C9D7", "#E07FA0", "#FBD9E3"], leaves: ["#B9D8C2", "#CFE6D6", "#F3C2D1"],
      music: ["#E07FA0", "#F2A7BE", "#F8C9D7"] },
    teal: { name: "Xanh ngọc", meta: "#FFFFFF",
      burst: ["#4DB6AC", "#61C3BA", "#A6DED6", "#F2B8C6", "#FFFFFF"],
      hearts: ["#61C3BA", "#A6DED6", "#F2B8C6", "#4DB6AC"], leaves: ["#86C9B5", "#A6DED6", "#C3EAE4"],
      music: ["#4DB6AC", "#61C3BA", "#F2B8C6"] },
    sky: { name: "Xanh da trời pastel", meta: "#FFFFFF",
      burst: ["#6BB8DA", "#8CCDE6", "#B8E5F4", "#F2B8C6", "#FFFFFF"],
      hearts: ["#8CCDE6", "#B8E5F4", "#F2B8C6", "#6BB8DA"], leaves: ["#9FCFB8", "#B8E5F4", "#CFE6D6"],
      music: ["#6BB8DA", "#8CCDE6", "#F2B8C6"] }
  };
  const fx = () => THEMES[document.documentElement.dataset.theme] || THEMES.green;
  (function themeSetup() {
    const html = document.documentElement, picker = $("#themePicker");
    const pickerOn = C.themePicker !== false;
    const q = new URLSearchParams(location.search).get("theme");
    let saved = null;
    try { saved = localStorage.getItem("wedding-theme"); if (!pickerOn) localStorage.removeItem("wedding-theme"); } catch {}
    const valid = (t) => Object.prototype.hasOwnProperty.call(THEMES, t);
    const apply = (t) => {
      html.dataset.theme = t;
      const meta = $('meta[name="theme-color"]'); if (meta) meta.content = THEMES[t].meta;
      $$("button[data-theme]", picker).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.theme === t)));
    };
    apply(valid(q) ? q : pickerOn && valid(saved) ? saved : valid(C.theme) ? C.theme : "green");
    if (!pickerOn) { picker.remove(); return; }
    picker.hidden = false;
    picker.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-theme]"); if (!b) return;
      e.stopPropagation();
      html.classList.add("theme-anim");
      apply(b.dataset.theme);
      try { localStorage.setItem("wedding-theme", b.dataset.theme); } catch {}
      const r = b.getBoundingClientRect();
      setTimeout(() => burst(r.left + r.width / 2, r.top + r.height / 2, 10, 60), 0);
      setTimeout(() => html.classList.remove("theme-anim"), 700);
    });
  })();

  (function floaters() {
    if (REDUCED) return;
    const box = $("#floaters");
    const kinds = [
      { id: "i-heart", vb: "0 0 24 22", colors: () => fx().hearts, size: [9, 15], w: 5 },
      { id: "i-leaf", vb: "0 0 20 20", colors: () => fx().leaves, size: [10, 17], w: 3 },
      { id: "i-petal", vb: "0 0 20 20", colors: () => ["#FFFFFF"], size: [10, 15], w: 2 }
    ];
    const pool = kinds.flatMap((k) => Array(k.w).fill(k));
    const spawn = () => {
      if (document.hidden || box.childElementCount > 18) return;
      const k = pickOne(pool), size = rnd(...k.size);
      const el = makeSvg(k.id, k.vb, size, size);
      el.style.fill = pickOne(k.colors());
      if (k.id === "i-petal") el.style.filter = "drop-shadow(0 0 2px rgba(0,0,0,.25))";
      el.style.left = rnd(0, 100) + "%";
      el.style.setProperty("--dx", rnd(-70, 70) + "px");
      el.style.setProperty("--rot", rnd(-300, 300) + "deg");
      el.style.animationDuration = rnd(9, 16) + "s";
      el.addEventListener("animationend", () => el.remove());
      box.appendChild(el);
    };
    setInterval(spawn, 1000);
  })();

  /* ---------- Chùm tim bung ra ---------- */
  function burst(x, y, n = 8, dist = 70) {
    if (REDUCED) return;
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n + rnd(-0.3, 0.3), d = rnd(dist * 0.5, dist);
      const color = pickOne(fx().burst);
      const el = makeSvg("i-heart", "0 0 24 22", 16, 15);
      el.classList.add("burst");
      el.style.left = x + "px"; el.style.top = y + "px";
      el.style.fill = color;
      if (color === "#FFFFFF") el.style.filter = "drop-shadow(0 0 2px rgba(0,0,0,.35))";
      el.style.setProperty("--tx", Math.cos(a) * d + "px");
      el.style.setProperty("--ty", Math.sin(a) * d - 20 + "px");
      el.style.setProperty("--r", rnd(-60, 60) + "deg");
      el.style.setProperty("--s", rnd(0.7, 1.4));
      el.addEventListener("animationend", () => el.remove());
      document.body.appendChild(el);
    }
  }
  // chạm vào chỗ trống bất kỳ → tim bung
  document.addEventListener("pointerdown", (e) => {
    if (e.target.closest("a, button, input, textarea, label, .lightbox, .modal, .fab-wrap, #opener")) return;
    burst(e.clientX, e.clientY, 7, 60);
  }, { passive: true });

  /* ---------- Decor: ảnh bìa, góc lá, phân cách, khung ảnh ---------- */
  (function decor() {
    // Dòng chữ thảo trên tên cô dâu chú rể
    const kicker = document.createElement("p");
    kicker.className = "cover-kicker"; kicker.textContent = "Lưu lại ngày vui";
    $(".cover-text").prepend(kicker);

    // tim bay lên + lấp lánh trên ảnh bìa
    if (!REDUCED) {
      const fx = document.createElement("div");
      fx.className = "cover-fx";
      for (let i = 0; i < 14; i++) {
        const sz = rnd(10, 22);
        const h = makeSvg("i-heart", "0 0 24 22", sz, sz * 0.92);
        h.classList.add("rise");
        h.style.left = rnd(2, 96) + "%";
        h.style.setProperty("--sx", rnd(-30, 30) + "px");
        h.style.animationDuration = rnd(7, 13) + "s";
        h.style.animationDelay = -rnd(0, 13) + "s";
        fx.appendChild(h);
      }
      for (let i = 0; i < 16; i++) {
        const sp = document.createElement("span");
        sp.className = "spark";
        sp.style.left = rnd(3, 95) + "%"; sp.style.top = rnd(3, 70) + "%";
        sp.style.animationDelay = rnd(0, 2.6) + "s";
        fx.appendChild(sp);
      }
      $(".cover-shade").after(fx);
    }

    // hoa màu nước ở góc các phần
    const D = "images/decor/";
    const deco = (file, cls) => {
      const im = document.createElement("img");
      im.src = D + file + ".webp"; im.alt = ""; im.className = "deco " + cls;
      im.setAttribute("aria-hidden", "true"); im.loading = "lazy"; im.decoding = "async"; im.draggable = false;
      return im;
    };
    [[".invite", ["tl", "tr"]], [".when", ["tr", "bl"]], [".guestbook", ["tl", "tr"]],
     [".footer", ["tl", "tr", "bl", "br"]]].forEach(([sel, pos]) => {
      const sec = $(sel); if (!sec) return;
      pos.forEach((p) => sec.prepend(deco("floral-corner", "fc " + p)));
    });
    // cành hoa nhỏ hai bên dresscode
    const dress = $(".dress");
    if (dress) dress.prepend(deco("floral-sprig", "sprig-l"), deco("floral-sprig", "sprig-r"));

    // cành hoa ôm góc khung ảnh thư mời
    $(".frame-photo").append(deco("floral-sprig", "frame-fl"));

    // dây hoa phân cách giữa các phần
    [".families", ".when", ".schedule", ".footer"].forEach((sel) => {
      const sec = $(sel); if (!sec) return;
      const wrap = document.createElement("div");
      wrap.className = "divider-wrap";
      const g = deco("floral-garland", "garland"); g.loading = "lazy";
      wrap.appendChild(g);
      sec.before(wrap);
    });
  })();

  /* ---------- Tim bay ra từ đĩa nhạc khi đang phát ---------- */
  (function musicHearts() {
    if (REDUCED) return;
    const btn = $("#musicBtn");
    setInterval(() => {
      if (!btn.classList.contains("playing") || document.hidden) return;
      const r = btn.getBoundingClientRect();
      const el = makeSvg("i-heart", "0 0 24 22", 14, 13);
      el.classList.add("note-heart");
      el.style.left = r.left + r.width / 2 - 7 + "px"; el.style.top = r.top + "px";
      el.style.fill = pickOne(fx().music);
      el.style.setProperty("--nx", rnd(-40, 5) + "px");
      el.addEventListener("animationend", () => el.remove());
      document.body.appendChild(el);
    }, 900);
  })();

  /* ---------- Chạm đúp ảnh trong album → tim lớn ---------- */
  (function doubleTapLove() {
    const lb = $("#lightbox"), img = $("#lbImg");
    const big = makeSvg("i-heart", "0 0 24 22", 110, 100); big.setAttribute("class", "lb-heart");
    lb.appendChild(big);
    let last = 0;
    img.addEventListener("pointerup", (e) => {
      const now = Date.now();
      if (now - last < 300) {
        big.classList.remove("pop"); void big.getBoundingClientRect(); big.classList.add("pop");
        burst(e.clientX, e.clientY, 10, 110);
        last = 0;
      } else last = now;
    });
  })();

  /* ---------- Pháo tim khi gửi lời chúc ---------- */
  $("#gbForm").addEventListener("submit", () => {
    const b = $("#gbForm button[type=submit]").getBoundingClientRect();
    setTimeout(() => burst(b.left + b.width / 2, b.top + b.height / 2, 18, 140), 50);
  });

  /* ---------- Màn hình mở thiệp (phong bì) ---------- */
  (function opener() {
    const op = $("#opener");
    const cfg = C.opener || {};
    if (!op) return;
    if (cfg.enabled === false) {
      op.remove();
      // không có phong bì → tự cuộn ngay sau khi tải trang
      if (C.autoScroll !== false) setTimeout(() => API.startAuto && API.startAuto(), cfg.autoScrollDelay ?? 1500);
      return;
    }
    const html = document.documentElement;
    html.classList.add("locked");
    $("#opGuest").textContent = guest ? guest.trim().slice(0, 60) : C.defaultGuest;
    $("#opNames").textContent = `${C.groom.shortName} & ${C.bride.shortName}`;
    $("#opDate").textContent = C.coverDate;
    // hoa màu nước ở góc màn hình mở thiệp
    ["tl", "br"].forEach((p) => {
      const im = document.createElement("img");
      im.src = "images/decor/floral-corner.webp"; im.alt = ""; im.className = "deco fc op-fc " + p;
      im.setAttribute("aria-hidden", "true");
      op.appendChild(im);
    });
    ["tr", "bl"].forEach((p) => {
      const im = document.createElement("img");
      im.src = "images/decor/floral-sprig.webp"; im.alt = ""; im.className = "deco op-sprig " + p;
      im.setAttribute("aria-hidden", "true");
      op.appendChild(im);
    });
    // tên trên ảnh bìa sẽ hiện mờ → rõ sau khi mở thiệp
    const names = $$(".cover .fade-name");
    setTimeout(() => names.forEach((el) => el.classList.remove("show")), 260);

    // giải mã trước ảnh bìa để lúc lộ ra không bị khựng
    const cover = $("#cover");
    cover.classList.add("pre");
    const coverUrl = (getComputedStyle($("#coverImg")).backgroundImage.match(/url\("?(.*?)"?\)/) || [])[1];
    if (coverUrl) { const im = new Image(); im.src = coverUrl; im.decode && im.decode().catch(() => {}); }

    let opened = false;
    const T = { exit: 1200, unlock: 2400, remove: 2550 }; // mốc thời gian (ms)
    const open = () => {
      if (opened) return;
      opened = true;
      API.playMusic && API.playMusic(true); // trong cú chạm → điện thoại cho phát nhạc; nhạc to dần
      const seal = $(".env-seal").getBoundingClientRect();
      burst(seal.left + seal.width / 2, seal.top + seal.height / 2, 14, 120);
      const env = $("#envelope");
      env.classList.add("open");
      setTimeout(() => env.classList.add("flap-back"), 320);
      op.classList.add("opening");
      // máy quay "bay" vào thiệp: phong bì phóng to + mờ, ảnh bìa thu về
      setTimeout(() => {
        requestAnimationFrame(() => {
          op.classList.add("gone");
          cover.classList.remove("pre");
          cover.classList.add("revealed");
          names.forEach((el) => el.classList.add("show"));
        });
      }, T.exit);
      setTimeout(() => html.classList.remove("locked"), T.unlock);
      setTimeout(() => op.remove(), T.remove);
      if (C.autoScroll !== false) setTimeout(() => API.startAuto && API.startAuto(), T.unlock + (cfg.autoScrollDelay ?? 1500));
    };
    op.addEventListener("click", open);
    op.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    $(".env-seal").focus({ preventScroll: true });
  })();
  /* ---------- Sticker nhân vật chibi ---------- */
  (function stickers() {
    if (C.stickers === false) return;
    const P = "images/stickers/";
    const list = [
      { sel: ".frame-photo", img: "girl-wave", cls: "stk-girl", alt: "Bé gái vẫy tay" },
      { sel: ".families", img: "groom-thumbs", cls: "stk-fam-l", alt: "Chú rể giơ ngón cái" },
      { sel: ".families", img: "bride-shy", cls: "stk-fam-r", alt: "Cô dâu e thẹn" },
      { sel: ".schedule", img: "groom-hearteyes", cls: "stk-sched", alt: "Chú rể mắt tim" },
      { sel: ".guestbook", img: "bride-kiss", cls: "stk-gb", alt: "Cô dâu hôn gió" },
      { sel: ".footer .sign", img: "couple-heart", cls: "stk-footer", alt: "Cô dâu chú rể bắn tim", before: true }
    ];
    const io = "IntersectionObserver" in window
      ? new IntersectionObserver((ents) => ents.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); }
        }), { threshold: 0.3 })
      : null;
    list.forEach((s, i) => {
      const host = $(s.sel); if (!host) return;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "sticker " + s.cls;
      b.setAttribute("aria-label", s.alt);
      b.style.setProperty("--delay", (i % 2) * 0.15 + "s");
      b.innerHTML = `<img src="${P + s.img}.webp" alt="${esc(s.alt)}" loading="lazy" decoding="async" draggable="false">`;
      if (s.before) host.before(b); else host.appendChild(b);
      if (io) io.observe(b); else b.classList.add("show");
      // chạm sticker → nhảy lên + bung tim
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        const img = b.firstElementChild;
        img.classList.remove("jump"); void img.offsetWidth; img.classList.add("jump");
        const r = b.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height * 0.35, 10, 90);
      });
    });
  })();
})();
