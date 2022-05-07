import { LitElement, html, css } from 'lit';
import { Base } from '../Base';
import { addProductToCart, removeProductFromCart } from '../idbHelper';

export class ProductCart extends Base {
  constructor() {
    super();

    this.product = {};
    this.updateCart = () => {};
  }
  static get properties() {
    return {
      product: { type: Object },
      updateCart: { type: Function },
    }
  }

  async addProduct() {
    const updatedProduct = await addProductToCart(this.product);
    // this.product = updatedProduct;
    // console.log(this.product);
    this.updateCart();
  }

  async removeProduct() {
    const updatedProduct = await removeProductFromCart(this.product.id);
    // this.product = updatedProduct;
    this.updateCart();
  }

  render() {
    return html`
    <li>
        <p>x${this.product.quantity} ${this.product.title}</p>
        <button @click="${() => this.addProduct(this.product)}">add</button>
        <button @click="${() => this.removeProduct(this.product.id)}">remove</button>
    </li>
    `;
  }
}
customElements.define('product-cart', ProductCart);
