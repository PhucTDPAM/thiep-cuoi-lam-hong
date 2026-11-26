/* =========================================================
   XƯNG HÔ – cô dâu chú rể tự xưng thế nào với từng khách
   Dùng chung cho thiệp (index.html) và trang admin (admin.html)
   ========================================================= */
(function () {
  // mã (đi kèm link ?xung=...) → cách cô dâu chú rể tự xưng
  const OPTIONS = [
    { code: "con",    ta: "chúng con",   hint: "Bố mẹ" },
    { code: "chau",   ta: "chúng cháu",  hint: "Ông bà, bác, chú, cô, dì…" },
    { code: "em",     ta: "chúng em",    hint: "Anh chị, thầy cô" },
    { code: "anhchi", ta: "anh chị",     hint: "Em" },
    { code: "minh",   ta: "chúng mình",  hint: "Bạn bè" },
    { code: "toi",    ta: "chúng tôi",   hint: "Trang trọng / chung" }
  ];
  const BY_CODE = Object.fromEntries(OPTIONS.map((o) => [o.code, o]));

  // danh xưng của khách → mã tự xưng (xét từ đầu tên, bỏ qua "gia đình", "vợ chồng"…)
  const RULES = {
    con: ["bố", "mẹ", "ba", "má", "cha", "u", "thầy u", "tía"],
    chau: ["ông", "bà", "bác", "chú", "cô", "dì", "cậu", "mợ", "thím", "dượng", "bá", "o", "cụ"],
    em: ["anh", "chị", "thầy", "sếp", "anh chị"],
    anhchi: ["em", "các em"],
    minh: ["bạn", "các bạn", "hội", "nhóm", "team"]
  };
  const SKIP = ["gia", "đình", "vợ", "chồng", "cả", "nhà", "và", "&", "kính", "gửi", "thân", "tặng"];

  function detect(name) {
    const words = String(name || "").toLowerCase().normalize("NFC").replace(/[.,;:!?()]/g, " ").split(/\s+/).filter(Boolean);
    if (!words.length) return "toi";
    for (let i = 0; i < Math.min(words.length, 4); i++) {
      const w = words[i], two = w + " " + (words[i + 1] || "");
      if (SKIP.includes(w)) continue;
      for (const code of Object.keys(RULES)) if (RULES[code].includes(two)) return code;
      for (const code of Object.keys(RULES)) if (RULES[code].includes(w)) return code;
      break; // gặp từ đầu tiên không phải danh xưng → coi là tên riêng
    }
    return "minh"; // chỉ có tên riêng (VD "Phúc") → xưng thân mật
  }
  const valid = (code) => Object.prototype.hasOwnProperty.call(BY_CODE, code);
  const ta = (code) => (BY_CODE[code] || BY_CODE.toi).ta;

  window.XUNGHO = { OPTIONS, detect, valid, ta };
})();
