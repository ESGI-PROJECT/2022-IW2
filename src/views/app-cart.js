import { html } from 'lit';
import { Base } from '../Base';
import {getRessourceCart, setRessourceCart} from "../idbHelper";

export class AppCart extends Base {
  constructor() {
    super();

    this.carts = [];
  }
  static get properties() {
    return {
      carts: { type: Array },
    };
  }
  render() {
    return `<p>Panier</p>`
  }
}
customElements.define('app-cart', AppCart);
