import React, { useState } from "react";
import "./App.css";

function App() {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    isDelivery: false,
  });

  const [pizzaOrder, setPizzaorder] = useState({
    size: "medium",
    crust: "regular",
    toppings: [],
    specialInstructions: "",
  });

  const [formState, setFormState] = useState({
    error: {},
    isSubmitting: false,
    showOrderSummary: false,
    currentErrors: {},
  });

  const calculateTotalprice = () => {
    let total = 0;
    const sizePrices = {
      small: 12.99,
      medium: 15.99,
      large: 18.99,
      xlarge: 21.99,
    };

    total += sizePrices[pizzaOrder.size];

    const crustPrices = {
      regular: 0,
      thin: 1,
      thick: 2,
      stuffed: 3,
    };

    total += crustPrices[pizzaOrder.crust];

    total += pizzaOrder.toppings.length * 1.5;

    if (customerInfo.isDelivery) {
      total += 2.99;
    }

    return total.toFixed(2);
  };

  const validateForm = () => {
    const errors = {};

    if (!customerInfo.name.trim()) {
      errors.name = "Please enter your full name";
    } else if (customerInfo.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    const phoneRegex = /^[\d\d\-\(\)\+]{10,}$/;
    if (!customerInfo.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(customerInfo.phone.replace(/\s/g, ""))) {
      errors.phone = "Please enter a valid phone Number";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!customerInfo.email.trim()) {
      errors.email = "Email Id is required";
    } else if (!emailRegex.test(customerInfo.email)) {
      errors.email = "Please enter a valid Email Id";
    }

    if (customerInfo.isDelivery && !customerInfo.address.trim()) {
      errors.address = "Delivery address is required";
    }

    if (pizzaOrder.toppings.length === 0) {
      errors.toppings = "Please select atleast one topping";
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

  const handleSubmit = async (e) => {
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

    try {
      const orderData = {
        customer: customerInfo,
        pizza: pizzaOrder,
        total: calculateTotalprice(),
        orderTime: new Date().toISOString(),
        estimatedDelivery: customerInfo.isDelivery
          ? "45-60 minutes"
          : "20-30 Minutes",
      };
      console.log("Submitting order:", orderData);
      alert(`Order placed successfully!
          
          Order #${Math.floor(Math.random() * 10000)}
          Total: ${calculateTotalprice()}
          ${ 
            customerInfo.isDelivery
              ? `Delivery to ${customerInfo.address}`
              : "Ready for pickup at mario's Pizza"
          }
          Thank you, ${customerInfo.name}! Your delicious pizza is being prepared,
          
          `);
      setCustomerInfo({
        name: "",
        phone: "",
        email: "",
        address: "",
        isDelivery: false,
      });

      setPizzaorder({
        size: "medium",
        crust: "regular",
        toppings: [],
        specialInstructions: "",
      });
    } catch (error) {
      console.log("Order submission failed", error);
      alert(
        "Sorry, there was a problem placing your order. Please try again or Call Mario's Delivery at (555)",
      );
    } finally {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
      }));
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Mario's Pizza - Online Ordering</h1>
        <p>Authentic Brooklyn Pizza Since 1952</p>
      </header>
      <main>
        <form className="pizza-order-form" onSubmit={handleSubmit}>
          <h2>Place your order</h2>
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
                  if (formState.currentErrors.name) {
                    setFormState((prev) => ({
                      ...prev,
                      currentErrors: { ...prev.currentErrors, name: "" },
                    }));
                  }
                }}
                onBlur={checkValidation}
                className={formState.currentErrors?.name ? "error" : ""}
                placeholder="Enter yor full name"
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

                  if (formState.currentErrors.phone) {
                    setFormState((prev) => ({
                      ...prev,
                      currentErrors: { ...prev.currentErrors, phone: "" },
                    }));
                  }
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
              <label htmlFor="customer-email">Email address</label>
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
                  if (formState.currentErrors.email) {
                    setFormState((prev) => ({
                      ...prev,
                      currentErrors: { ...prev.currentErrors, email: "" },
                    }));
                  }
                }}
                onBlur={checkValidation}
                className={formState.currentErrors?.email ? "error" : ""}
                placeholder="your.eamil@eaxample.com"
                required
              />
              {formState.currentErrors.email && (
                <span className="error-message">
                  {formState.currentErrors.email}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="customer-address">Delivery address</label>
              <textarea
                id="customer-address"
                name="address"
                value={customerInfo.address}
                onChange={(e) => {
                  setCustomerInfo({
                    ...customerInfo,
                    address: e.target.value,
                  });
                  if (formState.currentErrors.address) {
                    setFormState((prev) => ({
                      ...prev,
                      currentErrors: { ...prev.currentErrors, address: "" },
                    }));
                  }
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
                    Delivery(45-60 minutes)
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
                    Pick up
                  </label>
                </div>
              </fieldset>
            </div>
          </section>

          <section className="pizza-customization">
            <h3>Build your pizza</h3>
            <div className="form-group">
              <label htmlFor="pizza-size">Pizza Size</label>
              <select
                id="pizz-size"
                name="size"
                value={pizzaOrder.size}
                onChange={(e) =>
                  setPizzaorder({
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
                  setPizzaorder({
                    ...pizzaOrder,
                    crust: e.target.value,
                  })
                }
              >
                <option value="regular">Regular Crust</option>
                <option value="thin">Thin Crust (+$1.00)</option>
                <option value="thick">Thick Crust (+$2.00)</option>
                <option value="stufffed">Stuffed Crust (+$3.00)</option>
              </select>
            </div>
            <div className="form-group">
              <fieldset className={formState.currentErrors?.toppings ? "error" : ""} onBlur={checkValidation}>
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
                    "extra chesse",
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
                            setPizzaorder({
                              ...pizzaOrder,
                              toppings: [...pizzaOrder.toppings, topping],
                            });
                          } else {
                            setPizzaorder({
                              ...pizzaOrder,
                              toppings: pizzaOrder.toppings.filter(
                                (t) => t !== topping,
                              ),
                            });
                          }
                          if (formState.currentErrors.toppings) {
                            setFormState((prev) => ({
                              ...prev,
                              currentErrors: {
                                ...prev.currentErrors,
                                toppings: [],
                              },
                            }));
                          }
                          
                        }}                        
                      />
                      {topping.charAt(0).toUpperCase() + topping.slice(1)}
                    </label>
                  ))}
                </div>
                <div className="form-group">
                  <label htmlFor="special-instructions">
                    Special Instructions(Optional)
                  </label>
                  <textarea
                    id="special-instructions"
                    name="specialInstructions"
                    value={pizzaOrder.specialInstructions}
                    onChange={(e) =>
                      setPizzaorder({
                        ...pizzaOrder,
                        specialInstructions: e.target.value,
                      })
                    }
                    placeholder="Any Special Request"
                    rows={3}
                    maxLength={200}
                  >
                    <small className="character-count">
                      {pizzaOrder.specialInstructions.length}/200 Characters
                    </small>
                  </textarea>
                </div>
              </fieldset>
            </div>
          </section>

          <section className="order-summary">
            <h3>Order Summary</h3>

            <div className="summary-item">
              <span className="item-name">
                {pizzaOrder.size.charAt(0).toUpperCase() +
                  pizzaOrder.size.slice(1)}{" "}
                Pizza ({pizzaOrder.crust} Crust)
              </span>
              <span className="item-price">
                $
                {(() => {
                  const sizePrices = {
                    small: 12.99,
                    medium: 15.99,
                    large: 18.99,
                    xlarge: 21.99,
                  };
                  const crustPrices = {
                    regular: 0,
                    thin: 1.0,
                    thick: 2.0,
                    stuffed: 3.0,
                  };
                  return (
                    sizePrices[pizzaOrder.size] + crustPrices[pizzaOrder.crust]
                  ).toFixed(2);
                })()}
              </span>

              {pizzaOrder.toppings.length > 0 && (
                <div className="summary-item">
                  <span className="item-name">
                    Toppings: {pizzaOrder.toppings.join(", ")}
                  </span>
                  <span className="item-price">
                    ${(pizzaOrder.toppings.length * 1.5).toFixed(2)}
                  </span>
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
                <span className="total-price">${calculateTotalprice()}</span>
              </div>
              {customerInfo.name && (
                <div className="customer-detailed">
                  <p>
                    <strong>Customer:</strong> {customerInfo.name}
                  </p>
                  {customerInfo.phone && (
                    <p>
                      <strong>Phone:</strong>
                      {customerInfo.phone}
                    </p>
                  )}
                  {customerInfo.isDelivery ? (
                    <p>
                      <strong>Delivery to:</strong>
                      {customerInfo.address || "Address needed"}
                    </p>
                  ) : (
                    <p>
                      <strong>Pickup</strong> at Mario's pizza(Est. 20-30
                      minutes)
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          <button
            type="submit"
            className="submit-btn"
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? (
              <>
                <span className="loading-spinner">Proccessing Order...</span>
              </>
            ) : (
              `Place Order - ${calculateTotalprice()}`
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
export default App;
