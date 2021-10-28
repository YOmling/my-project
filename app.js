const sections = $("section");
const display = $(".maincontent");

let inScroll = false;

sections.first().addClass("active");

const performTransition = sectionEq => {

  if (inScroll == false) {
    inScroll = true;
    const position = sectionEq * -100;

    const currentSection = sections.eq(sectionEq);
    const menuTheme = currentSection.attr("data-sidemenu-theme");
    const sideMenu = $(".fixed-menu");

    if (menuTheme == "black") {
      sideMenu.addClass("fixed-menu--shadowed");
    } else {
      sideMenu.removeClass("fixed-menu--shadowed");
    }

    display.css({
      transform: `translateY(${position}%)`
    });

    sections.eq(sectionEq).addClass("active").siblings().removeClass("active");

    

    setTimeout(() => {
      inScroll = false;

      sideMenu.find(".fixed-menu__item").eq(sectionEq).addClass("fixed-menu__item--active").siblings().removeClass("fixed-menu__item--active");
    }, 1300);
  }
};

const scrollViewport = direction => {
  const activeSection = sections.filter(".active");
  const nextSection = activeSection.next();
  const prevSection = activeSection.prev();

  if (direction == "next" && nextSection.length) {
    performTransition(nextSection.index())
  }

  if (direction == "prev" && prevSection.length) {
    performTransition(prevSection.index())
  }
}

$(window).on("wheel", e => {
  const deltaY = e.originalEvent.deltaY;

  if (deltaY > 0) {
    scrollViewport("next");
  }

  if (deltaY < 0) {
    scrollViewport("prev");
  }
});

$(window).on("keydown", e => {

  const tagName = e.target.tagName.toLowerCase();

  if (tagName != "input" && tagName != "textarea") {
    switch (e.keyCode) {
      case 38:
        scrollViewport("prev");
        break;

      case 40:
        scrollViewport("next")
    }
  }
});

$("[data-scroll-to]").click(e => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const target = $this.attr("data-scroll-to");
  const reqSection = $(`[data-section-id=${target}]`);

  performTransition(reqSection.index());

});

/* Меню */
const list = $('.products-menu');
list.on('click', '.products-menu__item', function (e) {
  e.preventDefault()
  if (e.target.classList.contains('products-menu__content')) return
  $(this).siblings('li').removeClass('products-menu__content_active')
  $(this).toggleClass('products-menu__content_active')
})



/* ОТЗЫВЫ */

const findBlockByAlias = alias => {
  return $(".reviews__item").filter((ndx, item) => {
    return $(item).attr("data-linked-with") == alias;
  });
};

$(".interactive-avatar__link").click(e => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const target = $this.attr("data-open");
  const itemToShow = findBlockByAlias(target);
  const curItem = $this.closest(".reviews__switcher-item")

  itemToShow.addClass("active").siblings().removeClass("active");
  curItem.addClass("active").siblings().removeClass("active");

});


/* 
Команда */

const openItem = item => {
  const container = item.closest(".team__item");
  const contentBlock = container.find(".team__content");
  const textBlock = contentBlock.find(".team__content-block");
  const reqHeight = textBlock.height();

  container.addClass("active");
  contentBlock.height(reqHeight);


}

const closeEveryItem = container => {
  const items = container.find('.team__content');
  const itemContainer = container.find("team__item");

  itemContainer.removeClass("active");
  items.height(0);
};

$('.team__title').click(e => {
  const $this = $(e.currentTarget);
  const container = $this.closest('.team');
  const elemContainer = $this.closest(".team__item");

  if (elemContainer.hasClass("active")) {
    closeEveryItem(container);
  } else {
    closeEveryItem(container);
    openItem($this);
  }
});



const btn_names = document.querySelectorAll('.team__title');

btn_names.forEach(item => {

  item.addEventListener('click', function (event) {
    const parentEl = event.target.parentElement.parentElement;
    const arrow = parentEl.querySelector('.member__name-arrow');

    if (arrow.classList.contains('member__name-arrow-rotated')) {
      arrow.classList.remove('member__name-arrow-rotated');
    } else {
      arrow.classList.add('member__name-arrow-rotated');
    }
  });
})


/* Слайдер */

const slider = $('.products').bxSlider({
  pager: false,
  controls: false,
});

$('.products-slider__arrow--derection--prev').click(e => {
  e.preventDefault();
  slider.goToPrevSlide();
}
);

$('.products-slider__arrow--derection--next').click(e => {
  e.preventDefault();
  slider.goToNextSlide();
}
);

