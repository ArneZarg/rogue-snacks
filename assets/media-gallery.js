import { Component } from '@theme/component';
import { ThemeEvents } from '@theme/events';

/**
 * A custom element that renders a media gallery.
 *
 * This version keeps zoom inside the slideshow/media container
 * instead of opening the fullscreen zoom dialog.
 *
 * @typedef {object} Refs
 * @property {import('./zoom-dialog').ZoomDialog} [zoomDialogComponent]
 * @property {import('./slideshow').Slideshow} [slideshow]
 * @property {HTMLElement[]} [media]
 *
 * @extends Component<Refs>
 */
export class MediaGallery extends Component {
  #controller = new AbortController();

  connectedCallback() {
    super.connectedCallback();

    const { signal } = this.#controller;
    const target = this.closest('.shopify-section, dialog');

    target?.addEventListener(ThemeEvents.variantUpdate, this.#handleVariantUpdate, { signal });

    this.addEventListener(
      'click',
      (event) => {
        const clickedZoomable =
          event.target instanceof Element &&
          event.target.closest('slideshow-slide, [data-media-zoomable], .product-media-container--image');

        if (!clickedZoomable) {
          this.#resetAllZoom();
        }
      },
      { signal }
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#controller.abort();
  }

  /**
   * Handles a variant update event by replacing the current media gallery with a new one.
   *
   * @param {CustomEvent} event
   */
  #handleVariantUpdate = (event) => {
    const source = event.detail?.data?.html;
    if (!source) return;

    const newMediaGallery = source.querySelector('media-gallery');
    if (!newMediaGallery) return;

    this.replaceWith(newMediaGallery);
  };

  /**
   * Zoom the image only inside its slideshow slide/container.
   *
   * @param {number} index
   * @param {PointerEvent} event
   */
  zoom(index, event) {
    event.preventDefault();

    const mediaItem = this.media?.[index];
    if (!mediaItem) return;

    const zoomContainer =
      mediaItem.closest('slideshow-slide') ||
      mediaItem.querySelector('slideshow-slide') ||
      mediaItem.querySelector('[data-media-zoomable]') ||
      mediaItem.querySelector('.product-media-container--image') ||
      mediaItem;

    const image =
      zoomContainer.querySelector('img.product-media__image') ||
      zoomContainer.querySelector('img');

    if (!image || !(image instanceof HTMLImageElement)) return;

    const alreadyZoomed = zoomContainer.classList.contains('is-zoomed');

    this.#resetAllZoom();

    if (alreadyZoomed) return;

    zoomContainer.classList.add('is-zoomed');

    const rect = zoomContainer.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    image.style.transformOrigin = `${x}% ${y}%`;
  }

  /**
   * Kept for compatibility with existing integrations.
   *
   * @param {number} index
   */
  preloadImage(index) {
    const zoomDialogMedia = this.refs.zoomDialogComponent?.refs.media[index];
    if (!zoomDialogMedia) return;

    this.refs.zoomDialogComponent?.loadHighResolutionImage(zoomDialogMedia);
  }

  #resetAllZoom() {
    const mediaItems = this.media || [];

    mediaItems.forEach((mediaItem) => {
      const zoomContainer =
        mediaItem.closest('slideshow-slide') ||
        mediaItem.querySelector('slideshow-slide') ||
        mediaItem.querySelector('[data-media-zoomable]') ||
        mediaItem.querySelector('.product-media-container--image') ||
        mediaItem;

      const image =
        zoomContainer.querySelector('img.product-media__image') ||
        zoomContainer.querySelector('img');

      zoomContainer.classList.remove('is-zoomed');

      if (image && image instanceof HTMLImageElement) {
        image.style.transformOrigin = 'center center';
      }
    });
  }

  get slideshow() {
    return this.refs.slideshow;
  }

  get media() {
    return this.refs.media;
  }

  get presentation() {
    return this.dataset.presentation;
  }
}

if (!customElements.get('media-gallery')) {
  customElements.define('media-gallery', MediaGallery);
}