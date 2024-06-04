const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    businessName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    paymentType: { type: String, enum: ['','cash', 'stripe', 'bank_transfer'], default: '' },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;