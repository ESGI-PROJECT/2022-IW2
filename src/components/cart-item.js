import { LitElement, html, css } from 'lit';
import { Base } from '../Base';
import {getRessource, setRessource} from "../idbHelper";
import {setCart} from "../api/carts";

export class CartItem extends Base {

  constructor() {
    super();

    this.cart = {};
}

  static get properties() {
    return {
      cart: { type: Object },
    }
  }


  render() {
    return html`
        <div class="item">
            <button @click="${this._removeFromCart}">❌</button>
            <p>Title : ${this.cart.title}</p>
            <p>Price : ${this.cart.price} €</p>
            <p>Quantité : ${this.cart.quantity} </p>
            <button @click="${this._addQuantity}">➕</button>
            <button @click="${this._removeQuantity}">➖</button>
        </div>
    `;
  }

  async _removeFromCart() {
    let cart = await getRessource('Carts',"cart");
    let quantity = 0
    let price = 0
    console.log(cart.products)
    cart.products.find(product => {
      console.log(product)
      if (product.id === this.cart.id) {
        quantity = product.quantity;
        price = product.price;
        cart.products.splice(cart.products.indexOf(product), 1);
      }
    });
    cart.total -= (price*quantity);
    cart.total = cart.total._calculTotal ;
    await setRessource('Carts',cart);
    await setCart(cart);

  }

  async _addQuantity() {
    let cart = await getRessource('Carts',"cart");
    let price = 0
    cart.products.find(product => {
      if (product.id === this.cart.id) {
        product.quantity++;
        price = product.price;
        return true;
      }
    });
    cart.total += price;
    cart.total = cart.total._calculTotal ;
    await setRessource('Carts',cart);
    await setCart(cart);

  }

  async _removeQuantity() {
    let cart = await getRessource('Carts',"cart");
    let price = 0
    cart.products.find(product => {
      if (product.id === this.cart.id) {
        product.quantity--;
        price = product.price
        if(product.quantity < 0) {
          product.quantity = 0;
        }
        return true;
      }
    });
    cart.total -= price;
    cart.total = cart.total._calculTotal ;
    await setRessource('Carts',cart);
    await setCart(cart);
  }

  _calculTotal() {
    Math.round(cart.total * 100) / 100
  }

}
customElements.define('cart-item', CartItem);
