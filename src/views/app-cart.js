import { html } from "lit";
import { Base } from "../Base";
import { getRessourceCart, setRessourceCart } from "./../idbHelper";
import { setCart, getCart } from "./../api/cart";

export class AppCart extends Base {
		constructor() {
				super();

			this.cart = {};
		}

		static get properties() {
				return {
					cart: { type: Object },
				};
		}

		render() {
				return html`
						<h1>Cart</h1>
						${this.cart.items && this.cart.items.length > 0
								? html`<button @click="${this._clearCart}">Clear cart</button>`
								: html``}
						<br />
						<h2>Total ${Math.round(this.cart.total * 100) / 100} $</h2>
						${this.cart.items && this.cart.items.length > 0
						? html`
						<table class="table-cart">
								<thead>
										<tr>
												<th></th>
												<th>Product</th>
												<th>Price</th>
												<th>Quantity</th>
												<th colspan="2"></th>
										</tr>
								</thead>
								<tbody>
										${this.cart.items.map(
															(item) => html`
																	<tr>
																			<td>
																					<img
																							src="${item.image}"
																							width="50"
																							height="60"
																					/>
																			</td>
																			<td>${item.title}</td>
																			<td>${item.price} $</td>
																			<td>${item.quantity}</td>
																			<td class="">
																					<button
																					data-itemid="${item.id}"
																							@click="${this._increment}"
																					>
																							Add one item
																					</button>
																					${item.quantity <= 1
																							? html``
																							: html`<button
																										data-itemid="${item.id}"
																										@click="${this._decrement}"
																								>
																										Remove one item
																								</button>`}
																					<button
																							data-itemid="${item.id}"
																							@click="${this._delete}"
																					>
																							Delete
																					</button>
																			</td>
																	</tr>
															`
											)}
								</tbody>
						</table>`
					: "No product in the cart"}
				`;
		}

		async _increment(e) {
				let itemId = e.target.getAttribute("data-itemid");
				let ressourceCart = await getRessourceCart();

				// get current item
				let currentItem = ressourceCart.items.find((item) => {
						if (item.id == itemId) return item;
				});

				// add product and his quantity
				let inc = ressourceCart.items.find((item) => {
						if (item.id == itemId) {
								item.quantity++;
								return true;
						}
				});

				// update cart
				if (inc) {
						ressourceCart.total += currentItem.price;
						await setRessourceCart(ressourceCart);
						await setCart(ressourceCart);
						this.cart = ressourceCart;
				}
		}

		async _decrement(e) {
				let itemId = e.target.getAttribute("data-itemid");
				let ressourceCart = await getRessourceCart();

				// get current item
				let currentItem = ressourceCart.items.find((item) => {
						if (item.id == itemId) return item;
				});

				// remove one item
				let dec = ressourceCart.items.map((item) => {
						if (item.id == itemId) {
								item.quantity--;
								return true;
						}
				});

				// update cart
				if (dec) {
						ressourceCart.total -= currentItem.price;
						await setRessourceCart(ressourceCart);
						 await setCart(ressourceCart);
						this.cart = ressourceCart;
						
				}
		}

		async _delete(e) {
				let itemId = e.target.getAttribute("data-itemid");
				let ressourceCart = await getRessourceCart();

				// get current item
				let currentItem = ressourceCart.items.find((item) => {
						if (item.id == itemId) return item;
				});

				// remove item from cart
				let newItems = ressourceCart.items.filter((item) => {
						return item.id != itemId;
				});

				// update cart
				ressourceCart.total -= currentItem.price * currentItem.quantity;
				ressourceCart.items = newItems;

				await setRessourceCart(ressourceCart);
				 await setCart(ressourceCart);
				this.cart = ressourceCart;
		}

		async _clearCart(e) {
				let itemId = e.target.getAttribute("data-itemid");
				let ressourceCart = await getRessourceCart();

				// update cart
				ressourceCart.items = [];
				ressourceCart.total = 0;

				await setRessourceCart(ressourceCart);
				 await setCart(ressourceCart);
				this.cart = ressourceCart;
		}
}

customElements.define("app-cart", AppCart);
