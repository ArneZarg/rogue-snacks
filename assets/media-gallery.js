media-gallery [data-media-zoomable],
media-gallery .product-media-container--image,
media-gallery .product-media,
media-gallery li,
media-gallery slideshow-slide {
  position: relative;
  overflow: hidden;
}

media-gallery [data-media-zoomable] img,
media-gallery .product-media-container--image img,
media-gallery .product-media img,
media-gallery li img,
media-gallery slideshow-slide img {
  transition: transform 0.3s ease;
  transform-origin: center center;
  cursor: zoom-in;
  will-change: transform;
}

media-gallery [data-media-zoomable].is-zoomed img,
media-gallery .product-media-container--image.is-zoomed img,
media-gallery .product-media.is-zoomed img,
media-gallery li.is-zoomed img,
media-gallery slideshow-slide.is-zoomed img {
  transform: scale(2);
  cursor: zoom-out;
}