import { LitElement, html, css } from 'lit';
import { Base } from '../Base';

export class ProductShop extends Base {
  constructor() {
    super();

    this.product = {};
  }
  static get properties() {
    return {
      product: { type: Object },
    }
  }

  _addQuantityInShop(e) {
    e.preventDefault()
    let event = new CustomEvent("addProduct",{detail:this.product})
    document.dispatchEvent(event)
  }

  _removeQuantityInShop(e) {
    e.preventDefault()
    let event = new CustomEvent("removeQuantity",{detail:this.product.id})
    document.dispatchEvent(event)
  }

  _removeInShop(e) {
    e.preventDefault()
    let event = new CustomEvent("removeProduct",{detail:this.product.id})
    document.dispatchEvent(event)
  }
  
  render() {
    return html`
        <section class="product_shop">
          <main>
            <h1>${this.product.title}</h1>
            <p>${this.product.description}</p>
            <p>${this.product.price} $</p>
            <p> Quantité : ${this.product.quantity}</p>
            <div class="action_shop">
              <button class="add_shop" @click="${this._addQuantityInShop}" > + </button>
              <button class="remove_quantity_shop" @click="${this._removeQuantityInShop}" > - </button>
              <button class="remove_shop" @click="${this._removeInShop}" > Supprimer </button>
            </div>
          </main>
      </section>
    `;
  }
}
customElements.define('product-shop', ProductShop);
