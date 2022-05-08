import { html, nothing } from "lit";
import { Base } from "../Base";
import { setCartProduct, updateCartProduct } from "../idbHelper";
import { toDollars } from "../utils";

export class CartProduct extends Base {
  constructor() {
    super();

    this.cartProduct = {};
  }

  static get properties() {
    return {
      cartProduct: { type: Object },
      loaded: { type: Boolean, state: true },
      handleCartUpdate: { type: Function },
    };
  }

  firstUpdated() {
    this.querySelector("img").addEventListener("load", () => {
      this.loaded = true;
    });
  }

  async handleButtonClick(quantity) {
    const cart = await updateCartProduct({
      image: this.cartProduct.image,
      price: this.cartProduct.price,
      productId: this.cartProduct.productId,
      quantity,
      title: this.cartProduct.title,
    });

    this.handleCartUpdate(cart);
  }

  async handleSelectChange(quantity) {
    const cart = await setCartProduct({
      price: this.cartProduct.price,
      productId: this.cartProduct.productId,
      quantity,
    });

    this.handleCartUpdate(cart);
  }

  render() {
    const { image, quantity, price, totalPrice, title } = this.cartProduct;

    const options = [
      ...Array(
        this.cartProduct.quantity >= 11 ? this.cartProduct.quantity + 1 : 11
      ).keys(),
    ];

    return html`
      <div class="cart-product">
        <figure>
          <div
            class="placeholder ${this.loaded ? "fade" : nothing}"
            style="background-image: url(http://localhost:9000/image/24/${image})"
          ></div>
          <img
            alt="${title}"
            src="http://localhost:9000/image/620/${image}"
            loading="lazy"
            width="128"
            height="72"
          />
        </figure>
        <div class="information">
          <div>${title}</div>
          <div>${toDollars(totalPrice || price)}</div>
          <div class="quantity">
            <button
              id="remove"
              @click="${() => this.handleButtonClick(-1)}"
              type="button"
            >
              ${quantity > 1 ? "➖" : "🗑️"}
            </button>
            <select
              @change="${(event) =>
                this.handleSelectChange(Number(event.target.value))}"
            >
              ${options.map(
                (quantity) => html` <option
                  .value=${quantity}
                  ?selected=${this.cartProduct.quantity === quantity}
                >
                  ${quantity}
                </option>`
              )}
            </select>
            <button
              id="add"
              @click="${() => this.handleButtonClick(1)}"
              type="button"
            >
              ➕
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("cart-product", CartProduct);
