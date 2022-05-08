import { html } from 'lit';
import { Base } from '../Base';
import "../components/product-card";

export class AppCart extends Base {
    
    constructor() {
        super();
    
        this.products = [];
      }
      static get properties() {
        return {
          products: { type: Array },
        };
      }

      render() {
        return html`
          <section class="product">
            <header>
              <figure>
                <div class="placeholder ${this.loaded ? 'fade' : '' }" style="background-image: url(http://localhost:9000/image/24/${this.product.image})"></div>
                <img
                  alt="${this.product.title}"
                  src="http://localhost:9000/image/620/${this.product.image}"
                  loading="lazy"
                  width="1280" height="720">
              </figure>
            </header>
            <main>
              <h1>${this.product.title}</h1>
              <p>${this.product.description}</p>
            </main>
          </section>
        `;
      }
}

