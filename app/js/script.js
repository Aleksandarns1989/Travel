// DROPDOWN MENU
const languageButton = document.querySelector(".js-language-dropdown-button");

languageButton.addEventListener("click", (e) => {
  e.currentTarget.classList.toggle("dropdown__button-active");
});

document.addEventListener("click", (e) => {
  // console.log(e.target.classList.contains("js-language-dropdown-button"));
  if (
    !e.target.classList.contains("js-language-dropdown-item") &&
    !e.target.classList.contains("js-language-dropdown-list") &&
    !e.target.classList.contains("js-language-dropdown-button") &&
    !e.target.classList.contains("js-language-dropdown-text")
  ) {
    languageButton.classList.remove("dropdown__button-active");
  }
});

// // ACTIVE HEADER
// const navItems = document.getElementsByClassName("js-nav-item");

// for (var i = 0; i < navItems.length; i++) {
//   navItems[i].addEventListener("click", function () {
//     var current = document.getElementsByClassName("js-header-nav-active");
//     current[0].className = current[0].className.replace(
//       " js-header-nav-active",
//       ""
//     );
//     this.className += " js-header-nav-active";
//   });
// }

// TOGGLE MENU
const headerEl = document.querySelector("body");

document
  .querySelector(".js-menu-toggle-button")
  .addEventListener("click", function () {
    headerEl.classList.toggle("menu-toggle-active");
  });

// OPEN SEARCH BAR

const searchButton = document.querySelector(".js-header-search-button");
const header = document.querySelector(".js-header");
const closeButton = document.querySelector(".js-search-container-close");

searchButton.addEventListener("click", () => {
  header.classList.toggle("header__search--open");
});

closeButton.addEventListener("click", () => {
  header.classList.toggle("header__search--open");
});

// POPUP

const overlayPopup = document.querySelector(".js-video-popup-overlay");
const popupVideo = document.querySelector(".js-popup-iframe");
const popupOpen = document.querySelector(".js-btn-play");
const popupClose = document.querySelector(".js-close-popup");
const youTubeApi = "https://www.youtube.com/iframe_api";
const popupClass = "popup-overlay--opened";

let player = null;
let isVideoBuild = false;

function injectApi(api) {
  const tag = document.createElement("script");
  tag.src = api;
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function buildVideo(elem) {
  const id = elem.dataset.video;
  player = new YT.Player(elem, {
    height: "500",
    width: "640",
    videoId: id,
    /* playerVars: {
      'loop': 1,
      'playlist': id
    }, */
    events: {
      onReady: onPlayerReady,
    },
  });
  function onPlayerReady(e) {
    e.target.unMute();
    e.target.playVideo();
    e.target.setVolume(50);
  }
}

(function openVideoPopup() {
  popupOpen.addEventListener("click", () => {
    overlayPopup.classList.add(popupClass);
    if (isVideoBuild) {
      player.playVideo();
    } else {
      injectApi(youTubeApi);
      window.onYouTubeIframeAPIReady = () => {
        buildVideo(popupVideo);
      };
      isVideoBuild = true;
    }
  });
})();

(function closeVideoPopup() {
  popupClose.addEventListener("click", () => {
    overlayPopup.classList.remove(popupClass);
  });
})();

document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("js-close-popup") ||
    e.target.classList.contains("js-video-popup-overlay") ||
    e.target.classList.contains("js-video-popup") ||
    e.target.classList.contains("close-icon-popup")
  ) {
    overlayPopup.classList.remove("popup-overlay--opened");
    player.pauseVideo();
  }
});

// popupOpen.addEventListener("click", (e) => {
//   overlayPopup.classList.add("popup-overlay--opened");
//   console.log(popupVideo);

//   const videoUrl = e.currentTarget.dataset.videoUrl;
//   console.log(videoUrl);

//   popupVideo.src += videoUrl;
//   if (!popupVideo.hasAttribute("allow")) {
//     popupVideo.setAttribute("allow", "autoplay");
//     popupVideo.src += videoUrl.playVideo();
//   }
// });

// popupClose.addEventListener("click", (e) => {
//   overlayPopup.classList.remove("popup-overlay--opened");
//   popupVideo.removeAttribute("src");
//   popupVideo.removeAttribute("allow");
// });

// document.addEventListener("click", (e) => {
//   if (
//     e.target.classList.contains("js-close-popup") ||
//     e.target.classList.contains("js-video-popup-overlay") ||
//     e.target.classList.contains("js-video-popup")
//   ) {
//     overlayPopup.classList.remove("popup-overlay--opened");
//     popupVideo.removeAttribute("src");
//     popupVideo.removeAttribute("allow");
//   }
// });

