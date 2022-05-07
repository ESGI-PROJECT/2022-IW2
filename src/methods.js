import { addCart } from "./api/cart";
import { addToOfflineCart } from "./idbHelper";

export const addToCart = async (networkState, item) => {
    if(networkState) {
        await addCart([...this.cart.items]);
    } else {
        await addToOfflineCart(item);
    }
}
