import React, { useEffect, useState } from "react";
import "./App.css";

const STORAGE_KEY = "mariosPizzaLastOrder";

const initialCustomerInfo = {
  name: "",
  phone: "",
  email: "",
  address: "",
  isDelivery: false,
};

const initialPizzaOrder = {
  size: "medium",
  crust: "regular",
  quantity: 1,
  toppings: [],
  sides: [],
  specialInstructions: "",
};

const sizePrices = {
  small: 12.99,
  medium: 15.99,
  large: 18.99,
  xlarge: 21.99,
};

const crustPrices = {
  regular: 0,
  thin: 1,
  thick: 2,
  stuffed: 3,
};

const sideOptions = [
  { id: "cola", name: "Cola", price: 2.49 },
  { id: "lemonade", name: "Lemonade", price: 2.99 },
  { id: "garlic-bread", name: "Garlic Bread", price: 4.49 },
  { id: "ranch-dip", name: "Ranch Dip", price: 0.99 },
  { id: "marinara-dip", name: "Marinara Dip", price: 0.99 },
  { id: "cheesy-breadsticks", name: "Cheesy Breadsticks", price: 5.99 },
];

const labels = {
  small: "Small",
  medium: "Medium",
  large: "Large",
  xlarge: "Extra Large",
  regular: "Regular",
  thin: "Thin",
  thick: "Thick",
  stuffed: "Stuffed",
};

const formatLabel = (value) =>
  labels[value] || value.charAt(0).toUpperCase() + value.slice(1);

const getPizzaBasePrice = (order) => sizePrices[order.size] + crustPrices[order.crust];

const getPizzaUnitPrice = (order) =>
  getPizzaBasePrice(order) + order.toppings.length * 1.5;

const getSidesTotal = (sides = []) =>
  sides.reduce((total, side) => total + side.price * side.quantity, 0);

