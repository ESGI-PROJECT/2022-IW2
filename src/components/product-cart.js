import { LitElement, html, css } from 'lit';
import { Base } from '../Base';
import { addProductToCart } from '../idbHelper';

export class ProductCart extends Base {
  constructor() {
    super();

    this.product = {};

    this.loaded = false;
  }
  static get properties() {
    return {
      product: { type: Object },
      loaded: { type: Boolean, state: true },
    }
  }

  addProduct() {
    addProductToCart(this.product);
  }

  removeProduct() {
    removeProductFromCart(this.product.id);
}

  render() {
    return html`
    <li>
        <p>x${product.quantity} ${product.title}</p>
        <button @click="${this.addProduct(product)}">add</button>
        <button @click="${this.removeProduct(product.id)}">remove</button>
    </li>
    `;
  }
}
customElements.define('product-cart', ProductCart);
