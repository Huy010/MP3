/*
1. Render Songs
2. Scroll top
3. P;ay/ pause / seek
4. CD rotate
5. Next / Prev
6. Random
7. Next / repeat when ended
8. Active song
9. Scroll active song into view
10. Play song when click
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "F8_PLAYER";

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const plyaBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  viet: [
    {
      name: "Một Mình Có Buồn Không",
      singer: "Thiều Bảo Trâm ft. Lou Hoàng",
      path: "./assets/Nhac/NhacViet/MotMinhCoBuoKhong.mp3",
      image: "./assets/Nhac/HinhAnh/MotMinhCoBuonKhong.jpg",
    },
    {
      name: "CLME",
      singer: "Andree ft. Hoàng Tôn",
      path: "./assets/Nhac/NhacViet/CLME.mp3",
      image: "./assets/Nhac/HinhAnh/CLME.jpg",
    },
    {
      name: "24h",
      singer: "Lyly",
      path: "./assets/Nhac/NhacViet/24H.mp3",
      image: "./assets/Nhac/HinhAnh/24H.jpg",
    },
    {
      name: "Anh Đánh Rơi Người Yêu Này",
      singer: "Amee",
      path: "./assets/Nhac/NhacViet/AnhDanhRoiNguoiYeuNay.mp3",
      image: "./assets/Nhac/HinhAnh/AnhDanhRoiNguoiYeuNay.jpg",
    },
    {
      name: "Craze",
      singer: "Châu Đăng Khoa ft. Karik",
      path: "./assets/Nhac/NhacViet/Craze.mp3",
      image: "./assets/Nhac/HinhAnh/Craze.jpg",
    },
    {
      name: "Mascara",
      singer: "Chillies",
      path: "./assets/Nhac/NhacViet/MASCara.mp3",
      image: "./assets/Nhac/HinhAnh/MASCARA.jpg",
    },
    {
      name: "Mượn Rượu Tỏ Tình",
      singer: "Big Daddy ft. Emily",
      path: "./assets/Nhac/NhacViet/MuonRuoToTinh.mp3",
      image: "./assets/Nhac/HinhAnh/MuonRuoToTinh.jpg",
    },
    {
      name: "Nếu Có Lúc",
      singer: "TAKAYZ x YANBI",
      path: "./assets/Nhac/NhacViet/NeuCoLuc.mp3",
      image: "./assets/Nhac/HinhAnh/NeuCoLuc.jpg",
    },
    {
      name: "Thêm Bao Nhiêu Lâu",
      singer: "Đạt G",
      path: "./assets/Nhac/NhacViet/ThembaoNhieuLau.mp3",
      image: "./assets/Nhac/HinhAnh/ThemBaoNhieuLam.jpg",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.viet.map((viet, index) => {
      return `
            <div class="song ${
              index === this.currentIndex ? "active" : ""
            }" data-index="${index}">
                <div class="song-thumb" style="background-image: url('${
                  viet.image
                }')"></div>
                <div class="body">
                    <h3 class="title">${viet.name}</h3>
                    <span class="author">${viet.singer}</span>

                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    //Tạo thuộc tính currentSong cho App
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.viet[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const cdWidth = cd.offsetWidth;

    //Xử lý CD quay và dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 13000, //10 seconds
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // Xử lý phóng to / thu nhỏ cd
    document.onscroll = function () {
      const scrolltop = window.scrollY;
      const newCdWidth = cdWidth - scrolltop;

      cd.style.width = newCdWidth >= 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    //Xử lý khi click vào nút play
    plyaBtn.onclick = function () {
      if (app.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    //Khi bài hát play
    audio.onplay = function () {
      plyaBtn.classList.add("active");
      app.isPlaying = true;
      cdThumbAnimate.play();
    };
    //Khi bài hát pause
    audio.onpause = function () {
      plyaBtn.classList.remove("active");
      app.isPlaying = false;
      cdThumbAnimate.pause();
    };

    //Xử lý khi tua bài hát
    progress.oninput = function (e) {
      const seekTime = (e.target.value / 100) * audio.duration;
      audio.currentTime = seekTime.toFixed(0);
      audio.pause;
    };

    //Khi bài hát chạy thì thanh trạng thái thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime.toFixed(0) * 100) / audio.duration
        );
        progress.value = progressPercent;
        // console.log(progressPercent);
        // console.log(audio.currentTime);
      }
    };

    //Khi click vào nút next
    nextBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.nextSong();
      }
      audio.play();
      app.render();
      app.scrollToActiveSong();
    };

    // Khi click vào nút prev
    prevBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.prevSong();
      }
      audio.play();
      app.render();
      app.scrollToActiveSong();
    };

    //Khi nhấn nút Repeat
    repeatBtn.onclick = function () {
      app.isRepeat = !app.isRepeat;
      app.setConfig("isRepeat", app.isRepeat);
      repeatBtn.classList.toggle("active", app.isRepeat);
    };

    //Khi nhấn nút random
    randomBtn.onclick = function () {
      app.isRandom = !app.isRandom;
      app.setConfig("isRandom", app.isRandom);
      randomBtn.classList.toggle("active", app.isRandom); //nếu isRandom là true thì add class active và ngược lại
    };

    //Khi bài hát kết thúc thì...
    audio.onended = function () {
      if (app.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    //Lắng nghe hành vi click vào Playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        //Xử lý khi click vào song
        if (songNode) {
          app.currentIndex = Number(songNode.dataset.index);
          app.loadCurrentSong();
          app.render();
          audio.play();
        }

        //Xử lý khi click vào Option
        if (e.target.closest(".option")) {
        }
      }
    };
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.viet.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.viet.length - 1;
    }
    this.loadCurrentSong();
  },

  playRandomSong: function () {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * this.viet.length);
    } while (nextIndex == this.currentIndex);
    this.currentIndex = nextIndex;
    this.loadCurrentSong();
  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 500);
  },
  srart: function () {
    //Đọc config từ ứng dụng
    this.loadConfig();
    //Định nghĩa các thuộc tính cho object
    this.defineProperties();

    //Lắng nghe và xử lý các sự kiện
    this.handleEvents();

    //Tải thông tin bài hát đầu tiên vào UI(user interface) khi chạy ứng dụng
    this.loadCurrentSong();

    //Render playlist
    this.render();


    //Hiển thị trại thái ban đầu của button repeat và random
    repeatBtn.classList.toggle("active", app.isRepeat);
    randomBtn.classList.toggle("active", app.isRandom); //nếu isRandom là true thì add class active và ngược lại
  },
};

app.srart();
