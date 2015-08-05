# flexi-carousel 

A Bootstrap Carousel with swiping feature and  the lightbox.

You can either create the carousel structure from HTML file or you can pass the array of images and their discriptions from the Javascript.


## Dependencies and Libraries 

1. jquery.min.js 
2. jquery.mobile.custom.min.js
3. bootstrap.min.js


## Usage
Instantiale the plugin on your selected dom element, with attributed  class="carousel slide" data-ride="carousel" just like Bootstrap carousel.
To enable the lightbox, specify the target element selector "lightboxSel";
To generate the images, you can od it htrought html, or add images array in options;
To disable lightob hidint on image click, set hideOnImageClick to true

```javascript

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

```
