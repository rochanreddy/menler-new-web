import mongoose from 'mongoose';

// A payment order created for a paid program (Kickstarter / Generalist).
// `order_id` is OUR id (also sent to Cashfree as its order_id). Status is
// authoritative only after a verified webhook or a Get-Order status check.
const orderSchema = new mongoose.Schema(
  {
    order_id: { type: String, required: true, unique: true, index: true },
    program: { type: String, default: '' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: { type: String, default: 'CREATED', index: true }, // CREATED | PAID | FAILED | EXPIRED
    cf_payment_session_id: { type: String, default: '' },
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', default: null },
    customer_name: { type: String, default: '' },
    customer_email: { type: String, default: '' },
    customer_phone: { type: String, default: '' },
    paid_at: { type: Date, default: null },
    extra: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