// IMAGE SLIDER

const swiper = new Swiper(".swiper", {
  slidesPerView: 3,
  spaceBetween: 5,
  // Responsive breakpoints
  // breakpoints: {
  //   // when window width is >= 820px
  //   376: {
  //     slidesPerView: 2,
  //     spaceBetween: 40,
  //   },

  //   767: {
  //     slidesPerView: 3,
  //     spaceBetween: 20,
  //   },
  // },
  // Navigation arrows
  loop: true,
  navigation: {
    nextEl: ".explore__button-right",
    prevEl: ".explore__button-left",
  },
});

// VALIDATE FORM

// let formButton = document.querySelector(".js-form-button");
let form = document.querySelector(".js-form-group");
const requiredFilds = form.querySelectorAll(".js-required-fild");

form.addEventListener("submit", (e) => validateForm(e));
console.log(form);

function validateForm(e) {
  e.preventDefault();

  const errArray = [];

  requiredFilds.forEach((fild) => {
    console.log(fild);
    const input = fild.querySelector("input");
    const regex = /^[^ ]+@[^ ]+.[a-z]{2,3}$/;
    const errorMessage = fild.querySelector(".js-form-error");
    const check = fild.querySelector(".check-box__input");

    fild.classList.remove("error");
    if (input.getAttribute("name") === "fullName" && input.value.length < 1) {
      errArray.push(1);
      fild.classList.add("error");
      errorMessage.innerHTML = form.dataset.emptyMessage;
    } else if (
      input.getAttribute("name") === "email" &&
      !regex.test(input.value)
    ) {
      errArray.push(2);
      fild.classList.add("error");
      errorMessage.innerHTML = form.dataset.invalidMessage;
    } else if (input.getAttribute("name") === "privacy" && !input.checked) {
      errArray.push(3);
      fild.classList.add("error");
      errorMessage.innerHTML = form.dataset.checkedMessage;
    }
  });

  if (errArray.length === 0) {
    form.submit();
  }
}

// if (regex.test(input.value) != true) {
//   console.log(regex.test(input.value));
//   errArray.push(2);
//   fild.classList.add("error2");
//   errorMessage.innerHTML = form.dataset.invalidMessage;
// }

// if (check.value != "checked") {
//   console.log(regex.test(input.value));
//   errArray.push(3);
//   fild.classList.add("error3");
//   errorMessage.innerHTML = form.dataset.emptyMessage;
// }

// if (e.fullName.value == "") {
//   document.querySelector(
//     ".form__error-message.js-form-error-message-name"
//   ).style.visibility = "visible";
//   return false;
// }

// if (form.email.value == "") {
//   document.querySelector(
//     ".form__error-message.js-form-error-required"
//   ).style.visibility = "visible";
//   return false;
// }

// if (form.privacy.checked == "") {
//   document.querySelector(
//     ".form__error-message.js-form-error-message-check"
//   ).style.visibility = "visible";

//   return false;
// }

// form.btnSub.submit();
// return true;

// function validation() {
//   let form = document.querySelector(".js-form-group");
//   let email = document.querySelector(".js-form-input").value;
//   let text = document.querySelector(".js-form-error-email");
//   let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

//   if (email.match(pattern)) {
//     form.classList.add("valid");
//     form.classList.remove("invalid");
//     text.innerHTML = "Your Email Address in valid";
//     text.style.color = "green";
//   } else {
//     form.classList.remove("valid");
//     form.classList.add("invalid");
//     text.innerHTML = "Please Enter Valid Email Address";
//     text.style.color = "red";
//   }

//   if (email == "") {
//     form.classList.remove("valid");
//     form.classList.remove("invalid");
//     text.innerHTML = "";
//     text.style.color = "green";
//   }
// }

// ACCORDION

var accItem = document.querySelectorAll(".js-panel");
var accHD = document.getElementsByClassName("js-accordion-heading");

for (i = 0; i < accHD.length; i++) {
  accHD[i].addEventListener("click", toggleItem, false);
}

function toggleItem() {
  var itemClass = this.parentNode.className;
  for (i = 0; i < accItem.length; i++) {
    accItem[i].className = "accordion__panel js-panel close";
  }
  if (itemClass == "accordion__panel js-panel close") {
    this.parentNode.className = "accordion__panel js-panel open";
  }
}
