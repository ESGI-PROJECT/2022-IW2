import { html } from 'lit';
import { Base } from '../Base';
import "../components/product-card";

export class AppCart extends Base {
  constructor() {
    super();
    
    this.cart = [];
  }
  static get properties() {
    return {
        cart: { type: Array },
        cartTotal: { type: Number }
    };
  }

  render() {
    let cartTotal = 0;
    return html`
    <div class ="cart">
        <div class="products-cart">
            <div= class="title">
            <h1>Your cart</h1>
            </div>
            ${ this.cart.map(item => html`
            <a href="/cart/delete-${ JSON.parse(item['id']) }">Remove from cart</a>
            <product-card
            .product=${ item }>
            </product-card>
        `) }
        </div>
        <script> ${ this.cart.map(item => cartTotal = cartTotal + JSON.parse(item['price'])) } </script>
        <div class="total-cart">
            Total : ${ cartTotal }€
        </div>
    </div>`;
  }

}
customElements.define('app-cart', AppCart);
