"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ShoppingCart,
  DollarSign,
  CreditCard,
  Save,
  User,
} from "lucide-react";

import apiRequest from "@/lib/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const initialForm = {
  customer: "",
  discount: "",
  tax: "",
  paymentMethod: "cash",
  paymentStatus: "paid",
  saleDate: new Date()
    .toISOString()
    .split("T")[0],
  notes: "",
};

export default function NewSalePage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [form, setForm] = useState(initialForm);

  const [items, setItems] = useState([]);

  const [selectedProduct, setSelectedProduct] =
    useState("");

  const [quantity, setQuantity] = useState(1);

  const [loadingProducts, setLoadingProducts] =
    useState(true);

  const [loadingCustomers, setLoadingCustomers] =
    useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [errors, setErrors] = useState({});

  /*
   * Load products and customers
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingProducts(true);
        setLoadingCustomers(true);
        setError("");

        const [
          productsResponse,
          customersResponse,
        ] = await Promise.all([
          apiRequest(
            "/products?page=1&limit=100&status=active"
          ),

          apiRequest(
            "/customers?page=1&limit=100&status=active"
          ),
        ]);

        setProducts(
          productsResponse.data?.products || []
        );

        setCustomers(
          customersResponse.data?.customers || []
        );
      } catch (error) {
        setError(
          error.message ||
            "Unable to load products and customers."
        );
      } finally {
        setLoadingProducts(false);
        setLoadingCustomers(false);
      }
    };

    fetchData();
  }, []);

  /*
   * Subtotal
   */
  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + item.subtotal,
      0
    );
  }, [items]);

  const discount = Number(
    form.discount || 0
  );

  const tax = Number(
    form.tax || 0
  );

  const total = Math.max(
    subtotal - discount + tax,
    0
  );

  /*
   * Form change
   */
  const handleFormChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  /*
   * Add product
   */
  const handleAddItem = () => {
    setError("");

    if (!selectedProduct) {
      setError(
        "Please select a product."
      );
      return;
    }

    const product = products.find(
      (item) =>
        item._id === selectedProduct
    );

    if (!product) {
      setError("Product not found.");
      return;
    }

    const requestedQuantity =
      Number(quantity);

    if (
      !Number.isInteger(
        requestedQuantity
      ) ||
      requestedQuantity <= 0
    ) {
      setError(
        "Quantity must be a positive whole number."
      );
      return;
    }

    const existingItem = items.find(
      (item) =>
        item.product === product._id
    );

    const existingQuantity =
      existingItem?.quantity || 0;

    const finalQuantity =
      existingQuantity +
      requestedQuantity;

    if (
      finalQuantity >
      product.stockQuantity
    ) {
      setError(
        `Only ${product.stockQuantity} ${
          product.unit || "pcs"
        } available for ${product.name}.`
      );
      return;
    }

    if (existingItem) {
      setItems((previous) =>
        previous.map((item) => {
          if (
            item.product !==
            product._id
          ) {
            return item;
          }

          const newQuantity =
            item.quantity +
            requestedQuantity;

          return {
            ...item,
            quantity: newQuantity,
            subtotal:
              newQuantity *
              item.unitPrice,
          };
        })
      );
    } else {
      setItems((previous) => [
        ...previous,
        {
          product: product._id,
          productName: product.name,
          productCode:
            product.productCode,
          unit:
            product.unit || "pcs",
          quantity:
            requestedQuantity,
          unitPrice:
            Number(
              product.sellingPrice || 0
            ),
          subtotal:
            requestedQuantity *
            Number(
              product.sellingPrice || 0
            ),
          availableStock:
            product.stockQuantity,
        },
      ]);
    }

    setSelectedProduct("");
    setQuantity(1);
  };

  /*
   * Quantity change
   */
  const handleQuantityChange = (
    productId,
    value
  ) => {
    const newQuantity =
      Number(value);

    const product = products.find(
      (item) =>
        item._id === productId
    );

    if (!product) return;

    if (
      !Number.isInteger(
        newQuantity
      ) ||
      newQuantity < 1
    ) {
      return;
    }

    if (
      newQuantity >
      product.stockQuantity
    ) {
      setError(
        `Only ${product.stockQuantity} ${
          product.unit || "pcs"
        } available for ${product.name}.`
      );
      return;
    }

    setError("");

    setItems((previous) =>
      previous.map((item) =>
        item.product === productId
          ? {
              ...item,
              quantity:
                newQuantity,
              subtotal:
                newQuantity *
                item.unitPrice,
            }
          : item
      )
    );
  };

  /*
   * Remove item
   */
  const handleRemoveItem = (
    productId
  ) => {
    setItems((previous) =>
      previous.filter(
        (item) =>
          item.product !== productId
      )
    );
  };

  /*
   * Validation
   */
  const validate = () => {
    const newErrors = {};

    if (items.length === 0) {
      newErrors.items =
        "Add at least one product.";
    }

    if (
      discount < 0 ||
      Number.isNaN(discount)
    ) {
      newErrors.discount =
        "Enter a valid discount.";
    }

    if (
      tax < 0 ||
      Number.isNaN(tax)
    ) {
      newErrors.tax =
        "Enter a valid tax.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  /*
   * Create sale
   */
  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    if (!validate()) {
      return;
    }

    setSaving(true);

    try {
      const payload = {
        invoiceNumber:
          generateInvoiceNumber(),

        customer:
          form.customer || null,

        items: items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),

        discount,

        tax,

        paymentMethod:
          form.paymentMethod,

        paymentStatus:
          form.paymentStatus,

        status: "completed",

        saleDate:
          form.saleDate,

        notes:
          form.notes.trim(),
      };

      const response =
        await apiRequest(
          "/sales",
          {
            method: "POST",
            body: JSON.stringify(
              payload
            ),
          }
        );

      const saleId =
        response.data?._id;

      if (saleId) {
        router.push(
          `/sales/${saleId}`
        );
      } else {
        router.push("/sales");
      }

      router.refresh();
    } catch (error) {
      setError(
        error.message ||
          "Unable to create sale."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * Loading
   */
  if (
    loadingProducts ||
    loadingCustomers
  ) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-3">
          <Link
            href="/sales"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
          >
            <ArrowLeft size={17} />
          </Link>

          <div>
            <p className="text-sm font-medium text-slate-400">
              Transactions
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              New Sale
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create a new sales transaction.
            </p>
          </div>
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Products */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={ShoppingCart}
            title="Sale Items"
            description="Select products and quantities for this sale."
          />

          {/* Add Product */}

          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <div className="grid gap-3 md:grid-cols-[1fr_150px_auto]">
              <div>
                <label
                  htmlFor="product"
                  className="mb-1.5 block text-xs font-medium text-slate-600"
                >
                  Product
                </label>

                <select
                  id="product"
                  value={
                    selectedProduct
                  }
                  onChange={(event) =>
                    setSelectedProduct(
                      event.target.value
                    )
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                >
                  <option value="">
                    Select product
                  </option>

                  {products.map(
                    (product) => (
                      <option
                        key={
                          product._id
                        }
                        value={
                          product._id
                        }
                      >
                        {product.name} —{" "}
                        {
                          product.productCode
                        }{" "}
                        — ৳
                        {Number(
                          product.sellingPrice ||
                            0
                        ).toLocaleString()}{" "}
                        — Stock:{" "}
                        {
                          product.stockQuantity
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="quantity"
                  className="mb-1.5 block text-xs font-medium text-slate-600"
                >
                  Quantity
                </label>

                <input
                  id="quantity"
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(
                      event.target.value
                    )
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={
                    handleAddItem
                  }
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 md:w-auto"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
            </div>
          </div>

          {errors.items && (
            <p className="mt-3 text-xs text-red-500">
              {errors.items}
            </p>
          )}

          {/* Items */}

          {items.length > 0 && (
            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
              {/* Desktop */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Product
                      </th>

                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Price
                      </th>

                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Quantity
                      </th>

                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Subtotal
                      </th>

                      <th className="w-12 px-3 py-3" />
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {items.map(
                      (item) => (
                        <tr
                          key={
                            item.product
                          }
                        >
                          <td className="px-4 py-4">
                            <p className="text-sm font-medium text-slate-700">
                              {
                                item.productName
                              }
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {
                                item.productCode
                              }
                            </p>
                          </td>

                          <td className="px-4 py-4 text-right text-sm text-slate-600">
                            ৳
                            {Number(
                              item.unitPrice
                            ).toLocaleString()}
                          </td>

                          <td className="px-4 py-4">
                            <input
                              type="number"
                              min="1"
                              max={
                                products.find(
                                  (
                                    product
                                  ) =>
                                    product._id ===
                                    item.product
                                )
                                  ?.stockQuantity ||
                                item.quantity
                              }
                              value={
                                item.quantity
                              }
                              onChange={(
                                event
                              ) =>
                                handleQuantityChange(
                                  item.product,
                                  event
                                    .target
                                    .value
                                )
                              }
                              className="mx-auto h-9 w-20 rounded-lg border border-slate-200 px-2 text-center text-sm text-slate-700 outline-none focus:border-slate-300"
                            />
                          </td>

                          <td className="px-4 py-4 text-right text-sm font-semibold text-slate-800">
                            ৳
                            {Number(
                              item.subtotal
                            ).toLocaleString()}
                          </td>

                          <td className="px-3 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveItem(
                                  item.product
                                )
                              }
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2
                                size={16}
                              />
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}

              <div className="divide-y divide-slate-100 md:hidden">
                {items.map(
                  (item) => (
                    <div
                      key={
                        item.product
                      }
                      className="p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            {
                              item.productName
                            }
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {
                              item.productCode
                            }
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveItem(
                              item.product
                            )
                          }
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2
                            size={16}
                          />
                        </button>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs text-slate-400">
                            Price
                          </p>

                          <p className="mt-1 text-sm font-medium text-slate-700">
                            ৳
                            {Number(
                              item.unitPrice
                            ).toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Quantity
                          </p>

                          <input
                            type="number"
                            min="1"
                            value={
                              item.quantity
                            }
                            onChange={(
                              event
                            ) =>
                              handleQuantityChange(
                                item.product,
                                event
                                  .target
                                  .value
                              )
                            }
                            className="mt-1 h-8 w-full rounded-lg border border-slate-200 px-2 text-sm"
                          />
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Subtotal
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            ৳
                            {Number(
                              item.subtotal
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Payment */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeader
              icon={CreditCard}
              title="Payment"
              description="Payment and transaction information."
            />

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {/* Customer */}

              <div>
                <label
                  htmlFor="customer"
                  className="mb-1.5 block text-xs font-medium text-slate-600"
                >
                  Customer
                </label>

                <div className="relative">
                  <User
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    id="customer"
                    name="customer"
                    value={
                      form.customer
                    }
                    onChange={
                      handleFormChange
                    }
                    className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-100"
                  >
                    <option value="">
                      Walk-in Customer
                    </option>

                    {customers.map(
                      (customer) => (
                        <option
                          key={
                            customer._id
                          }
                          value={
                            customer._id
                          }
                        >
                          {customer.name}{" "}
                          —{" "}
                          {
                            customer.phone
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {/* Sale Date */}

              <InputField
                label="Sale Date"
                name="saleDate"
                type="date"
                value={
                  form.saleDate
                }
                onChange={
                  handleFormChange
                }
              />

              {/* Payment Method */}

              <SelectField
                label="Payment Method"
                name="paymentMethod"
                value={
                  form.paymentMethod
                }
                onChange={
                  handleFormChange
                }
              >
                <option value="cash">
                  Cash
                </option>

                <option value="card">
                  Card
                </option>

                <option value="mobile_banking">
                  Mobile Banking
                </option>

                <option value="bank_transfer">
                  Bank Transfer
                </option>
              </SelectField>

              {/* Payment Status */}

              <SelectField
                label="Payment Status"
                name="paymentStatus"
                value={
                  form.paymentStatus
                }
                onChange={
                  handleFormChange
                }
              >
                <option value="paid">
                  Paid
                </option>

                <option value="partial">
                  Partial
                </option>

                <option value="unpaid">
                  Unpaid
                </option>
              </SelectField>
            </div>

            {/* Notes */}

            <div className="mt-5">
              <label
                htmlFor="notes"
                className="mb-1.5 block text-xs font-medium text-slate-600"
              >
                Notes
              </label>

              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={
                  handleFormChange
                }
                rows={4}
                placeholder="Add notes..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-100"
              />
            </div>
          </section>

          {/* Summary */}

          <section className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeader
              icon={DollarSign}
              title="Summary"
              description="Review the sale total."
            />

            <div className="mt-6 space-y-4">
              <SummaryRow
                label="Subtotal"
                value={subtotal}
              />

              {/* Discount */}

              <div>
                <label
                  htmlFor="discount"
                  className="mb-1.5 block text-xs font-medium text-slate-500"
                >
                  Discount
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    ৳
                  </span>

                  <input
                    id="discount"
                    name="discount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      form.discount
                    }
                    onChange={
                      handleFormChange
                    }
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-sm text-slate-700 outline-none focus:border-slate-300 focus:bg-white"
                  />
                </div>

                {errors.discount && (
                  <p className="mt-1 text-xs text-red-500">
                    {
                      errors.discount
                    }
                  </p>
                )}
              </div>

              {/* Tax */}

              <div>
                <label
                  htmlFor="tax"
                  className="mb-1.5 block text-xs font-medium text-slate-500"
                >
                  Tax
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    ৳
                  </span>

                  <input
                    id="tax"
                    name="tax"
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      form.tax
                    }
                    onChange={
                      handleFormChange
                    }
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-sm text-slate-700 outline-none focus:border-slate-300 focus:bg-white"
                  />
                </div>

                {errors.tax && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.tax}
                  </p>
                )}
              </div>

              {/* Total */}

              <div className="border-t border-slate-100 pt-4">
                <SummaryRow
                  label="Total"
                  value={total}
                  strong
                />
              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={
                  saving ||
                  items.length === 0
                }
                className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={16} />

                {saving
                  ? "Creating Sale..."
                  : "Create Sale"}
              </button>

              <Link
                href="/sales"
                className="flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </Link>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}

/*
 * Section Header
 */
function SectionHeader({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
        <Icon
          size={17}
          className="text-slate-600"
        />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

/*
 * Input Field
 */
function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-medium text-slate-600"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-100"
      />
    </div>
  );
}

/*
 * Select Field
 */
function SelectField({
  label,
  name,
  value,
  onChange,
  children,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-medium text-slate-600"
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-100"
      >
        {children}
      </select>
    </div>
  );
}

/*
 * Summary Row
 */
function SummaryRow({
  label,
  value,
  strong = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={
          strong
            ? "text-sm font-semibold text-slate-800"
            : "text-sm text-slate-500"
        }
      >
        {label}
      </span>

      <span
        className={
          strong
            ? "text-xl font-bold text-slate-900"
            : "text-sm font-medium text-slate-700"
        }
      >
        ৳
        {Number(
          value || 0
        ).toLocaleString()}
      </span>
    </div>
  );
}

/*
 * Invoice Number
 */
function generateInvoiceNumber() {
  const timestamp =
    Date.now().toString();

  const random =
    Math.floor(
      Math.random() * 1000
    )
      .toString()
      .padStart(3, "0");

  return `INV-${timestamp}-${random}`;
}