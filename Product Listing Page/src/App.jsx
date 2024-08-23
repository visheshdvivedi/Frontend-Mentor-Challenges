import React from "react"
import items from "./data.json";

import addToCartIcon from "./assets/images/icon-add-to-cart.svg";
import emptyCartIcon from "./assets/images/illustration-empty-cart.svg";
import incrementQuantityIcon from "./assets/images/icon-increment-quantity.svg";
import decrementQuantityIcon from "./assets/images/icon-decrement-quantity.svg";
import removeItemIcon from "./assets/images/icon-remove-item.svg";
import carbonNeutralIcon from "./assets/images/icon-carbon-neutral.svg";
import orderConfirmedIcon from "./assets/images/icon-order-confirmed.svg";

const initialCartState = items;

const cartReducer = (state, action) => {
    let newState = [...state];
    switch (action.type) {
        case 'update_count': {
            let index = state.indexOf(state.find(val => val.name === action.name));
            newState[index].count = action.count;
            break;
        }
        case 'clear_cart': {
            for (let i = 0; i < state.length; i++) {
                newState[i].count = 0;
            }
            break;
        }
    }
    return newState;
}

const OrderConfirmCard = ({ item }) => {
    if (item.count === 0) return;
    return (
        <section className="flex flex-row justify-between items-center gap-4 w-full">
            <img src={item.image.thumbnail} width={40} alt={`Image of a ${item.name}`} />
            <div className="flex-1">
                <p className="text-xs font-[600]">{item.name}</p>
                <p className="flex flex-row justify-start items-center gap-3">
                    <span className="text-red font-[600] text-sm">{item.count}x</span>
                    <span className="text-rose-400 font-[600] text-sm">@ ${item.price}</span>
                </p>
            </div>
            <span className="font-[600] ">${(item.count * item.price).toFixed(2)}</span>
        </section>
    )
}

const OrderConfirmationModal = ({ show, cart, resetOrder }) => {
    if (!show) return;

    const getTotalCost = () => {
        return cart.reduce((total, val) => total + (val.count * val.price), 0).toFixed(2);
    }

    return (
        <aside className="flex flex-col justify-end sm:justify-center sm:items-center w-screen h-screen" style={{ position: "fixed", zIndex: "10", bottom: "0", backgroundColor: "rgba(0, 0, 0, 0.5)", opacity: (show ? "1" : "0") }}>
            <section className="bg-white px-5 py-10 flex flex-col items-start max-h-[90%] rounded-t-2xl sm:rounded-2xl min-w-[500px]">
                <img src={orderConfirmedIcon} alt="green tick icon" />
                <p className="font-[700] text-4xl mb-1 mt-5">Order Confirmed</p>
                <p className="text-sm text-rose-400">We hope you enjoy your food!</p>

                <section className="bg-rose-100 px-4 py-3 mt-5 w-full flex flex-col gap-5 max-h-[50%] overflow-y-scroll">
                    {cart.map(item => <OrderConfirmCard item={item} />)}
                    <hr className="border-rose-300" />
                    <section className="flex flex-row justify-between items-center w-full">
                        <span className="text-sm text-rose-900">Order Total</span>
                        <span className="text-2xl text-rose-900 font-[700]">${getTotalCost()}</span>
                    </section>
                </section>
                <button onClick={resetOrder} className="rounded-full px-4 py-3 bg-red text-white w-full mt-5">
                    Start New Order
                </button>
            </section>
        </aside>
    )
}

const CartItem = ({ item, clearItem }) => {
    if (item.count === 0) return;
    return (
        <section className="flex flex-row justify-between">
            <div>
                <p className="font-[600] text-sm text-sm">{item.name}</p>
                <p className="flex flex-row justify-start items-center gap-3">
                    <span className="text-red font-[600] text-sm">{item.count}x</span>
                    <span className="text-rose-300 font-[600] text-xs">@ ${item.price}</span>
                    <span className="text-rose-500 font-[600] text-xs">${(item.price * item.count).toFixed(2)}</span>
                </p>
            </div>
            <button onClick={() => clearItem(item.name)}>
                <img className="p-1" width={22} src={removeItemIcon} alt="remove item icon" />
            </button>
        </section>
    )
}

