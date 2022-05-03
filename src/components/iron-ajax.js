import { LitElement, html, css } from 'lit';

export class IronAjax extends LitElement {
  static get properties() {
    return {
      url: { type: String },
    };
  }
  firstUpdated() {
    fetch(this.url)
      .then((data) => data.json())
      .then((values) => this.dispatchEvent(new CustomEvent('get-data', { detail: values })))
  }
}
customElements.define('iron-ajax', IronAjax);
