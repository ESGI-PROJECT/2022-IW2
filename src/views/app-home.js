import { html } from "lit";
import { Base } from "../Base";
import "../components/product-card";

export class AppHome extends Base {
  constructor() {
    super();

    this.products = [];
    this.location = "";
  }
  static get properties() {
    return {
      products: { type: Array },
    };
  }
  render() {
    return this.products.map(
      (product) =>
        html`
          <product-card
            .product="${product}"
            .location="${this.location}"
          ></product-card>
        `
    );
  }
}
customElements.define("app-home", AppHome);
