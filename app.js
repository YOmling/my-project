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

$('.products-slider__arrow--derection--prev').click(e =>{
e.preventDefault();
slider.goToPrevSlide();
}
);

$('.products-slider__arrow--derection--next').click(e =>{
  e.preventDefault();
  slider.goToNextSlide();
}
);