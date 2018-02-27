var Home = Barba.BaseView.extend({
    namespace: "home",
    onEnter: function () {},
    onEnterCompleted: function () {
    	preloaderTimeline();
        initHome();
    },
    onLeave: function () {},
    onLeaveCompleted: function () {}
});
var Test = Barba.BaseView.extend({
    namespace: "test",
    onEnter: function () {},
    onEnterCompleted: function () {
    	preloaderTimeline();
        initHome();
    },
    onLeave: function () {},
    onLeaveCompleted: function () {}
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
	Test.init();
	Barba.Pjax.init();
    Barba.Prefetch.init();
    Barba.Dispatcher.on('transitionCompleted', function (currentStatus, oldStatus, container) {
        console.log('completed');
    });

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
	$('.lines-button').click(function(e) {
		e.preventDefault();
		$('.lines-button').toggleClass('close');
		$('.social-menu').toggleClass('social-menu-open', 300);
	});
	$(".chat-box").click(function(e){
		e.stopPropagation();
		queue(function(){
			return $(".chat-box").stop().animate({width: '320'});
		}, function(){
			return $(".chat-box").stop().animate({height: '320'});
		});
	});
	$(document).click(function(){
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