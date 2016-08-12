// Application Scripts:

// Десктоп меню (выпадайки)
// Мобильное меню
// Фикс.хидер на десктопе
// Покажем - спрячем форму поиска
// Загрузка изображений при скролле
// Кнопка скролла страницы
// Модальное окно
// Маска для телефонного номера
// Hero-слайдер
// History-слайдер
// Выравнивание блоков по высоте
// Вкладки
// Слайдер специалистов
// Слайдер дипломов
// Слайдеры видео
// Рейтинг
// Покажем * после обязательных полей в формах (футер)
// Если браузер не знает о плейсхолдерах в формах

jQuery(document).ready(function ($) {
    $('body').append('<div id="overlay" class="overlay"></div>');//оверлей - покажем при открытии модального окна или мобильного меню
    //
    // Десктоп меню (выпадайки)
    //---------------------------------------------------------------------------------------
    (function () {
        var $menu = $('.js-menu li');
        $menu.has('ul').children('a').addClass('has-menu');

        $menu.on({
            mouseenter: function () {
                $(this).find('ul:first').stop(true, true).fadeIn('fast');
                $(this).find('a:first').addClass('hover');
            },
            mouseleave: function () {
                $(this).find('ul').stop(true, true).fadeOut('slow');
                $(this).find('a:first').removeClass('hover');
            }
        });
    })();
    
    //
    // Мобильное меню
    //---------------------------------------------------------------------------------------
    (function () {
        var $btn = $('.js-mmenu-toggle'),
            $menu = $('.js-mmenu'),
            $overlay = $('#overlay'),
            $html=$('html'),
            method = {};

        method.hideMenu = function () {
            $btn.removeClass('active');
            $menu.removeClass('active');
            $html.css('overflow', 'auto');
            $overlay.unbind('click', method.hideMenu).hide();
        };

        method.showMenu = function () {
            $btn.addClass('active');
            $menu.addClass('active');
            $html.css('overflow', 'hidden');
            $overlay.show().bind('click', method.hideMenu);
        }

        $('.b-header__top').on('click', '.js-mmenu-toggle', function () {//покажем - спрячем
            if ($(this).hasClass('active')) {
                method.hideMenu();
            } else {
                method.showMenu();
            }
        });

        $menu.on('click', '.m-menu__label', method.hideMenu); //закроем по клику по заголовку
    })();

    //
    // Фикс.хидер на десктопе
    //---------------------------------------------------------------------------------------
    (function () {
        var sticky,
            winW,
            isStick = false, //флаг состояния
            rtime, //переменные для пересчета ресайза окна с задержкой delta
            timeout = false,
            delta = 200,
            method = {};

        method.init = function () {
            sticky = new Waypoint.Sticky({
                element: $('.js-sticky-header')[0]
            });
            isStick = true;
        };

        method.destroy = function () {
            sticky.destroy();
            isStick = false;
        };

        method.check = function () {
            winW = $.viewportW();
            if (winW >= 992 && !isStick) {//если десктоп и "стикер" не запущен
                method.init(); //запускаем
            };
            if (winW < 992 && isStick) {//если мелкий экран и "стикер" работает
                method.destroy(); //вырубаем
            }
        };

        method.endResize = function () {
            if (new Date() - rtime < delta) {
                setTimeout(method.endResize, delta);
            } else {
                timeout = false;
                //ресайз окончен - пересчитываем
                method.check();
            }
        };

        method.startResize = function () {
            rtime = new Date();
            if (timeout === false) {
                timeout = true;
                setTimeout(method.endResize, delta);
            }
        };



        method.check(); //проверяем при загрузке
        $(window).bind('resize', method.startResize); //начинаем отслеживать ресайз окна

    })();

    //
    // Покажем - спрячем форму поиска
    //---------------------------------------------------------------------------------------
    (function () {
        var $form = $('.js-search'),
            method = {};

        method.show = function (e) {
            e.preventDefault();
            $form.fadeIn();
        };

        method.hide = function () {
            $form.hide();
        };

        $('.b-header').on('click', '.js-search-toggle', method.show);
        $form.on('click', '.b-search__close', method.hide);
    })();

    //
    // Загрузка изображений при скролле
    //---------------------------------------------------------------------------------------
    $('.js-lazyimg').unveil();

    //
    // Кнопка скролла страницы
    //---------------------------------------------------------------------------------------
    (function () {
        var $scroller = $('<button type="button" class="scroll-up-btn"><i class="icon-up-open-big"></i></button>');
        $('body').append($scroller);
        $(window).on('scroll', function () {
            if ($(this).scrollTop() > 300) {
                $scroller.show();
            } else {
                $scroller.hide();
            }
        });
        $scroller.on('click', function () {
            $('html, body').animate({ scrollTop: 0 }, 800);
            return false;
        });
    })();

    //
    // Модальное окно
    //---------------------------------------------------------------------------------------
    var showModal = (function (link) {
        var
        method = {},
        $modal,
        $window = $(window),
        $overlay = $('#overlay'),
        $close;

        $close = $('<button type="button" class="modal__close"><i class="icon-cancel"></i></button>'); //иконка закрыть


        $close.on('click', function (e) {
            e.preventDefault();
            method.close();
        });

        // центрируем окно
        method.center = function () {
            var top, left;
            top = Math.max($window.height() - $modal.outerHeight(), 0) / 2;
            left = Math.max($window.width() - $modal.outerWidth(), 0) / 2;

            $modal.css({
                top: top + $window.scrollTop(),
                left: left + $window.scrollLeft()
            });
        };


        // открываем
        method.open = function (link) {
            $modal = $(link);
            $modal.append($close);
            method.center();
            $window.bind('resize.modal', method.center);
            $modal.show();
            $overlay.show().bind('click', method.close);
        };

        // закрываем
        method.close = function () {
            $modal.hide().find('iframe').attr('src', '');//если в модальном окне было видео - убъем
            $overlay.hide().unbind('click', method.close);
            $window.unbind('resize.modal');
        };

        // клик по кнопке с атрибутом data-modal - открываем модальное окно
        $('[data-modal]').on('click', function (e) {//передаем айди модального окна
            e.preventDefault();
            var link = $(this).data('modal');
            if (link) { showModal.open(link); }
        });

        return method;
    }());

    //
    // Маска для телефонного номера
    //---------------------------------------------------------------------------------------
    $('.js-phone-input').mask('+38 (099) 999-99-99');

    //
    // Hero-слайдер
    //---------------------------------------------------------------------------------------
    function initHeroSlider() {
        var $slider = $('.js-hero-slider');

        $slider.bxSlider({
            controls: true,
            nextText: '<i class="icon-right-open-big"></i>',
            prevText: '<i class="icon-left-open-big"></i>',
            useCSS: false,
            slideMargin: 5,
            auto: true,
            pause: 10000
        });
    };
    if ($('.js-hero-slider').length) {
        initHeroSlider();
    };

    //
    // History-слайдер
    //---------------------------------------------------------------------------------------
    function initHistorySlider() {
        var $slider = $('.js-history-slider');

        $slider.bxSlider({
            controls: true,
            mode: 'fade',
            pagerType: 'short',
            pagerSelector: $('.b-history__pager'),
            nextText: '<i class="icon-right-open-big"></i>',
            prevText: '<i class="icon-left-open-big"></i>',
        });
    };
    if ($('.js-history-slider').length) {
        initHistorySlider();
    };

    //
    // Выравнивание блоков по высоте
    //---------------------------------------------------------------------------------------
    $.fn.matchHeight._throttle = 1000; //увеличим задержку перерасчета при ресайзе (чтобы успеть перезагрузить слайдеры)
    $('.js-match-height').matchHeight();

    //
    // Вкладки
    //---------------------------------------------------------------------------------------
    function initTabs() {
        var $list = $('.js-tabs'),
            $content = $('.js-tabs-content > div'),
            method = {};

        method.init = (function () {//спрячем "лишние" вкладки
            $content.hide()
            $list.each(function () {
                var current = $(this).find('li.current');
                if (current.length < 1) { $(this).find('li:first').addClass('current'); }
                current = $(this).find('li.current a').attr('href');
                $(current).show();
            });
        })();

        method.showImages = function (tab) {//если во вкладке есть lazy-load картинки - покажем их принудительно
            tab.find('.js-lazyimg').trigger('unveil');
        };

        method.show = function (el) {//обработка клика по вкладке
            var $tabs = el.parents('ul').find('li');
            var tab_next = el.attr('href');
            var tab_current = $tabs.filter('.current').find('a').attr('href');
            $(tab_current).hide();
            $tabs.removeClass('current');
            el.parent().addClass('current');
            $(tab_next).fadeIn();
            history.pushState(null, null, window.location.search + el.attr('href'));
            method.showImages($(tab_next)); //если есть lazy-load изображения
        };


        $list.on('click', 'a[href^="#"]', function (e) {//клик по вкладке
            e.preventDefault();
            method.show($(this));
        });

        method.parsing = (function () {//парсим линк и открываем нужную вкладку при загрузке
            var hash = window.location.hash;
            if (hash) {
                var selectedTab = $list.find('a[href="' + hash + '"]');
                selectedTab.trigger('click', true);
            };
        })();
    };
    if ($('.js-tabs').length) { initTabs(); }

    //
    // Слайдер специалистов
    //---------------------------------------------------------------------------------------
    function initStaffSlider() {
        var $slider = $('.js-staff-slider'),
            rtime, //переменные для пересчета ресайза окна с задержкой delta - будем показывать разное кол-во слайдов на разных разрешениях
            timeout = false,
            delta = 200,
            isImagesLoaded=false, //при загрузке слайдера покажем 3 первые фотки, остальные - после первой прокрутки слайдера
            method = {};

        method.getSliderSettings = function () {
            var setting,
                    settings1 = {
                        maxSlides: 1,
                        minSlides: 1,
                        moveSlides: 1,
                        slideMargin: 20,
                    },
                    settings2 = {
                        maxSlides: 2,
                        minSlides: 2,
                        moveSlides: 2,
                        slideMargin: 20,
                    },
                    settings3 = {
                        maxSlides: 3,
                        minSlides: 3,
                        moveSlides: 3,
                        slideMargin: 20,
                    },
                    settings4 = {
                        maxSlides: 3,
                        minSlides: 3,
                        moveSlides: 3,
                        slideMargin: 95,
                    },
                    common = {
                        slideWidth: 300,
                        auto: false,
                        infiniteLoop: false,
                        hideControlOnEnd: true,
                        useCSS: false,
                        nextText: '<i class="icon-right-open-big"></i>',
                        prevText: '<i class="icon-left-open-big"></i>',
                        onSlideBefore: function () {//если картинки не загружены - загружаем
                            if (!isImagesLoaded) {
                                method.showAllImages();
                            };
                        }
                    },
                    winW = $.viewportW(); //ширина окна

            if (winW < 600) {
                setting = $.extend(settings1, common);
            };
            if (winW >= 600 && winW < 992) {
                setting = $.extend(settings2, common);
            };
            if (winW >= 992 && winW < 1200) {
                setting = $.extend(settings3, common);
            };
            if (winW >= 1200 ) {
                setting = $.extend(settings4, common);
            };

            return setting;
        };

        method.reloadSliderSettings = function () {
            $slider.reloadSlider($.extend(method.getSliderSettings(), { startSlide: $slider.getCurrentSlide() }));
        };


        method.endResize = function () {
            if (new Date() - rtime < delta) {
                setTimeout(method.endResize, delta);
            } else {
                timeout = false;
                //ресайз окончен - пересчитываем
                method.reloadSliderSettings();
            }
        };

        method.startResize = function () {
            rtime = new Date();
            if (timeout === false) {
                timeout = true;
                setTimeout(method.endResize, delta);
            }
        };

        method.equalHeight = function () {//выровняем надписи по высоте, чтобы кнопки были на одном уровне
            $slider.find('.b-staff__title').matchHeight({
                byRow: false
            });
            $slider.find('.js-staff-height').matchHeight({
                byRow: false
            });
        };

        method.show3images = function () {//при загрузке слайдера, покажем 3 первые картинки
            for (var i = 0; i < 3; i++) {
                var $img = $slider.children('li').eq(i).find('.js-staff-img');
                if ($img.length) {
                    method.loadImage($img);
                };
            };
        };

        method.showAllImages = function () {//дозагрузим остальные картинки в слайдер после первой прокрутки
            isImagesLoaded = true;
            $slider.children('li').each(function () {
                var $img = $(this).find('.js-staff-img');
                if ($img.length) {
                    method.loadImage($img);
                };
            });
        };

        method.loadImage = function (el) {//хелпер
            var source = el.data('src');
            if (source != '') {
                el.attr('src', source);
                el.removeClass('js-staff-img');
            };
        };

        method.show3images();//показали первые 3 картинки
        method.equalHeight();//выровняли надписи по высоте
        $slider.bxSlider(method.getSliderSettings());//запускаем слайдер
        $(window).bind('resize', method.startResize);//пересчитываем кол-во видимых элементов при ресайзе окна с задержкой .2с
    };
    if ($('.js-staff-slider').length) {
        initStaffSlider();
    };

    //
    // Слайдер дипломов
    //---------------------------------------------------------------------------------------
    function initDiplomaSlider() {
        var $slider = $('.js-diploma-slider'),
            rtime, //переменные для пересчета ресайза окна с задержкой delta - будем показывать разное кол-во слайдов на разных разрешениях
            timeout = false,
            delta = 200,
            isImagesLoad = false,
            slideCount = 0,
            method = {};

        method.getSliderSettings = function () {
            var setting,
                    settings1 = {
                        maxSlides: 1,
                        minSlides: 1,
                    },
                    settings2 = {
                        maxSlides: 2,
                        minSlides: 2,
                    },
                    settings3 = {
                        maxSlides: 3,
                        minSlides: 3,
                    },
                    settings4 = {
                        maxSlides: 4,
                        minSlides: 4,
                    },
                    common = {
                        slideWidth: 246,
                        slideMargin: 22,
                        moveSlides: 1,
                        auto: false,
                        pager: false,
                        infiniteLoop: false,
                        hideControlOnEnd: true,
                        useCSS: false,
                        nextText: '<i class="icon-right-open-big"></i>',
                        prevText: '<i class="icon-left-open-big"></i>',
                        onSliderLoad: function () {
                            slideCount = $slider.getSlideCount();
                            method.showAllImages();//если картинки не загружены - загрузим
                        },
                    },
                    winW = $.viewportW(); //ширина окна

            if (winW < 580) {
                setting = $.extend(settings1, common);
            };
            if (winW >= 580 && winW < 820) {
                setting = $.extend(settings2, common);
            };
            if (winW >= 820 && winW < 1200) {
                setting = $.extend(settings3, common);
            };
            if (winW >= 1200) {
                setting = $.extend(settings4, common);
            };

            return setting;
        };

        method.reloadSliderSettings = function () {
            var options = method.getSliderSettings(),
                current = $slider.getCurrentSlide(),
                delta = slideCount - current - options.maxSlides;
            
            if (delta < 0) {//меняем текущий слайд
                current = current + delta;
            };
            
            //$slider.reloadSlider($.extend(method.getSliderSettings(), { startSlide: $slider.getCurrentSlide() }));
            $slider.reloadSlider($.extend(options, { startSlide: current }));
        };


        method.endResize = function () {
            if (new Date() - rtime < delta) {
                setTimeout(method.endResize, delta);
            } else {
                timeout = false;
                //ресайз окончен - пересчитываем
                method.reloadSliderSettings();
            }
        };

        method.startResize = function () {
            rtime = new Date();
            if (timeout === false) {
                timeout = true;
                setTimeout(method.endResize, delta);
            }
        };

        method.showAllImages = function () {//загрузим картинки в слайдер
            if (!isImagesLoad) {
                isImagesLoad = true;
                $slider.children('li').each(function () {
                    var $img = $(this).find('img[data-src]');
                    if ($img.length) {
                        var source = $img.data('src');
                        if (source != '') {
                            $img.attr('src', source);
                        };
                    };
                });
            }
        };

        method.initLightBox = function () {//по клику на картинку откроем в Лайтбоксе
            var lightbox = $slider.children('li').find('a').simpleLightbox({
                navText: ['<i class="icon-left-open-big"></i>', '<i class="icon-right-open-big"></i>'],
                captions: false,
                close: true,
                closeText: '<i class="icon-cancel"></i>',
                showCounter: true,
                disableScroll: false,
                animationSpeed: 200
            });
        };

        method.initLightBox(); //подключаем лайтбокс
        $slider.bxSlider(method.getSliderSettings());//запускаем слайдер
        $(window).bind('resize', method.startResize);//пересчитываем кол-во видимых элементов при ресайзе окна с задержкой .2с
    };

    if ($('.js-diploma-slider').length) {
        initDiplomaSlider();
    };

    //
    // Слайдеры видео
    //---------------------------------------------------------------------------------------
    function initVideoSliders() {//слайдеры во вкладках, в них прокручиваем картинки. По клику будем парсить линк и открывать видео в модальном окне
        var $slider = $('.js-video-slider'),
            count=$slider.length, //кол-во слайдеров
            rtime, //переменные для пересчета ресайза окна с задержкой delta - будем показывать разное кол-во слайдов на разных разрешениях
            timeout = false,
            delta = 350,
            isImagesLoaded = false, //при загрузке слайдера покажем 3 первые фотки, остальные - после первой прокрутки слайдера
            slider = [],//масив со слайдерами
            method = {};


        method.getSliderSettings = function () {
            var setting,
                    settings1 = {
                        maxSlides: 1,
                        minSlides: 1,
                        moveSlides: 1,
                    },
                    settings2 = {
                        maxSlides: 2,
                        minSlides: 2,
                        moveSlides: 2,
                    },
                    settings3 = {
                        maxSlides: 3,
                        minSlides: 3,
                        moveSlides: 3,
                    },
                    common = {
                        slideWidth: 300,
                        slideMargin: 1,
                        auto: false,
                        infiniteLoop: false,
                        hideControlOnEnd: true,
                        useCSS: false,
                        nextText: '<i class="icon-right-open-big"></i>',
                        prevText: '<i class="icon-left-open-big"></i>',
                        onSlideBefore: function () {//если картинки не загружены - загружаем
                            if (!isImagesLoaded) {
                                method.showAllImages();
                            };
                        }
                    },
                    winW = $.viewportW(); //ширина окна

            if (winW < 600) {
                setting = $.extend(settings1, common);
            };
            if (winW >= 600 && winW < 992) {
                setting = $.extend(settings2, common);
            };
            if (winW >= 992) {
                setting = $.extend(settings3, common);
            };

            return setting;
        };

        method.reloadSliderSettings = function () {
            for (var i = 0; i < count; i++) {
                slider[i].reloadSlider($.extend(method.getSliderSettings(), { startSlide: slider[i].getCurrentSlide() }));
            }
        };

        method.endResize = function () {
            if (new Date() - rtime < delta) {
                setTimeout(method.endResize, delta);
            } else {
                timeout = false;
                //ресайз окончен - пересчитываем
                method.reloadSliderSettings();
            }
        };

        method.startResize = function () {
            rtime = new Date();
            if (timeout === false) {
                timeout = true;
                setTimeout(method.endResize, delta);
            }
        };

        method.show3images = function () {//при загрузке слайдера, покажем 3 первые картинки
            for (var j = 0; j < count; j++) {
                for (var i = 0; i < 3; i++) {
                    var $img = slider[j].children('li').eq(i).find('.js-video-thumb');
                    if ($img.length) {
                        method.loadImage($img);
                    };
                };
            };
        };

        method.showAllImages = function () {//дозагрузим остальные картинки в слайдер после первой прокрутки
            isImagesLoaded = true;
            for (var j = 0; j < count; j++) {
                slider[j].children('li').each(function () {
                    var $img = $(this).find('.js-video-thumb');
                    if ($img.length) {
                        method.loadImage($img);
                    };
                });
            };
        };

        method.loadImage = function (el) {//хелпер
            var source = el.data('src');
            if (source != '') {
                el.attr('src', source);
                el.removeClass('js-video-thumb');
            };
        };

        method.getYoutubeID = function (url) {//парсим youtube-ссылку, возвращаем id видео
            var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
            var match = url.match(regExp),
                urllink;
            if (match && match[1].length == 11) {
                urllink = match[1];
            } else {
                urllink = false;
            }
            return urllink;
        };

        for (var i = 0; i < count; i++) {//запускаем слайдеры
            slider[i] = $slider.eq(i);
            slider[i].bxSlider(method.getSliderSettings());
        };

        method.show3images();//показали первые 3 картинки в слайдерах
        $(window).bind('resize', method.startResize);//пересчитываем кол-во видимых элементов при ресайзе окна с задержкой delta

        $('.js-tabs-slider').on('click', 'a[href^="#"]', function () {//при клике по вкладке перезагрузим слайдер
            method.reloadSliderSettings();
        });

        $slider.on('click', '.b-video__link', function (e) {//откроем видео в модальном окне
            e.preventDefault();
            var link = $(this).attr('href'),
                title = $(this).parent().find('.b-video__title').text();
                id = method.getYoutubeID(link);

            if (id) {
                var $modal = $('#videomodal');
                $modal.find('iframe').attr('src', 'https://www.youtube.com/embed/' + id + '?rel=0&amp;showinfo=0;autoplay=1');//передали ссылку на видео
                $modal.find('.g-subtitle').text(title);//передали название
                showModal.open('#videomodal');
            };
        });
    };

    if ($('.js-video-slider').length) {
        initVideoSliders();
    };

    //
    // Рейтинг
    //---------------------------------------------------------------------------------------
    function initRating() {
        $('.js-rating').each(function () {
            var $el = $(this),
                isReadOnly = $el.data('readonly'),
                rating = $el.data('rating'),
                options;

            if (isReadOnly == 1) {//если нужно только отобразить рейтинг
                options = {
                    theme: 'fontawesome-stars-o',
                    showSelectedRating: false,
                    initialRating: +rating,
                    readonly: true,
                    hoverState: false
                }
            } else if (isReadOnly == 0){ //кликабельный рейтинг
                $el.addClass('active'); //изменили класс - убрали отступ, увеличели отступ между звездами
                options = {
                    theme: 'fontawesome-stars-o',
                    initialRating: +rating,
                    showSelectedRating: false,
                    onSelect: function (value, text) {
                        //если нужно - обработчик события
                        //console.log($el.find('.b-rating__select').val());
                    },
                }
            };

            $el.find('.b-rating__value').text(rating);
            $el.find('.b-rating__select').barrating(options);
            $el.css('visibility', 'visible'); //покажем после загрузки
        });
    };
    if ($('.js-rating').length) {
        initRating();
    };


    //
    // Покажем * после обязательных полей в формах
    //---------------------------------------------------------------------------------------
    (function () {
        $('.g-input-field').each(function () {
            var $el = $(this).find('.g-input, .g-select, g-textarea');
            if ($el.prop('required')) {
                $(this).addClass('required');
            }
        });
    })();

    //
    // Если браузер не знает о плейсхолдерах в формах
    //---------------------------------------------------------------------------------------
    if ($('html').hasClass('no-placeholder')) {
        /* Placeholders.js v4.0.1 */
        !function (a) { "use strict"; function b() { } function c() { try { return document.activeElement } catch (a) { } } function d(a, b) { for (var c = 0, d = a.length; d > c; c++) if (a[c] === b) return !0; return !1 } function e(a, b, c) { return a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent ? a.attachEvent("on" + b, c) : void 0 } function f(a, b) { var c; a.createTextRange ? (c = a.createTextRange(), c.move("character", b), c.select()) : a.selectionStart && (a.focus(), a.setSelectionRange(b, b)) } function g(a, b) { try { return a.type = b, !0 } catch (c) { return !1 } } function h(a, b) { if (a && a.getAttribute(B)) b(a); else for (var c, d = a ? a.getElementsByTagName("input") : N, e = a ? a.getElementsByTagName("textarea") : O, f = d ? d.length : 0, g = e ? e.length : 0, h = f + g, i = 0; h > i; i++) c = f > i ? d[i] : e[i - f], b(c) } function i(a) { h(a, k) } function j(a) { h(a, l) } function k(a, b) { var c = !!b && a.value !== b, d = a.value === a.getAttribute(B); if ((c || d) && "true" === a.getAttribute(C)) { a.removeAttribute(C), a.value = a.value.replace(a.getAttribute(B), ""), a.className = a.className.replace(A, ""); var e = a.getAttribute(I); parseInt(e, 10) >= 0 && (a.setAttribute("maxLength", e), a.removeAttribute(I)); var f = a.getAttribute(D); return f && (a.type = f), !0 } return !1 } function l(a) { var b = a.getAttribute(B); if ("" === a.value && b) { a.setAttribute(C, "true"), a.value = b, a.className += " " + z; var c = a.getAttribute(I); c || (a.setAttribute(I, a.maxLength), a.removeAttribute("maxLength")); var d = a.getAttribute(D); return d ? a.type = "text" : "password" === a.type && g(a, "text") && a.setAttribute(D, "password"), !0 } return !1 } function m(a) { return function () { P && a.value === a.getAttribute(B) && "true" === a.getAttribute(C) ? f(a, 0) : k(a) } } function n(a) { return function () { l(a) } } function o(a) { return function () { i(a) } } function p(a) { return function (b) { return v = a.value, "true" === a.getAttribute(C) && v === a.getAttribute(B) && d(x, b.keyCode) ? (b.preventDefault && b.preventDefault(), !1) : void 0 } } function q(a) { return function () { k(a, v), "" === a.value && (a.blur(), f(a, 0)) } } function r(a) { return function () { a === c() && a.value === a.getAttribute(B) && "true" === a.getAttribute(C) && f(a, 0) } } function s(a) { var b = a.form; b && "string" == typeof b && (b = document.getElementById(b), b.getAttribute(E) || (e(b, "submit", o(b)), b.setAttribute(E, "true"))), e(a, "focus", m(a)), e(a, "blur", n(a)), P && (e(a, "keydown", p(a)), e(a, "keyup", q(a)), e(a, "click", r(a))), a.setAttribute(F, "true"), a.setAttribute(B, T), (P || a !== c()) && l(a) } var t = document.createElement("input"), u = void 0 !== t.placeholder; if (a.Placeholders = { nativeSupport: u, disable: u ? b : i, enable: u ? b : j }, !u) { var v, w = ["text", "search", "url", "tel", "email", "password", "number", "textarea"], x = [27, 33, 34, 35, 36, 37, 38, 39, 40, 8, 46], y = "#ccc", z = "placeholdersjs", A = new RegExp("(?:^|\\s)" + z + "(?!\\S)"), B = "data-placeholder-value", C = "data-placeholder-active", D = "data-placeholder-type", E = "data-placeholder-submit", F = "data-placeholder-bound", G = "data-placeholder-focus", H = "data-placeholder-live", I = "data-placeholder-maxlength", J = 100, K = document.getElementsByTagName("head")[0], L = document.documentElement, M = a.Placeholders, N = document.getElementsByTagName("input"), O = document.getElementsByTagName("textarea"), P = "false" === L.getAttribute(G), Q = "false" !== L.getAttribute(H), R = document.createElement("style"); R.type = "text/css"; var S = document.createTextNode("." + z + " {color:" + y + ";}"); R.styleSheet ? R.styleSheet.cssText = S.nodeValue : R.appendChild(S), K.insertBefore(R, K.firstChild); for (var T, U, V = 0, W = N.length + O.length; W > V; V++) U = V < N.length ? N[V] : O[V - N.length], T = U.attributes.placeholder, T && (T = T.nodeValue, T && d(w, U.type) && s(U)); var X = setInterval(function () { for (var a = 0, b = N.length + O.length; b > a; a++) U = a < N.length ? N[a] : O[a - N.length], T = U.attributes.placeholder, T ? (T = T.nodeValue, T && d(w, U.type) && (U.getAttribute(F) || s(U), (T !== U.getAttribute(B) || "password" === U.type && !U.getAttribute(D)) && ("password" === U.type && !U.getAttribute(D) && g(U, "text") && U.setAttribute(D, "password"), U.value === U.getAttribute(B) && (U.value = T), U.setAttribute(B, T)))) : U.getAttribute(C) && (k(U), U.removeAttribute(B)); Q || clearInterval(X) }, J); e(a, "beforeunload", function () { M.disable() }) } }(this);
    };
});
