const Order = require('../models/Order');

// @desc    Fetch all orders
// @route   GET /api/orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({});
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server err', error: error.message });
    }
};

// @desc    Create an order
// @route   POST /api/orders
const createOrder = async (req, res) => {
    try {
        const { buyerId, farmerId, productName, amount } = req.body;

        const order = new Order({
            buyerId,
            farmerId,
            productName,
            amount
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server err', error: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
const updateOrder = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            if (status) order.status = status;

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server err', error: error.message });
    }
};

module.exports = {
    getOrders,
    createOrder,
    updateOrder
};
