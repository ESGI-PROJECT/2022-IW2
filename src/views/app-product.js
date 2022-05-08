import { html } from "lit";
import { Base } from "../Base";
import { updateCartProduct } from "../idbHelper";
import { toDollars } from "../utils";

export class AppProduct extends Base {
  constructor() {
    super();

    this.product = {};
    this.loaded = true;
  }

  static get properties() {
    return {
      product: { type: Object },
      loaded: { type: Boolean, state: true },
    };
  }

  firstUpdated() {
    this.querySelector("button").addEventListener("click", () => {
      updateCartProduct({
        image: this.product.image,
        price: this.product.price,
        productId: this.product.id,
        quantity: 1,
        title: this.product.title,
      });
    });
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
          <h1>${this.product.title}</h1>
          <p>${this.product.description}</p>
          <div id="price">${toDollars(this.product.price)}</div>
          <button type="button" class="add-to-cart">Add to cart</button>
        </main>
      </section>
    `;
  }
}

customElements.define("app-product", AppProduct);
