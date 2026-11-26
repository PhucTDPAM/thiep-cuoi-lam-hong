/* =========================================================
   CẤU HÌNH THIỆP CƯỚI – chỉ cần sửa file này
   ========================================================= */
window.WEDDING = {
  // --- Cô dâu & chú rể ---
  groom: { shortName: "Lâm", fullName: "Trần Lâm" },
  bride: { shortName: "Hồng", fullName: "Vũ Hồng" },

  // Ngày hiển thị ở ảnh bìa
  coverDate: "16 – 17.01.2027",
  // Mốc chính để đếm ngược (Lễ thành hôn, giờ Việt Nam)
  mainDateTime: "2027-01-17T11:00:00+07:00",

  // --- Màn hình mở thiệp (phong bì) ---
  opener: {
    enabled: true,              // false = bỏ phong bì, vào thẳng thiệp
    autoScrollDelay: 1500       // mở thiệp xong chờ bao lâu (ms) rồi bắt đầu tự cuộn
  },
  // Tự cuộn mặc định: khách muốn cuộn tay thì bấm nút ⏸ dưới đĩa nhạc. false = tắt
  autoScroll: true,

  // --- Màu thiệp: "green" (xanh lá pastel) | "pink" (hồng pastel) | "teal" (xanh ngọc #61C3BA) | "sky" (xanh da trời #B8E5F4) ---
  theme: "green",
  // Hiện nút chọn màu ở góc trên để so sánh. Chốt màu xong: đặt theme ở trên rồi đổi thành false
  themePicker: true,

  // --- Lời mời ---
  defaultGuest: "Quý khách",
  inviteQuote: "Trân trọng kính mời quý khách dành thời gian quý giá tham dự lễ cưới của chúng tôi",
  inviteQuoteEn: "Chúng mình đã cùng nhau viết nên câu chuyện tình yêu suốt bao năm… và chương mới sẽ bắt đầu từ đây",

  // --- Hai gia đình ---
  families: {
    groom: { title: "Nhà Trai", father: "Ông Trần Đức Nam", mother: "Bà Nguyễn Thị Chọn", place: "Thôn Tráng Liệt 2, xã Thanh Hà, Hải Phòng" },
    bride: { title: "Nhà Gái", father: "Ông Nguyễn Văn Ngọt", mother: "Bà Vũ Thị Phượng", place: "TDP Văn An, phường Chu Văn An, Hải Phòng" }
  },

  // --- Các sự kiện (mỗi ngày một địa điểm) ---
  // Thứ trong tuần tự tính từ "date". mapUrl: thay bằng link ghim chính xác trên Google Maps nếu có.
  events: [
    {
      id: "an-hoi",
      name: "Lễ Ăn Hỏi",
      date: "2027-01-16",
      time: "15:00",
      duration: 3, // số giờ – dùng cho nút "Thêm vào lịch"
      lunar: "Tức ngày 09 tháng 12 năm Bính Ngọ",
      venueTitle: "Tư Gia Nhà Gái",
      address: "Tổ dân phố Văn An, phường Chu Văn An, thành phố Hải Phòng",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=T%E1%BB%95+d%C3%A2n+ph%E1%BB%91+V%C4%83n+An%2C+ph%C6%B0%E1%BB%9Dng+Chu+V%C4%83n+An%2C+H%E1%BA%A3i+Ph%C3%B2ng"
    },
    {
      id: "thanh-hon",
      name: "Lễ Thành Hôn",
      date: "2027-01-17",
      time: "11:00",
      duration: 3,
      lunar: "Tức ngày 10 tháng 12 năm Bính Ngọ",
      venueTitle: "Tư Gia Nhà Trai",
      address: "Thôn Tráng Liệt 2, xã Thanh Hà, thành phố Hải Phòng",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Th%C3%B4n+Tr%C3%A1ng+Li%E1%BB%87t+2%2C+Thanh+H%C3%A0%2C+H%E1%BA%A3i+Ph%C3%B2ng"
    }
  ],

  // --- Lịch trình (icon: dinner | rings | arch | cake) ---
  schedule: [
    { day: "Thứ Bảy · 16/01/2027", items: [
      { time: "07:00", title: "Khai tiệc nhà gái", desc: "Mời quý khách dùng bữa cùng gia đình nhà gái", icon: "dinner" },
      { time: "15:00", title: "Lễ ăn hỏi", desc: "Nghi lễ ăn hỏi tại tư gia nhà gái", icon: "cake" }
    ]},
    { day: "Chủ Nhật · 17/01/2027", items: [
      { time: "08:00", title: "Khai tiệc nhà trai", desc: "Mời quý khách dùng bữa cùng gia đình nhà trai", icon: "dinner" },
      { time: "11:00", title: "Lễ thành hôn", desc: "Cùng nhau chứng kiến khoảnh khắc thiêng liêng tại nhà trai", icon: "rings" }
    ]}
  ],

  // --- Trang phục (dresscode) ---
  dresscode: ["#FFFFFF", "#1E1E1E", "#8E8E93", "#CFCFD4", "#F5EFE3"],

  // --- Ảnh (đặt trong /images; thay các file .svg giữ chỗ bằng ảnh thật rồi sửa đuôi ở đây) ---
  images: {
    cover: "images/cover.jpg",                 // ảnh bìa điện thoại (ảnh dọc 9:16)
    coverDesktop: "images/cover-desktop.jpg",  // ảnh bìa máy tính (ảnh ngang 16:9)
    invite: "images/invite.jpg",
    polaroidLeft: "images/polaroid-1.jpg",
    polaroidRight: "images/polaroid-2.jpg",
    timeline: "images/timeline.jpg"
  },
  memoriesText: "Những khoảnh khắc đẹp nhất của chúng mình – ngập tràn yêu thương, tiếng cười và lời hẹn ước. Mỗi bức ảnh là một trang kỷ niệm, để mai này nhìn lại vẫn thấy lòng ấm áp.",
  album: [
    "images/album-1.jpg", "images/album-3.jpg", "images/album-2.jpg",
    "images/album-4.jpg", "images/album-7.jpg", "images/album-5.jpg", "images/album-6.jpg",
    "images/polaroid-1.jpg", "images/polaroid-2.jpg"
  ],

  // --- Nhạc nền: đặt file bài "Một Nhà" vào thư mục gốc với tên music.mp3 ---
  music: "music.mp3",

  // --- Sổ lưu bút & xác nhận tham dự ---
  guestbook: {
    // Dán URL Web App của Google Apps Script vào đây để lưu lên Google Sheets (xem README.md)
    googleScriptUrl: "",
    // true = hiện 20 lời chúc mẫu. Khi đã có lời chúc thật, đổi thành false
    showSamples: true,
    samples: [
      // Lời chúc mẫu để demo – xoá bớt khi đã có lời chúc thật
      { name: "Minh Anh", message: "Chúc hai bạn trăm năm hạnh phúc, sớm có tin vui nhé!", side: "Nhà gái" },
      { name: "Tuấn Kiệt", message: "Chúc mừng đám cưới! Mãi yêu thương nhau như ngày đầu nhé.", side: "Nhà trai" },
      { name: "Cô Hạnh", message: "Chúc hai con thuận vợ thuận chồng, tát biển Đông cũng cạn. Cô mừng lắm!", side: "Nhà gái" },
      { name: "Chú Bình", message: "Chúc cháu Lâm và cháu Hồng bách niên giai lão, con cháu đầy nhà.", side: "Nhà trai" },
      { name: "Thu Trang", message: "Cuối cùng thì Hồng cũng lấy chồng rồi 😭 Chúc bà luôn được chiều như công chúa nhé!", side: "Nhà gái" },
      { name: "Đức Mạnh", message: "Chúc mừng ông bạn thân! Cưới rồi thì nhớ thương vợ, lo cho gia đình nha.", side: "Nhà trai" },
      { name: "Phương Linh", message: "Hạnh phúc không phải là tìm được người hoàn hảo, mà là cùng nhau trở nên hoàn hảo. Chúc hai bạn!", side: "Nhà gái" },
      { name: "Anh Quân", message: "Chúc hai em mãi nắm tay nhau đi qua mọi nắng mưa cuộc đời.", side: "Nhà trai" },
      { name: "Bà Nội", message: "Bà chúc hai cháu sống hoà thuận, thương yêu nhau, sớm cho bà bế chắt.", side: "Nhà trai" },
      { name: "Ngọc Ánh", message: "Một nhà vui vẻ, một đời bình an. Chúc Lâm & Hồng mãi hạnh phúc!", side: "Nhà gái" },
      { name: "Hoàng Long", message: "Chúc anh chị cưới vui, sống vui, già đi cùng nhau thật chậm.", side: "Nhà trai" },
      { name: "Mai Hương", message: "Từ hôm nay có người nấu cơm chờ, có người đợi cửa. Chúc hai bạn ấm êm!", side: "Nhà gái" },
      { name: "Văn Toàn", message: "Chúc mừng hạnh phúc! Đồng tâm hợp lực, xây tổ ấm thật vững bền.", side: "Nhà trai" },
      { name: "Khánh Vy", message: "Chúc chị Hồng xinh đẹp mãi được anh Lâm cưng chiều như ngày đầu 💕", side: "Nhà gái" },
      { name: "Thầy Tuấn", message: "Chúc hai em xây dựng gia đình hạnh phúc, sự nghiệp vững vàng.", side: "Nhà trai" },
      { name: "Bảo Ngọc", message: "Yêu thương là khi cùng nhìn về một hướng. Chúc hai bạn mãi đồng lòng!", side: "Nhà gái" },
      { name: "Quang Huy", message: "Chúc chú rể đẹp trai, cô dâu xinh gái một đời êm đềm như hôm nay.", side: "Nhà trai" },
      { name: "Dì Lan", message: "Dì chúc hai con trăm năm hạnh phúc, sớm sinh quý tử, gia đạo bình an.", side: "Nhà gái" },
      { name: "Hữu Thắng", message: "Chúc mừng đám cưới! Mong rằng mỗi ngày bên nhau đều là một ngày vui.", side: "Nhà trai" },
      { name: "Lan Chi", message: "Chúc hai bạn luôn giữ được nụ cười như trong ngày cưới, bên nhau đến đầu bạc răng long.", side: "Nhà gái" }
    ]
  },

  // --- Hộp mừng cưới (sửa thông tin & thay ảnh QR) ---
  gifts: [
    { label: "Mừng cưới chú rể", bank: "Tên ngân hàng", account: "0000000000", owner: "TRAN LAM", qr: "images/qr-groom.svg" },
    { label: "Mừng cưới cô dâu", bank: "Tên ngân hàng", account: "0000000000", owner: "VU HONG", qr: "images/qr-bride.svg" }
  ],

  // Sticker nhân vật chibi (images/stickers). false = tắt
  stickers: true,

  thankYou: "Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng tôi. Xin chân thành cảm ơn!"
};
