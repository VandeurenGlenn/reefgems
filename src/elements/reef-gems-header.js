'use strict';
export default class ReefGemsHeader extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({mode: 'open'});
		// @template
		// bind methods
		this._onScroll = this._onScroll.bind(this);
	}
  connectedCallback() {
		document.addEventListener('scroll', this._onScroll, {capture: true});
  }
	get scrollElement() {
		return document.querySelector('body');
	}
	get mainToolbar() {
		return this.querySelector('.main-toolbar');
	}
	get mainAppname() {
		return this.mainToolbar.querySelector('.appname');
	}
	get mainSubtitle() {
		return this.mainToolbar.querySelector('.subtitle');
	}
	get condensedToolbar() {
		return this.querySelector('.condensed-toolbar');
	}
	get condensedAppname() {
		return this.condensedToolbar.querySelector('.appname');
	}
 	_onScroll() {
		let top = this.scrollElement.scrollTop;
		this.transform(top);
	}
	transform(top) {
		let opacity;
		let scrollingUp;
		if (top > this.lastTop) {
			scrollingUp = false;
		} else {
			scrollingUp = true;
		}
		if (top === 0) {
			opacity = 1;
			this.condensedToolbar.classList.remove('condensed');
			this.condensedAppname.setAttribute('hidden', '');
		} else if (top >= 600) {
			opacity= 0;
			if (scrollingUp === true) {
				this.classList.add('condensed');
				this.condensedToolbar.classList.add('condensed');
				this.condensedAppname.removeAttribute('hidden');
			}
		} else {
			opacity = (600 - top) / 600;
			let scale = Math.min(Math.max(opacity, 0.6), 1);
			this.mainAppname.style.transform = 'translateY('
				+ (top / 1.9) + 'px) translateX(-'
				+ (top * 1.1) + 'px) scale(' + scale + ')';
			this.classList.remove('condensed');
			this.condensedToolbar.classList.remove('condensed');
			this.condensedAppname.setAttribute('hidden', '');
		}
		this.lastTop = top;
		this.mainToolbar.style.opacity = opacity;
	}

}
customElements.define('reef-gems-header', ReefGemsHeader);