const ItemCard = ({ item, addItem, removeItem }) => {
    return (
        <section className="rounded-lg">
            <figure className="relative">
                <img className={`rounded-lg border-2 ${!item.count ? "border-rose-400" : "border-red"}`} src={item.image.mobile} alt={`image of a ${item.name}`} />
                {item.count ? (
                    <section className={`absolute flex flex-row justify-between items-center gap-2 bg-red w-[150px] px-3 py-2 border border-rose-400 rounded-full`} style={{ left: "50%", transform: "translate(-50%,  -50%)" }}>
                        <button onClick={() => addItem(item.name)}>
                            <img className="border border-white rounded-full p-1" src={incrementQuantityIcon} alt="increment item quantity icon" />
                        </button>
                        <span className="text-white">{item.count}</span>
                        <button onClick={() => removeItem(item.name)}>
                            <img className="border border-white rounded-full p-1 py-2" src={decrementQuantityIcon} alt="decrement item quantity icon" />
                        </button>
                    </section>
                ) : (
                    <button onClick={() => addItem(item.name)} type="button" title="Add to Cart" aria-label="Add to Cart" className="absolute flex flex-row justify-center items-center gap-2 bg-white w-[150px] py-2 border border-rose-400 rounded-full" style={{ left: "50%", transform: "translate(-50%,  -50%)" }}>
                        <img src={addToCartIcon} alt="Add to cart icon" />
                        <span aria-label="Add to Cart" className="text-sm font-[600]">Add to Cart</span>
                    </button>
                )}

            </figure>
            <p className="mt-8 text-sm text-rose-400 font-[600]">{item.category}</p>
            <h2 className="text-rose-500 font-[700]">{item.name}</h2>
            <p className="text-red font-[600]">${item.price.toFixed(2)}</p>
        </section >
    )
}

const App = () => {

    const [cartState, cartDispatch] = React.useReducer(cartReducer, initialCartState);
    const [openOrderConfirmation, setOpenOrderConfirmation] = React.useState(false);

    const addItemToCart = (name) => {
        let index = cartState.indexOf(cartState.find(item => item.name === name));
        let count = cartState[index].count + 1;
        cartDispatch({ name: name, type: 'update_count', count: count });
    }

    const removeItemFromCart = (name) => {
        let index = cartState.indexOf(cartState.find(item => item.name === name));
        let count = cartState[index].count - 1;
        cartDispatch({ name: name, type: 'update_count', count: count });
    }

    const clearItemFromCart = (name) => {
        let index = cartState.indexOf(cartState.find(item => item.name === name));
        cartDispatch({ name: name, type: 'update_count', count: 0 });
    }

    const getTotalItemsInCart = () => {
        return cartState.reduce((total, val) => total + val.count, 0);
    }

    const getTotalCost = () => {
        return cartState.reduce((total, val) => total + (val.count * val.price), 0).toFixed(2);
    }

    const resetOrder = () => {
        cartDispatch({ type: 'clear_cart' });
        setOpenOrderConfirmation(false);
    }

    return (
        <>
            <section className="p-5 sm:p-8 md:p-10 flex flex-col sm:flex-row sm:gap-5 sm:justify-between">

                {/* Product Listing Section */}
                <section className="sm:w-[80%] md:w-[75%] lg:w-[70%]">
                    <h1 className="text-4xl font-bold">Desserts</h1>
                    <section className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map(item => (
                            <ItemCard key={item.name} item={item} addItem={addItemToCart} removeItem={removeItemFromCart} />
                        ))}
                    </section>
                </section>

                {/* Shopping Cart Section */}
                <section className="p-5 mt-10 sm:mt-0 sm:min-w-[30%]">
                    <aside className="rounded-lg bg-white p-5">
                        <h2 className="text-xl text-red font-[700]">Your Cart ({getTotalItemsInCart()})</h2>
                        {getTotalItemsInCart() === 0 ? (
                            <section className="flex flex-col items-center py-5 px-2">
                                <img src={emptyCartIcon} alt="" width={100} />
                                <span className="font-[600] text-rose-500 text-sm">Your added items will appear here</span>
                            </section>
                        ) : (
                            <section className="flex flex-col gap-5 pt-5">
                                {cartState.map(item => <CartItem item={item} clearItem={clearItemFromCart} />)}
                                <hr className="border-rose-100" />
                                <section className="flex flex-row justify-between items-center">
                                    <span className="text-sm text-rose-900">Order Total</span>
                                    <span className="text-2xl text-rose-900 font-[700]">${getTotalCost()}</span>
                                </section>
                                <section className="bg-rose-50 px-4 py-3 rounded-lg flex flex-row justify-center items-center gap-2">
                                    <img src={carbonNeutralIcon} alt="carbon neutral icon" />
                                    <p className="text-xs">
                                        This is a <b>carbon neutral</b> delivery
                                    </p>
                                </section>
                                <button onClick={() => setOpenOrderConfirmation(true)} className="rounded-full px-4 py-3 bg-red text-white">
                                    Confirm Order
                                </button>
                            </section>
                        )}
                    </aside>
                </section>
            </section>
            <OrderConfirmationModal show={openOrderConfirmation} cart={cartState} resetOrder={resetOrder} />
        </>
    )
}

export default App
