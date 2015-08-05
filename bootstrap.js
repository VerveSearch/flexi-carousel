jQuery(document).ready(function(){
	$('#carousel-example-generic').FlexiCarousel({
		carouselClass: 'my-carousel-class',
		captionClass : 'my-caption-class',
		items : [{
			"src" : "/image1.jpg",
			"caption" : "This is image 1"
		},{
			"src" : "/image2.jpg",
			"caption" : "This is image 2"
		},{
			"src" : "/image3.jpg",
			"caption" : "This is image 3"
		}],
		arrowLeft : ' <i class="fa fa-arrow-left"></i>',
		arrowRight : '<i class="fa fa-arrow-right"></i>',
		lightboxSel : '.lightbox',
		hideOnImageClick : true
	});
});
 
