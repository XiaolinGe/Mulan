(function($) {
    "use strict";
    $(document).ready(function() {

        var heightimg = $(window).height() - 130;
        $('.main-slide #carousel-main-slide .carousel-inner .main-slide-lookbook').height(heightimg);
        $('.main-slide #carousel-main-slide .carousel-inner .main-slide-lookbook .img-left-slider').height(heightimg);
        $('.main-slide #carousel-main-slide .carousel-inner .main-slide-lookbook .lookbook').height(heightimg);

        // Mini cart
        $('.cart-icon').on('click', function() {
            $('.minicart').toggleClass('actived');
        });
        $('#btn-minicart-close').on('click', function() {
            $('.minicart').removeClass('actived');
        });
        $('.shadow-popup').on('click', function() {
            $('.minicart').removeClass('actived');
        });
        // End Mini cart

        // Active search
        $('.item.search .cs-font').on('click', function() {
            $('.form-group').toggleClass('actived');
        });
        // End active search

        // Click tools setup
        $('#tool-setup i').on('click', function() {
            $('#tool-setup').toggleClass('active');
        });
        $('#tool-setup .content-setup .content .show-hide-background-img button').on('click', function() {
            $('body').toggleClass('background-img');
        });
        $('#tool-setup .content-setup .content .show-hide-slider button').on('click', function() {
            $('.main-content .main-slide').toggleClass('none');
        });
        $('#tool-setup .content-setup .content .show-hide-box-img button').on('click', function() {
            $('.main-content .box-content').toggleClass('none');
        });
        $('#tool-setup .content-setup .content .show-hide-new-arrivals button').on('click', function() {
            $('.main-content .carousel-product .products-grid').toggleClass('none');
        });
        $('#tool-setup .content-setup .content .show-hide-instagram button').on('click', function() {
            $('.main-content .our-collections').toggleClass('none');
        });
        // End tools setup

        $("#owl-arrivals").owlCarousel({
            margin: 12,
            loop: 1,
            autoplay: 1,
            autoplayTimeout: 5000,
            autoplayHoverPause: 1,
            nav: 1,
            navText: ['<i class="clever-icon-preview cs-font"></i>', '<i class="clever-icon-next cs-font"></i>'],
            dots: 1,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 1
                },
                1E3: {
                    items: 5
                }
            }
        });

        $("#owl-our-collections").owlCarousel({
            margin: 0,
            loop: 1,
            autoplay: 1,
            autoplayTimeout: 5000,
            autoplayHoverPause: 0,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 1
                },
                1E3: {
                    items: 7
                }
            }
        });

        $("#owl-might").owlCarousel({
            margin: 35,
            loop: 1,
            autoplay: 1,
            autoplayTimeout: 5000,
            autoplayHoverPause: 0,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 1
                },
                1E3: {
                    items: 3
                }
            }
        });
        // End Carosel
    });

    // Mega Menu


    $('.toggle-icon').on('click', function() {
        if ($(this).hasClass("active")) {
            $(this).removeClass('active');
            $(this).next().slideUp();
        } else {
            $(this).find('.toggle-icon').removeClass('active');
            $(this).find('ul').slideUp();
            $(this).addClass('active').next().slideDown();
        }
    });

    function getWindowWidth() {
        var windowWidth = 0;
        if (typeof(window.innerWidth) == 'number') {
            windowWidth = window.innerWidth;
        } else {
            if (document.documentElement && document.documentElement.clientWidth) {
                windowWidth = document.documentElement.clientWidth;
            } else {
                if (document.body && document.body.clientWidth) {
                    windowWidth = document.body.clientWidth;
                }
            }
        }
        return windowWidth;
    }

    function toggleNav() {
        $('#toggle-nav').on('click', function() {
            $('body').toggleClass('body-nav-open');
            $(this).toggleClass('nav-open');
            $('#main-menu').toggleClass('open');
            // Height menu
            var heightdevice = screen.height;
            $("#main-menu.nav-mobile.open").height(heightdevice);
        });
    }
    toggleNav();
    $.fn.clevermenu = function(class_menu) {
        var window_width = getWindowWidth();
        $('.mega-menu-sub, li.parent ul').css('display', 'none');
        if (window_width <= 767) {
            $(this).removeClass(class_menu).addClass(class_menu + '_mobile').addClass('menu-mobile').parent().addClass('nav-mobile');
        } else if (window_width > 768) {
            $('.mega-menu-sub, li.parent ul').css('display', 'block');
            $(this).removeClass(class_menu + '_mobile').removeClass('menu-mobile').addClass(class_menu).parent().removeClass('nav-mobile');
        }
    };
    $(window).on('load', function() {
        $('.clever-menu').clevermenu('wrap-main-menu');
        $('.clever-sidebar-menu').clevermenu(' wrap-sidebar-menu');
    }).on('resize', function() {
        var window_width = getWindowWidth();
        toggleNav();
        $('.clever-menu').clevermenu('wrap-main-menu');
        $('.clever-sidebar-menu').clevermenu(' wrap-sidebar-menu');
    }).on('resize', function() {
        var heightimgr = $(window).height() - 130;
        $('.main-slide #carousel-main-slide .carousel-inner .main-slide-lookbook').height(heightimgr);
        $('.main-slide #carousel-main-slide .carousel-inner .main-slide-lookbook .img-left-slider').height(heightimgr);
        $('.main-slide #carousel-main-slide .carousel-inner .main-slide-lookbook .lookbook').height(heightimgr);
    }).on('scroll',function(e) {
		if ($(window).scrollTop() > 200) {
			$('header').addClass('is-sticky');
			$('header .logo').addClass('container padding-0');
		} else {
			$('header').removeClass('is-sticky');
			$('header .logo').removeClass('container padding-0');
			$('.home-03 header .logo').addClass('container padding-0');
			$('.home06 header .logo').addClass('container padding-0');
		}
	});
    // End Mega Menu

    // change is-checked class on buttons
    $('.button-group').each(function(i, buttonGroup) {
        var $buttonGroup = $(buttonGroup);
        $buttonGroup.on('click', 'button', function() {
            $buttonGroup.find('.is-checked').removeClass('is-checked');
            $(this).addClass('is-checked');
        });
    });

    // Show/Hide content left sidebar Category
    $('.left-sidebar .item .title').on('click', function() {
        $(this).toggleClass('active').next().slideToggle();
    });

    $('#container .slider-show').on('click', function() {
        $('.main-content .mains .left-sidebar').slideToggle('slow');
        $('.main-content .mains .main').toggleClass('full');
        $('.main-content .mains .main #content #content-1 .product-item').toggleClass('custom');
    });

    $('#container .slider-show-out').on('click', function() {
        $('.main-content .mains .left-sidebar-out').slideToggle('slow');
    });

    $('.left-sidebar-out .clever-icon-close').on('click', function() {
        $('.left-sidebar-out').hide('slow');
    });
})($);