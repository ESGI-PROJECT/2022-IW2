import { html } from 'lit';
import { Base } from '../Base';

export class AppCart extends Base {
  constructor() {
    super();
  }

  render() {
    return html`
      <h2>My Cart</h2> 
    `
  }
}
customElements.define('app-cart', AppCart);
