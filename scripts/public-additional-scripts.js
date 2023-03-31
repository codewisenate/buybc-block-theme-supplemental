import { qs, qsa, createElement, moveSocialLinks } from './utils';
/**
 * DOM manipulation.
 * @return {void}
 */
const domReady = () => {
	/*
	 * SafarIE bug requires 0ms timeout.
	 */
	setTimeout(function () {
		/**
		 * Test import of util – remove when ready to use.
		 */
		const body = qs('body');
		const headerGroup = qs('.bcgov-header-group');
		const banner = qs('.banner');

		if (headerGroup && !banner) {
			body.style.paddingTop = `${headerGroup.offsetHeight}px`;
		}

		const productSelectButtons = qs('.product-select-buttons');
		const successStory = qs('.single-success_stories');
		const featuredRecipe = qs('.single-recipes');
		const pastEvents = qs('.single-post');
		const breadCrumbs = qs('.aioseo-breadcrumbs');

		if (productSelectButtons || successStory && breadCrumbs || featuredRecipe || pastEvents) {
			breadCrumbs.parentElement.remove();
		}

		// Footer banner handling

		const footerImg = qs('.footer-banner');

		if (footerImg) {
			if (body.classList.contains('about-contact')
				|| body.classList.contains('about')
				|| body.classList.contains('contact')) {
				const aboutImg = qs('img', footerImg);
				aboutImg.setAttribute('src', 'https://buybc.gov.bc.ca/app/uploads/sites/386/2023/02/footer-about-contact-01.png');
				aboutImg.setAttribute('srcset', 'https://buybc.gov.bc.ca/app/uploads/sites/386/2023/02/footer-about-contact-01.png');
			}
			if (body.classList.contains('events')) {
				const eventsImg = qs('img', footerImg);
				eventsImg.setAttribute('src', 'https://buybc.gov.bc.ca/app/uploads/sites/386/2023/02/footer-events-01.png');
				eventsImg.setAttribute('srcset', 'https://buybc.gov.bc.ca/app/uploads/sites/386/2023/02/footer-events-01.png');
			}
			if (body.classList.contains('find')) {
				const findImg = qs('img', footerImg);
				findImg.setAttribute('src', 'https://buybc.gov.bc.ca/app/uploads/sites/386/2023/02/footer-find-01.png');
				findImg.setAttribute('srcset', 'https://buybc.gov.bc.ca/app/uploads/sites/386/2023/02/footer-find-01.png');
			}
			if (body.classList.contains('join')) {
				const joinImg = qs('img', footerImg);
				joinImg.setAttribute('src', 'https://buybc.gov.bc.ca/app/uploads/sites/386/2023/02/footer-join-01.png');
				joinImg.setAttribute('srcset', 'https://buybc.gov.bc.ca/app/uploads/sites/386/2023/02/footer-join-01.png');
			}
			if (body.classList.contains('learn')) {
				const learnImg = qs('img', footerImg);
				learnImg.setAttribute('src', 'https://buybc.gov.bc.ca/app/uploads/sites/386/2023/02/footer-learn-01.png');
				learnImg.setAttribute('srcset', 'https://buybc.gov.bc.ca/app/uploads/sites/386/2023/02/footer-learn-01.png');
			}
		}

		/**
		 * Collapse additional collapsables after they initialise.
		 */

		const collapseContainers = qsa('.wp-block-bcgov-block-theme-collapse');

		if (collapseContainers) {
			setTimeout(function () {
				collapseContainers.forEach((container, index) => {
					if (0 !== index) {
						const closeLink = qs('.collapse-collapse-all', container);
						if (closeLink) {
							closeLink.dispatchEvent(new Event('click'));
						}
					}
				}, 50);
			})
		}

		/* 
		 * Manipulate Individual Product template.
		 */
		const productLabels = qsa('.product_label');
		const productCategoryLink = qs('.taxonomy-product_categories a');

		// Update back to search link to point to product's category page.
		if (productCategoryLink) {
			const productHref = productCategoryLink.getAttribute('href');
			const productHrefParts = productHref.split('/').filter(Boolean);
			const productCategory = productHrefParts[productHrefParts.length - 1];

			const productBackLink = qs('.back-link a');
			if (productBackLink) {
				productBackLink.setAttribute('href', `${window.site.domain}/find-bc-products/search-buy-bc-products/buy-bc-products-${productCategory}`);
			}
		}

		// Add necessary icons and links to ACF meta fields.
		if (productLabels) {
			productLabels.forEach(label => {
				if (label.classList.contains('product_label_location')) {
					if (label.innerText) {
						const marker = createElement('span', {
							class: 'location-marker'
						});
						label.insertBefore(marker, label.firstChild);
					} else {
						label.remove();
					}
				} else if (label.classList.contains('product_label_email')) {
					if (label.innerText) {
						const marker = createElement('span', {
							class: 'contact-marker'
						});
						if (label.innerText.includes('@')) {
							const email = label.innerText;
							label.innerHTML = `<a href="mailto:${email}">${email}</a>`;
						}
						label.insertBefore(marker, label.firstChild);
					} else {
						label.remove();
					}
				} else if (label.classList.contains('product_label_phone')) {
					if (label.innerText) {
						const marker = createElement('span', {
							class: 'phone-marker'
						});
						if (/^\d+$/.test(label.innerText)) {
							const phone = `+1${label.innerText.replace(/[^\d]/g, '')}`;
							label.innerHTML = `<a href="tel:${phone}">${label.innerText}</a>`;
						}
						label.insertBefore(marker, label.firstChild);
					} else {
						label.remove();
					}
				} else if (label.classList.contains('product_label_web')) {
					if (label.innerText) {
						const marker = createElement('span', {
							class: 'url-marker'
						});
						if (label.innerText.includes('http')) {
							const url = label.innerText;
							label.innerHTML = `<a href="${url}">${url.replace(/^https?:\/\//i, "")}</a>`;
						}
						label.insertBefore(marker, label.firstChild);
					} else {
						label.remove();
					}
				}
			});
		}

		// Accessibility related DOM updates
		// Disabled links
		const disabledLinks = qsa('.disabled a, .pointer-events-none a');

		if (disabledLinks) {
			disabledLinks.forEach(link => {
				link.addEventListener('click', e => {
					e.preventDefault();
					e.stopPropagation();
				});
				link.addEventListener('focus', e => {
					e.preventDefault();
					e.stopPropagation();
					link.blur();
				});
				link.tabIndex = -1;
			});
		}

		// Do not focus Query Loop image links
		const postFeedImages = qsa('.post-feed-image a');

		if (postFeedImages) {
			postFeedImages.forEach(imageLink => {
				imageLink.tabIndex = -1;
			});
		}
		// reflow the position of the Social Media links into the navigation
		moveSocialLinks();
	}, 0);
};

if ('complete' === document.readyState) {
	domReady();
} else {
	document.addEventListener('DOMContentLoaded', domReady);
}