/* Форма */
const validateFields = (form, fieldsArray) => {
  fieldsArray.forEach(field => {
    field.removeClass("input-error");
    if (field.val().trim() == "") {
      field.addClass("input-error");
    }
  });

  const errorFields = form.find(".input-eror");

  return errorFields.leight == 0;
}


$('.form').submit(e => {
  e.preventDefault();

  const form = $(e.currentTarget);
  const name = form.find("[name='name']");
  const phone = form.find("[name='phone']");
  const comment = form.find("[name='comment']");
  const to = form.find("[name='to']");

  const modal = $("#modal");
  const content = modal.find(".modal__content");

  modal.removeClass("error-modal");

  const isValid = validateFields(form, [name, phone, comment, to]);

  if (isValid) {
    const request = $.ajax({
      url: "https://webdev-api.loftschool.com/sendmail",
      metod: "post",
      data: {
        name: name.val(),
        phone: phone.val(),
        comment: comment.val(),
        to: to.val(),
      },
    });
    request.done(data => {
      content.text(data.message);
    })

    request.fail(data => {
      const message = data.responseJSON.message;
      content.text(message);
      modal.addClass("error-modal");
    })

    request.always(() => {
      $.fancybox.open({
        src: "#modal",
        type: "inline"
      });
    })
  }
});

$(".app-submit-btn").click(e => {
  e.preventDefault();

  $.fancybox.close();
});


/* Плеер */

let video;
let durationControl;
let soundControl;
let intervalId;


$().ready(function () {
  video = document.getElementById("player");

  video.addEventListener('click', playStop);

  let playButtons = document.querySelectorAll(".play");
  for (let i = 0; i < playButtons.length; i++) {
    playButtons[i].addEventListener('click', playStop);
  }

  let micControl = document.getElementById("mic");
  micControl.addEventListener('click', soundOf)

  durationControl = document.getElementById("durationLevel");
  durationControl.addEventListener('click', setVideoDuration);
  durationControl.addEventListener('onmousemove', setVideoDuration);
  durationControl.addEventListener('mousedown', stopInterval);
  durationControl.min = 0;
  durationControl.value = 0;
  soundControl = document.getElementById("micLevel");
  soundControl.addEventListener('click', changeSoundVolume);
  soundControl.addEventListener('onmousemove', changeSoundVolume);
  soundControl.min = 0;
  soundControl.max = 10;
  soundControl.value = soundControl.max;

});


function playStop() {

  $(".video__player-img").toggleClass("video__player-img--active");

  durationControl.max = video.duration;

  if (video.paused) {
    video.play();
    intervalId = setInterval(updateDuration, 1)
  } else {
    video.pause();
    clearInterval(intervalId);
  }
}


function soundOf() {
  if (video.volume === 0) {
    video.volume = soundLevel;
    soundControl.value = soundLevel * 10;
  } else {
    soundLevel = video.volume;
    video.volume = 0;
    soundControl.value = 0;
  }
}

function stopInterval() {
  clearInterval(intervalId);
}

function setVideoDuration() {
  video.currentTime = durationControl.value;
  intervalId = setInterval(updateDuration, 1000 / 66);
}

function changeSoundVolume() {
  video.volume = soundControl.value / 10;
}

function updateDuration() {
  durationControl.value = video.currentTime;
}

/* Карта  */

let myMap;
const init = () => {
  myMap = new ymaps.Map("map", {
    center: [55.752004, 37.576133],
    zoom: 15,
    controls: [],
  });

  let coords = [[55.752004, 37.576133]],
    myCollection = new ymaps.GeoObjectCollection({}, {
      draggable: false,
      iconLayout: 'default#image',
      iconImageHref: './img/icons/marker.png',
      iconImageSize: [46, 57],
      iconImageOffset: [-35, -52]
    });

  for (let i = 0; i < coords.length; i++) {
    myCollection.add(new ymaps.Placemark(coords[i]));
  }


  myMap.geoObjects.add(myCollection);

  myMap.behaviors.disable('scrollZoom');
};

ymaps.ready(init);

/* Гор. меню */
/* const mesureWidth = () => {
  return 500;
}

const openItems = item => {
  const hiddenContent = item.find(".products-menu__content");
  const reqWidth = mesureWidth();

  hiddenContent.width(reqWidth);
}

$(".products-menu__title").on("click", e => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const item = $this.closest(".product-menu__item");

  openItems(item);

}); */