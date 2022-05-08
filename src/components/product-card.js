import { html } from "lit";
import { Base } from "../Base";
import { updateCartProduct } from "../idbHelper";
import { toDollars } from "../utils";

export class ProductCard extends Base {
  constructor() {
    super();

    this.product = {};
    this.loaded = false;
  }

  static get properties() {
    return {
      product: { type: Object },
      loaded: { type: Boolean, state: true },
    };
  }

  firstUpdated() {
    this.querySelector("img").addEventListener("load", () => {
      this.loaded = true;
    });

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
      <div class="card">
        <header>
          <a href="/product/${this.product.id}">
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
          </a>
        </header>
        <main>
          <h1>
            <a href="/product/${this.product.id}">${this.product.title}</a>
          </h1>
          <p>${this.product.description}</p>
          <span>${toDollars(this.product.price)}</span>
          <button type="button" class="add-to-cart">Add to cart</button>
        </main>
      </div>
    `;
  }
}

customElements.define("product-card", ProductCard);
