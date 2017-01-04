'use strict';
import './elements/reef-gems-header.js';
export default class ReefGemsApp extends HTMLElement {
  constructor() {
    super();
		this.root = this.attachShadow({mode: 'open'});
    // @template
  }
}
customElements.define('reef-gems-app', ReefGemsApp);
