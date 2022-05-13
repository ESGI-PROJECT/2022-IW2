import { html } from "lit";
import { Base } from "../Base";
import { getCartValue, setCartValue, getCartKeys } from "../idbHelper";

export class ProductCard extends Base {
  constructor() {
    super();

    this.product = {};
    this.loaded = false;
    this.location = "";
  }
  static get properties() {
    return {
      product: { type: Object },
      loaded: { type: Boolean, state: true },
      location: { type: String },
    };
  }
  firstUpdated() {
    this.querySelector("img").addEventListener("load", () => {
      this.loaded = true;
    });
  }
  addToCart() {
    // check if articles exist before trying to add some obj, if not, add key "articles"
    getCartKeys()
      .then((res) => {
        if (!res.includes("articles")) setCartValue("articles", []);
        if (!res.includes("total")) setCartValue("total", 0);
        getCartValue("articles")
          .then((res) => {
            let arrItems = res;
            arrItems.push(this.product);
            setCartValue("articles", arrItems);
          })
          .catch((err) => console.error(err));
        getCartValue("total")
          .then((res) => {
            let total = res;
            total += this.product.price;
            setCartValue("total", total);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  }
  render() {
    let buttons;
    if (this.location === "home") {
      buttons = html`<button @click="${this.addToCart}">add to cart</button>`;
    } else {
      buttons = html`<button @click="${console.log("rm", this.product.id)}">
        remove from cart
      </button>`;
    }
    return html`
      <div>
        <a href="/product/${this.product.id}" class="card">
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
          </main>
        </a>
        ${buttons}
      </div>
    `;
  }
}
customElements.define("product-card", ProductCard);
