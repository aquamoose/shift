var Home = Barba.BaseView.extend({
    namespace: "home",
    onEnter: function () {},
    onEnterCompleted: function () {
    	preloaderTimeline();
        initHome();
    },
    onLeave: function () {},
    onLeaveCompleted: function () {
    	$('.menu-button').removeClass('close');
		$('.mobile-nav').removeClass('mobile-nav-open', 300);
    }
});
var Works = Barba.BaseView.extend({
    namespace: "works",
    onEnter: function () {},
    onEnterCompleted: function () {
    	preloaderTimeline();
        initWorks();
    },
    onLeave: function () {},
    onLeaveCompleted: function () {
    	$('.menu-button').removeClass('close');
		$('.mobile-nav').removeClass('mobile-nav-open', 300);
    }
});
var Test = Barba.BaseView.extend({
    namespace: "about",
    onEnter: function () {},
    onEnterCompleted: function () {
    	preloaderTimeline();
        initAbout();
    },
    onLeave: function () {},
    onLeaveCompleted: function () {
    	$('.menu-button').removeClass('close');
		$('.mobile-nav').removeClass('mobile-nav-open', 300);
    }
});
function queue(start) {
	var rest = [].splice.call(arguments, 1),
	promise = $.Deferred();

	if (start) {
		$.when(start()).then(function () {
		    queue.apply(window, rest);
	});
} else {
	promise.resolve();
}
	return promise;
}
function preloaderTimeline() {
	$(window).load(function(){
		var dUp = document.querySelector('.loader-bottom');
	    var dDown = document.querySelector('.loader-top');
	    var loadUp = anime({
		  targets: dUp,
		  height: '0%',
		  easing: 'easeInQuart',
		  duration: 1000,
		});
		var loadDown = anime({
		  targets: dDown,
		  height: '0%',
		  easing: 'easeInQuart',
		  duration: 1000,
		});
	});
}

$(function () {
	Home.init();
	Works.init();

	Barba.Pjax.init();
    Barba.Prefetch.init();

    var FadeTransition = Barba.BaseTransition.extend({
	  start: function() {
	    Promise
	      .all([this.newContainerLoading, this.fadeOut()])
	      .then(this.fadeIn.bind(this));
	  },

	  fadeOut: function() {
	    return new Promise(function(resolve){
		    var dDown = document.querySelector('.loader-top');
		    anime({
			  targets: dDown,
			  height: '50%',
			  easing: 'easeInQuart',
			  duration: 1000,
			  complete: function(){
			  	resolve()
			  }
			});
			var dUp = document.querySelector('.loader-bottom');
		    anime({
			  targets: dUp,
			  height: '50%',
			  easing: 'easeInQuart',
			  duration: 1000,
			  complete: function(){
			  	resolve()
			  }
			});
	    })
	  },

	  fadeIn: function() {
	    
	    var _this = this;
	    var $el = $(this.newContainer);
	    window.scrollTo(0,0)
	    $(this.oldContainer).hide();
	    var dDown = document.querySelector('.loader-bottom');
	    var dUp = document.querySelector('.loader-top');
	    anime({
		  targets: dDown,
		  height: '0%',
		  easing: 'easeInQuart',
		  duration: 1000,
		});
		anime({
		  targets: dUp,
		  height: '0%',
		  easing: 'easeInQuart',
		  duration: 1000,
		  complete: function(){
		  	_this.done()
		  }
		});

	  }
	});
    Barba.Pjax.getTransition = function() {
 		return FadeTransition;
	};
	
	Barba.Pjax.cacheEnabled = false;

});

function initGlobal() {
	$(document).foundation();
	$('.menu-button').click(function(e) {
		var open = $(this).hasClass('close');
		if(!open) {
			$(this).addClass('close');
			$('.mobile-nav').addClass('mobile-nav-open', 300);
		} else {
			$(this).removeClass('close');
			$('.mobile-nav').removeClass('mobile-nav-open', 300);
		}
	});
	$(".nav-menu ul li a").each(function() {
		var linkAttr = $(this).attr("data-name");
		var contentAttr = $(".content").attr("data-namespace");
		if(linkAttr == contentAttr) {
			$(this).addClass('has-link');
		} else {
			$(this).removeClass('has-link');
		}
		if(contentAttr == 'works') {
			$(".nav-menu ul").addClass('works-nav');
		} else {
			$(".nav-menu ul").removeClass('works-nav');
		}
	});
	$('.lines-button').click(function(e) {
		e.preventDefault();
		$('.lines-button').toggleClass('close');
		$('.social-menu').toggleClass('social-menu-open', 300);
	});
	$(".chat-box").click(function(e){
		e.stopPropagation();
		$(".chat-box img").addClass('chat-img-open');
		queue(function(){
			return $(".chat-box").stop().animate({width: '320'});
		}, function(){
			return $(".chat-box").stop().animate({height: '320'});
		});
	});
	$(document).click(function(){
		$(".chat-box img").removeClass('chat-img-open');
		queue(function(){
			return $(".chat-box").stop().animate({height: '60'});
		}, function(){
			return $(".chat-box").stop().animate({width: '60'});
		});
	});
}

function initHome() {
	initGlobal();
	$('.new-work-box').click(function(){
		$(".new-work-wrap").toggleClass('new-work-wrap-open');
		$(".new-work-button").toggleClass('new-work-button-open');
		$(this).toggleClass('new-work-box-open');
	});
}
function initWorks() {
	initGlobal();
	var lisInRow = 0;
	function filterTop(top) {
		return function(i) {
			return $(this).offset().top == top;
		};
	}
	var el = $('.work-block:first');
	var elWidth = el.outerWidth(true);
	var rowSize = $('.work-block').filter(filterTop(el.offset().top)).length;
	var colSize = rowSize*rowSize;
	var mapSize = $('.work-block').length;
	var wHeight = $(window).innerHeight();
	var outerBorder = $('.content').outerHeight() - $('.content').height();
	var innerBorder = $('.works-map-wrapper').outerHeight() - $('.works-map-wrapper').height();
	var previewOuterH = $('.preview-wrapper').height();
	var previewOuterW = $('.preview-wrapper').width();
	if(mapSize > colSize) {
		$('.works-map').width(function(index, value){
			return value + elWidth;
		});
	}
	$('.works-map').height(wHeight - outerBorder - innerBorder);
	$('.works-map-wrapper').kinetic();
	$('.preview-box').height(previewOuterH);
	$('.preview-box').width(previewOuterW / 8);
	if($('.preview-box').width() > 175) {
		$('.preview-box').width(175);
	}
	// if($('.preview-box').height() > )
	console.log(previewOuterW);
}

















