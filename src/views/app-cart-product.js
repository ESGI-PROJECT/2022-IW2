import { LitElement, html, css } from "lit";
import { Base } from "../Base";
import {
  CART_STORE_NAME,
  deleteRessource,
  getCardProduct,
  setRessource,
  unsetRessource,
} from "../idbHelper";

export class AppCartProduct extends Base {
  constructor() {
    super();

    this.product = {};
    this.loaded = true;
    this.iscart = false;
  }
  static get properties() {
    return {
      product: { type: Object },
      iscart: { type: Boolean },
    };
  }

  async addToCart() {
    let storeCardProduct = await setRessource(
      { ...this.product, quantity: 1 },
      CART_STORE_NAME
    );
    this.product = getCardProduct(storeCardProduct, this.product.id)[0];
  }
  async removeFromCart() {
    let storeCardProduct = await unsetRessource(
      this.product.id,
      CART_STORE_NAME
    );
    this.product = getCardProduct(storeCardProduct, this.product.id)[0] || {};
  }
  async removeAllFromCart() {
    let storeCardProduct = await deleteRessource(this.product.id);
    this.product = getCardProduct(storeCardProduct, this.product.id)[0] || {};
  }

  render() {
    return html`
      <section class="product">
        <header>
          <figure>
            <div
              class="placeholder ${this.loaded ? "fade" : ""}"
              style="background-image: url(http://localhost:9000/image/24/${this
                .product.image})"
            ></div>
            <img
              alt="${this.product.title}"
              src="http://localhost:9000/image/620/${this.product.image}"
              loading="lazy"
              width="1280"
              height="720"
            />
          </figure>
        </header>

        <main>
          <h1 class="font-bold">${this.product.title}</h1>
          <p>${this.product.description}</p>
          <div class="flex w-full items-center justify-between">
            <button
              @click="${this.removeAllFromCart}"
              class="flex  item-center shadow justify-center bg-red-400 text-white text-sm rounded-lg px-4 py-1 my-4 hover:bg-red-600"
            >
              Delete
            </button>
            <div>
              <div class="flex items-center justify-end">
                <button
                  @click="${this.removeFromCart}"
                  class="flex  item-center shadow justify-center bg-white rounded px-4 py-2 my-4 hover:bg-gray-200"
                >
                  <i class="fa fa-minus"></i>
                </button>
                <p
                  class="flex  item-center  font-bold text-3xl justify-center bg-white rounded mx-4  py-2 my-4"
                >
                  ${this.product.quantity}
                </p>
                <button
                  @click="${this.addToCart}"
                  class="flex item-center shadow justify-center bg-white rounded px-4 py-2 mr-4 my-4 hover:bg-gray-200"
                >
                  <i class="fa fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </main>
      </section>
    `;
  }
}
customElements.define("app-cart-product", AppCartProduct);