function App() {
  const [customerInfo, setCustomerInfo] = useState(initialCustomerInfo);
  const [pizzaOrder, setPizzaOrder] = useState(initialPizzaOrder);
  const [lastOrder, setLastOrder] = useState(null);

  const [formState, setFormState] = useState({
    isSubmitting: false,
    currentErrors: {},
  });

  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem(STORAGE_KEY);

      if (savedOrder) {
        setLastOrder(JSON.parse(savedOrder));
      }
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const calculateTotalPrice = () => {
    let total = getPizzaUnitPrice(pizzaOrder) * pizzaOrder.quantity;
    total += getSidesTotal(pizzaOrder.sides);

    if (customerInfo.isDelivery) {
      total += 2.99;
    }

    return total.toFixed(2);
  };

  const validateForm = () => {
    const errors = {};

    if (!customerInfo.name.trim()) {
      errors.name = "Please enter your full name";
    } else if (customerInfo.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    const phoneRegex = /^[\d\-()+]{10,}$/;
    if (!customerInfo.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(customerInfo.phone.replace(/\s/g, ""))) {
      errors.phone = "Please enter a valid phone number";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerInfo.email.trim()) {
      errors.email = "Email ID is required";
    } else if (!emailRegex.test(customerInfo.email)) {
      errors.email = "Please enter a valid email ID";
    }

    if (customerInfo.isDelivery && !customerInfo.address.trim()) {
      errors.address = "Delivery address is required";
    }

    if (pizzaOrder.toppings.length === 0) {
      errors.toppings = "Please select at least one topping";
    }

    if (pizzaOrder.quantity < 1) {
      errors.quantity = "Please enter at least 1 pizza";
    }

    return errors;
  };

  const checkValidation = () => {
    const errors = validateForm();
    setFormState((prev) => ({
      ...prev,
      currentErrors: errors,
    }));

    return Object.keys(errors).length === 0;
  };

  const clearError = (fieldName) => {
    if (!formState.currentErrors[fieldName]) {
      return;
    }

    setFormState((prev) => ({
      ...prev,
      currentErrors: { ...prev.currentErrors, [fieldName]: "" },
    }));
  };

  const resetForm = () => {
    setCustomerInfo(initialCustomerInfo);
    setPizzaOrder(initialPizzaOrder);
    setFormState({
      isSubmitting: false,
      currentErrors: {},
    });
  };

  const updateSide = (sideOption, isChecked) => {
    if (isChecked) {
      setPizzaOrder({
        ...pizzaOrder,
        sides: [
          ...pizzaOrder.sides,
          { ...sideOption, quantity: 1 },
        ],
      });
      return;
    }

    setPizzaOrder({
      ...pizzaOrder,
      sides: pizzaOrder.sides.filter((side) => side.id !== sideOption.id),
    });
  };

  const updateSideQuantity = (sideId, quantity) => {
    setPizzaOrder({
      ...pizzaOrder,
      sides: pizzaOrder.sides.map((side) =>
        side.id === sideId
          ? { ...side, quantity: Math.max(1, Number(quantity) || 1) }
          : side,
      ),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = checkValidation();
    if (!isValid) {
      const firstError = document.querySelector(".error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setFormState((prev) => ({
      ...prev,
      isSubmitting: true,
    }));

    const orderData = {
      orderNumber: Math.floor(10000 + Math.random() * 90000),
      customer: { ...customerInfo },
      pizza: { ...pizzaOrder },
      pizzaTotal: (getPizzaUnitPrice(pizzaOrder) * pizzaOrder.quantity).toFixed(2),
      sidesTotal: getSidesTotal(pizzaOrder.sides).toFixed(2),
      subtotal: (
        getPizzaUnitPrice(pizzaOrder) * pizzaOrder.quantity +
        getSidesTotal(pizzaOrder.sides)
      ).toFixed(2),
      deliveryFee: customerInfo.isDelivery ? "2.99" : "0.00",
      total: calculateTotalPrice(),
      orderTime: new Date().toISOString(),
      estimatedTime: customerInfo.isDelivery ? "45-60 minutes" : "20-30 minutes",
      status: "Confirmed",
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(orderData));
    setLastOrder(orderData);
    resetForm();
  };

  const handleNewOrder = () => {
    setLastOrder(null);
    resetForm();
  };

  const handleClearReceipt = () => {
    localStorage.removeItem(STORAGE_KEY);
    setLastOrder(null);
  };

  if (lastOrder) {
    const orderDate = new Date(lastOrder.orderTime);
    const receiptPizza = {
      ...lastOrder.pizza,
      quantity: lastOrder.pizza.quantity || 1,
      sides: lastOrder.pizza.sides || [],
    };

    return (
      <div className="App">
        <header>
          <h1>Mario's Pizza - Order Confirmed</h1>
          <p>Your pizza is being prepared now</p>
        </header>

        <main className="receipt-page">
          <section className="receipt-card">
            <div className="receipt-heading">
              <div>
                <p className="receipt-kicker">Receipt</p>
                <h2>Order #{lastOrder.orderNumber}</h2>
              </div>
              <span className="status-pill">{lastOrder.status}</span>
            </div>

            <div className="receipt-grid">
              <div>
                <h3>Customer</h3>
                <p>{lastOrder.customer.name}</p>
                <p>{lastOrder.customer.phone}</p>
                <p>{lastOrder.customer.email}</p>
              </div>

              <div>
                <h3>{lastOrder.customer.isDelivery ? "Delivery" : "Pickup"}</h3>
                <p>Estimated time: {lastOrder.estimatedTime}</p>
                <p>
                  {lastOrder.customer.isDelivery
                    ? lastOrder.customer.address
                    : "Mario's Pizza counter pickup"}
                </p>
              </div>
            </div>

            <div className="receipt-details">
              <h3>Order Details</h3>
              <div className="summary-item">
                <span className="item-name">
                  {receiptPizza.quantity} x {formatLabel(receiptPizza.size)} Pizza (
                  {formatLabel(receiptPizza.crust)} Crust)
                </span>
                <span className="item-price">
                  ${(getPizzaBasePrice(receiptPizza) * receiptPizza.quantity).toFixed(2)}
                </span>
              </div>
              <div className="summary-item">
                <span className="item-name">
                  Toppings: {receiptPizza.toppings.join(", ")}
                </span>
                <span className="item-price">
                  ${(receiptPizza.toppings.length * 1.5 * receiptPizza.quantity).toFixed(2)}
                </span>
              </div>
              {receiptPizza.sides.length > 0 && (
                <div className="receipt-sides">
                  <h4>Sides</h4>
                  {receiptPizza.sides.map((side) => (
                    <div className="summary-item" key={side.id}>
                      <span className="item-name">
                        {side.quantity} x {side.name}
                      </span>
                      <span className="item-price">
                        ${(side.price * side.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {receiptPizza.specialInstructions && (
                <p className="receipt-note">
                  <strong>Special Instructions:</strong>{" "}
                  {receiptPizza.specialInstructions}
                </p>
              )}
              {lastOrder.customer.isDelivery && (
                <div className="summary-item">
                  <span className="item-name">Delivery Fee</span>
                  <span className="item-price">${lastOrder.deliveryFee}</span>
                </div>
              )}
              <div className="summary-total">
                <span className="total-label">Total Paid</span>
                <span className="total-price">${lastOrder.total}</span>
              </div>
            </div>

            <p className="receipt-time">
              Ordered on {orderDate.toLocaleDateString()} at{" "}
              {orderDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <div className="receipt-actions">
              <button type="button" className="secondary-btn" onClick={handleNewOrder}>
                Place Another Order
              </button>
              <button type="button" className="clear-btn" onClick={handleClearReceipt}>
                Clear Saved Receipt
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <header>
        <h1>Mario's Pizza - Online Ordering</h1>
        <p>Authentic Brooklyn Pizza Since 1952</p>
      </header>
      <main>
        <form className="pizza-order-form" onSubmit={handleSubmit}>
          <h2>Place Your Order</h2>
          <section className="customer-info">
            <h3>Customer Info</h3>
            <div className="form-group">
              <label htmlFor="customer-name">Full Name</label>
              <input
                type="text"
                id="customer-name"
                name="name"
                value={customerInfo.name}
                onChange={(e) => {
                  setCustomerInfo({
                    ...customerInfo,
                    name: e.target.value,
                  });
                  clearError("name");
                }}
                onBlur={checkValidation}
                className={formState.currentErrors?.name ? "error" : ""}
                placeholder="Enter your full name"
                required
              />
              {formState.currentErrors.name && (
                <span className="error-message">
                  {formState.currentErrors.name}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="customer-phone">Phone Number</label>
              <input
                type="tel"
                id="customer-phone"
                name="phone"
                value={customerInfo.phone}
                onChange={(e) => {
                  setCustomerInfo({
                    ...customerInfo,
                    phone: e.target.value,
                  });
                  clearError("phone");
                }}
                onBlur={checkValidation}
                className={formState.currentErrors?.phone ? "error" : ""}
                placeholder="(555) 123-4567"
                required
              />
              {formState.currentErrors.phone && (
                <span className="error-message">
                  {formState.currentErrors.phone}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="customer-email">Email Address</label>
              <input
                type="email"
                id="customer-email"
                name="email"
                value={customerInfo.email}
                onChange={(e) => {
                  setCustomerInfo({
                    ...customerInfo,
                    email: e.target.value,
                  });
                  clearError("email");
                }}
                onBlur={checkValidation}
                className={formState.currentErrors?.email ? "error" : ""}
                placeholder="your.email@example.com"
                required
              />
              {formState.currentErrors.email && (
                <span className="error-message">
                  {formState.currentErrors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="customer-address">Delivery Address</label>
              <textarea
                id="customer-address"
                name="address"
                value={customerInfo.address}
                onChange={(e) => {
                  setCustomerInfo({
                    ...customerInfo,
                    address: e.target.value,
                  });
                  clearError("address");
                }}
                onBlur={checkValidation}
                className={formState.currentErrors?.address ? "error" : ""}
                placeholder="Enter your address..."
                rows={3}
              />
              {formState.currentErrors.address && (
                <span className="error-message">
                  {formState.currentErrors.address}
                </span>
              )}
            </div>

            <div className="form-group">
              <fieldset>
                <legend>Order Type</legend>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="orderType"
                      value="delivery"
                      checked={customerInfo.isDelivery === true}
                      onChange={() =>
                        setCustomerInfo({
                          ...customerInfo,
                          isDelivery: true,
                        })
                      }
                    />
                    Delivery (45-60 minutes)
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="orderType"
                      value="pickup"
                      checked={customerInfo.isDelivery === false}
                      onChange={() =>
                        setCustomerInfo({
                          ...customerInfo,
                          isDelivery: false,
                        })
                      }
                    />
                    Pickup
                  </label>
                </div>
              </fieldset>
            </div>
          </section>

          <section className="pizza-customization">
            <h3>Build Your Pizza</h3>
            <div className="form-group">
              <label htmlFor="pizza-size">Pizza Size</label>
              <select
                id="pizza-size"
                name="size"
                value={pizzaOrder.size}
                onChange={(e) =>
                  setPizzaOrder({
                    ...pizzaOrder,
                    size: e.target.value,
                  })
                }
              >
                <option value="small">Small 10" - $12.99</option>
                <option value="medium">Medium 12" - $15.99</option>
                <option value="large">Large 14" - $18.99</option>
                <option value="xlarge">Extra Large 16" - $21.99</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="pizza-crust">Pizza Crust</label>
              <select
                id="pizza-crust"
                name="crust"
                value={pizzaOrder.crust}
                onChange={(e) =>
                  setPizzaOrder({
                    ...pizzaOrder,
                    crust: e.target.value,
                  })
                }
              >
                <option value="regular">Regular Crust</option>
                <option value="thin">Thin Crust (+$1.00)</option>
                <option value="thick">Thick Crust (+$2.00)</option>
                <option value="stuffed">Stuffed Crust (+$3.00)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="pizza-quantity">Quantity</label>
              <input
                type="number"
                id="pizza-quantity"
                name="quantity"
                min="1"
                max="20"
                value={pizzaOrder.quantity}
                onChange={(e) => {
                  setPizzaOrder({
                    ...pizzaOrder,
                    quantity: Math.max(1, Number(e.target.value) || 1),
                  });
                  clearError("quantity");
                }}
                onBlur={checkValidation}
                className={formState.currentErrors?.quantity ? "error" : ""}
              />
              {formState.currentErrors.quantity && (
                <span className="error-message">
                  {formState.currentErrors.quantity}
                </span>
              )}
            </div>

            <div className="form-group">
              <fieldset
                className={formState.currentErrors?.toppings ? "error" : ""}
                onBlur={checkValidation}
              >
                <legend>Your Toppings (Each +$1.50)</legend>
                {formState.currentErrors.toppings && (
                  <span className="error-message">
                    {formState.currentErrors.toppings}
                  </span>
                )}
                <div className="toppings-grid">
                  {[
                    "pepperoni",
                    "sausage",
                    "mushrooms",
                    "green peppers",
                    "onions",
                    "black olives",
                    "extra cheese",
                    "bacon",
                    "ham",
                    "pineapple",
                    "jalapenos",
                    "tomatoes",
                  ].map((topping) => (
                    <label key={topping} className="topping-option">
                      <input
                        type="checkbox"
                        name="toppings"
                        value={topping}
                        checked={pizzaOrder.toppings.includes(topping)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPizzaOrder({
                              ...pizzaOrder,
                              toppings: [...pizzaOrder.toppings, topping],
                            });
                          } else {
                            setPizzaOrder({
                              ...pizzaOrder,
                              toppings: pizzaOrder.toppings.filter(
                                (t) => t !== topping,
                              ),
                            });
                          }
                          clearError("toppings");
                        }}
                      />
                      {topping.charAt(0).toUpperCase() + topping.slice(1)}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="form-group">
              <fieldset>
                <legend>Add Sides</legend>
                <div className="sides-list">
                  {sideOptions.map((side) => {
                    const selectedSide = pizzaOrder.sides.find(
                      (item) => item.id === side.id,
                    );

                    return (
                      <div className="side-option" key={side.id}>
                        <label>
                          <input
                            type="checkbox"
                            name="sides"
                            value={side.id}
                            checked={Boolean(selectedSide)}
                            onChange={(e) => updateSide(side, e.target.checked)}
                          />
                          <span>
                            {side.name} - ${side.price.toFixed(2)}
                          </span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={selectedSide?.quantity || 1}
                          disabled={!selectedSide}
                          aria-label={`${side.name} quantity`}
                          onChange={(e) =>
                            updateSideQuantity(side.id, e.target.value)
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            </div>

            <div className="form-group">
              <label htmlFor="special-instructions">
                Special Instructions (Optional)
              </label>
              <textarea
                id="special-instructions"
                name="specialInstructions"
                value={pizzaOrder.specialInstructions}
                onChange={(e) =>
                  setPizzaOrder({
                    ...pizzaOrder,
                    specialInstructions: e.target.value,
                  })
                }
                placeholder="Any special request"
                rows={3}
                maxLength={200}
              />
              <small className="character-count">
                {pizzaOrder.specialInstructions.length}/200 Characters
              </small>
            </div>
            <div className="form-group">
                <button type="button" className="clear-reset-btn" onClick={handleNewOrder}>
                  Clear/Reset
                </button>
            </div>
          </section>

          <section className="order-summary">
            <h3>Order Summary</h3>

            <div className="summary-item">
              <span className="item-name">
                {pizzaOrder.quantity} x {formatLabel(pizzaOrder.size)} Pizza (
                {formatLabel(pizzaOrder.crust)} Crust)
              </span>
              <span className="item-price">
                ${(getPizzaBasePrice(pizzaOrder) * pizzaOrder.quantity).toFixed(2)}
              </span>
            </div>

            {pizzaOrder.toppings.length > 0 && (
              <div className="summary-item">
                <span className="item-name">
                  Toppings: {pizzaOrder.toppings.join(", ")}
                </span>
                <span className="item-price">
                  ${(pizzaOrder.toppings.length * 1.5 * pizzaOrder.quantity).toFixed(2)}
                </span>
              </div>
            )}

            {pizzaOrder.sides.length > 0 && (
              <div className="summary-group">
                {pizzaOrder.sides.map((side) => (
                  <div className="summary-item" key={side.id}>
                    <span className="item-name">
                      {side.quantity} x {side.name}
                    </span>
                    <span className="item-price">
                      ${(side.price * side.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {customerInfo.isDelivery && (
              <div className="summary-item">
                <span className="item-name">Delivery Fee</span>
                <span className="item-price">$2.99</span>
              </div>
            )}

            <div className="summary-total">
              <span className="total-label">Total</span>
              <span className="total-price">${calculateTotalPrice()}</span>
            </div>

            {customerInfo.name && (
              <div className="customer-detailed">
                <p>
                  <strong>Customer:</strong> {customerInfo.name}
                </p>
                {customerInfo.phone && (
                  <p>
                    <strong>Phone:</strong> {customerInfo.phone}
                  </p>
                )}
                {customerInfo.isDelivery ? (
                  <p>
                    <strong>Delivery to:</strong>{" "}
                    {customerInfo.address || "Address needed"}
                  </p>
                ) : (
                  <p>
                    <strong>Pickup</strong> at Mario's Pizza (Est. 20-30 minutes)
                  </p>
                )}
              </div>
            )}
          </section>

          <button
            type="submit"
            className="submit-btn"
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting
              ? "Processing Order..."
              : `Place Order - $${calculateTotalPrice()}`}
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;
