const Order = require("../../models/Order");
const Product = require("../../models/Product");
const User = require("../../models/User");
const Review = require("../../models/Review");

exports.getDashboard = async (req, res) => {
    try {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        // --- Orders & Revenue ---
        const [
            totalOrders,
            ordersToday,
            ordersThisMonth,
            revenueAgg,
            revenueTodayAgg,
            revenueThisMonthAgg,
            revenueLastMonthAgg,
            ordersByStatus,
            recentOrders
        ] = await Promise.all([
            Order.countDocuments(),
            Order.countDocuments({ createdAt: { $gte: startOfToday } }),
            Order.countDocuments({ createdAt: { $gte: startOfMonth } }),

            // All-time revenue (only paid or delivered orders)
            Order.aggregate([
                { $match: { orderStatus: { $nin: ["cancelled"] } } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } }
            ]),

            // Revenue today
            Order.aggregate([
                { $match: { createdAt: { $gte: startOfToday }, orderStatus: { $nin: ["cancelled"] } } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } }
            ]),

            // Revenue this month
            Order.aggregate([
                { $match: { createdAt: { $gte: startOfMonth }, orderStatus: { $nin: ["cancelled"] } } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } }
            ]),

            // Revenue last month (for growth comparison)
            Order.aggregate([
                { $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }, orderStatus: { $nin: ["cancelled"] } } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } }
            ]),

            // Orders grouped by status
            Order.aggregate([
                { $group: { _id: "$orderStatus", count: { $sum: 1 } } }
            ]),

            // 5 most recent orders
            Order.find().sort({ createdAt: -1 }).limit(5).select("orderId customer.name totalAmount orderStatus createdAt")
        ]);

        // --- Products ---
        const [totalProducts, lowStockProducts, outOfStockProducts] = await Promise.all([
            Product.countDocuments({ isActive: true }),

            // Products with any size having stock < 10
            Product.find({ "sizes.stock": { $gt: 0, $lt: 10 }, isActive: true })
                .select("name sizes")
                .limit(10),

            // Products with all sizes at stock = 0
            Product.countDocuments({
                isActive: true,
                $expr: { $allElementsTrue: { $map: { input: "$sizes", as: "s", in: { $eq: ["$$s.stock", 0] } } } }
            })
        ]);

        // --- Users ---
        const [totalUsers, newUsersToday, newUsersThisMonth] = await Promise.all([
            User.countDocuments({ isAdmin: false }),
            User.countDocuments({ isAdmin: false, createdAt: { $gte: startOfToday } }),
            User.countDocuments({ isAdmin: false, createdAt: { $gte: startOfMonth } })
        ]);

        // --- Reviews ---
        const totalReviews = await Review.countDocuments();

        // --- Build revenue growth % ---
        const revenueThisMonthVal = revenueThisMonthAgg[0]?.total || 0;
        const revenueLastMonthVal = revenueLastMonthAgg[0]?.total || 0;
        const revenueGrowth = revenueLastMonthVal === 0
            ? 100
            : Math.round(((revenueThisMonthVal - revenueLastMonthVal) / revenueLastMonthVal) * 100);

        // --- Build order status map ---
        const statusMap = {};
        ordersByStatus.forEach(s => { statusMap[s._id] = s.count; });

        res.json({
            status: true,
            message: "Dashboard data fetched successfully",
            data: {
                revenue: {
                    allTime:    revenueAgg[0]?.total || 0,
                    today:      revenueTodayAgg[0]?.total || 0,
                    thisMonth:  revenueThisMonthVal,
                    lastMonth:  revenueLastMonthVal,
                    growthPercent: revenueGrowth
                },
                orders: {
                    total:      totalOrders,
                    today:      ordersToday,
                    thisMonth:  ordersThisMonth,
                    byStatus:   statusMap,
                    recent:     recentOrders
                },
                products: {
                    totalActive:    totalProducts,
                    outOfStock:     outOfStockProducts,
                    lowStock:       lowStockProducts
                },
                users: {
                    total:          totalUsers,
                    newToday:       newUsersToday,
                    newThisMonth:   newUsersThisMonth
                },
                reviews: {
                    total: totalReviews
                }
            }
        });

    } catch (error) {
        res.status(500).json({ status: false, message: error.message, data: null });
    }
};
