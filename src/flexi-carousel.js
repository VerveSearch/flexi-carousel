(function(W,$){
	W.vs =  W.vs || {};

	W.vs.FlexiCarousel = function(el, opts){ 
			this.element = el || {}; 
			this.items = opts.items || {};
			this.carouselClass= opts.carouselClass || '';
			this.captionClass= opts.captionClass || '';
			this.arrowLeft = opts.arrowLeft || null;
			this.arrowRight = opts.arrowRight || null; 
			this.lightboxSel = opts.lightboxSel || false;
			this.lightboxEl = null;
			this.lightboxCaption = null;
			this.hideOnImageClick = opts.hideOnImageClick || false;
	};

	W.vs.FlexiCarousel.boot = function(){
		$('[data-flexi-carousel]').each(function(k,o){ 
			if(!$(this).data('__FLEXI_CAROUSEL__')){
				$(this).data('__FLEXI_CAROUSEL__', new W.vs.FlexiCarousel(this));
			}
		});
	};

	W.vs.FlexiCarousel.prototype = {
		onClick: function(event){
			var caption = $(event.target).next('').html(); 
			this.element.carousel('pause');  
			this.lightboxEl.addClass('active').show(); 
			this.lightboxCaptionEl.text(caption);
			this.lightboxImageEl.css('background-image',  'url(' + $(event.currentTarget).find('img').attr('src') + ')' );
		}, 
		onHide:function(event){
			console.log('olja')
			this.lightboxEl.removeClass('active').hide(); 
		},
		render: function(){
			var elId = this.element.attr('id'),
				innerEl = this.element.find('.carousel-inner'),
				items = null;
			innerEl = innerEl.length === 0?$('<div class="carousel-inner" role="listbox"></div>').appendTo(this.element):innerEl; 
			items = innerEl.addClass(this.carouselClass).find('.item');
			items = items.length === 0?innerEl.append([].concat(this.items.map(function(v,k){ 
						return '<div class="item '+((k===0)?'active':'')+'"><img src="'+v.src+'"><div class="carousel-caption">'+v.caption+'</div></div>'; 
					}),['<a class="left carousel-control" href="#'+elId+'" role="button" data-slide="prev"><span aria-hidden="true" class="glyphicon-chevron-left">'+this.arrowLeft+'</span></a>',
						'<a class="right carousel-control" href="#'+elId+'" role="button" data-slide="next"><span aria-hidden="true" class="glyphicon-chevron-right">'+this.arrowRight+'</span></a>']).join('')):items; 
			this.element.find('.carousel-caption').addClass(this.captionClass);
		 	if(this.lightboxSel){
				this.lightboxEl = $([
							'<div class="'+this.lightboxSel.substring(1)+'">',
								'<div class="lightbox-overlay">',
								'</div>',
								'<div class="lightbox-container">',
									'<div class="lightbox-image"></div>',
									'<div class="lightbox-caption"></div>',
								'</div>',
							'</div>'
						].join('')).appendTo(this.element).hide();
				this.lightboxCaptionEl = this.lightboxEl.find('.lightbox-caption');
				this.lightboxImageEl = this.lightboxEl.find('.lightbox-image');
				$('.item').on('click', $.proxy(this.onClick, this));
				$('.lightbox').on('click', $.proxy(this.onHide, this));
				if(this.hideOnImageClick){
					$('.lightbox-container').on('click', function(e){
						e.stopPropagation();
					});
				}
			}
			this.element.on('swiperight', $.proxy(this.onSwipeRight, this));
			this.element.on('swipeleft', $.proxy(this.onSwipeLeft, this));  
		},
		onSwipeLeft: function(el){
			this.element.carousel('next');
		},
		onSwipeRight: function(el){
			this.element.carousel('prev');
		}
	};

	$.fn.FlexiCarousel = function(options){
		return this.each(function(){ 
			$(this).data('__FLEXI_CAROUSEL__', (p = new W.vs.FlexiCarousel($(this), options)).render());
		});
	};

	$(document).ready(function(){
		W.vs.FlexiCarousel.boot(); 
	});

})(window,jQuery);
