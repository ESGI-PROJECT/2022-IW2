import { html } from 'lit';
import { Base } from '../Base';
import "../components/cart-product-card";
import {removeCartProduct, updateCartProduct} from "../api/cart";

export class AppCart extends Base {
  constructor() {
    super();

    this.cartProducts = [];
    this.cartTotal = 0;
  }
  static get properties() {
    return {
      cartProducts: { type: Array },
    };
  }
  shouldUpdate(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'cartProducts') {
        this.cartProducts.map(product => {
          this.cartTotal += product.quantity * product.price;
        });
      }
    });
    return true;
  }
  render() {
    if(this.cartProducts.length > 0) {
      return (this.cartProducts.map((cartProduct, index) => {
        if (this.cartProducts.length !== index + 1) {
          return html`
            <cart-product-card
              .cartProduct="${cartProduct}"
              .cartProductIndex="${index}"
            ></cart-product-card>
          `
        } else {
          return html`
            <cart-product-card
              .cartProduct="${cartProduct}"
              .cartProductIndex="${index}"
            ></cart-product-card>
            <div id="cart-total"
                  style="background-color: var(--app-bg-color);
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    margin: 0;
                    padding: 0;
                    height: 60px;
                    color: white;
                    text-align: center;
                  ">
                <div style="line-height: 60px;
                            font-size: 30px;
                            font-weight: bold;
                        ">
                    Total : ${this.cartTotal}€ 
                </div>
            </div>
          `
        }
        })
      );
    } else {
      return html`
        <div>Your cart is empty</div>
      `
    }
  }
}
customElements.define('app-cart', AppCart);
