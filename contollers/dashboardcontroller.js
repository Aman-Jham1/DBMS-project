const db = require("../config/db");


module.exports = {
	dashboard: async function (req, res) {
		try {
			const { email, name, eid, contact, salary, designation } = req.user;
			const [employees] = await db.promise().query("SELECT * FROM employees");
			const [orders] = await db.promise().query("SELECT * FROM orders");
			const [recentOrders] = await db.promise().query("Select * from orders where (select current_time()) -time_ordered < 020000 and date=(select current_date()) and time_delivered is NULL;");
			const [totalSalesToday] = await db.promise().query("select sum(ordered_dishes.quantity * dish.price) as todaySales from ordered_dishes,orders,dish where dish.dish_id = ordered_dishes.dish_id and orders.ord_id = ordered_dishes.ord_id and orders.date = (select curdate());");
			const [orderstoday] = await db.promise().query("select * from orders as orders_current  where date=current_date()");
			const [openOrder] = await db.promise().query("select * from orders as open_orders  where time_delivered is NULL");
			const [orderCost] = await db.promise().query("select ordered_dishes.ord_id,sum(ordered_dishes.quantity * dish.price) as ordercost from ordered_dishes,orders,dish where  dish.dish_id = ordered_dishes.dish_id and orders.ord_id = ordered_dishes.ord_id group by ord_id;");
			
			console.log(totalSalesToday);


			res.render("dashboard_1", { employees, orders, recentOrders, totalSalesToday, orderstoday,name,openOrder ,orderCost});

			console.log(JSON.stringify(totalSalesToday));

		} catch (error) {
			console.log(error);
		}


	},

	customers: function (req, res) {
		try {
			const { email, name, eid, contact, salary, designation } = req.user;
			db.query("SELECT * FROM customer", (err, result) => {
				console.log(result);
				res.render("customers", { customers: result,name });
			});
		} catch (error) {
			console.log(error);
		}
	},

	profile: function (req, res) {
		try {
			console.log(req.user);
			const { email, name, eid, contact, salary, designation } = req.user;
			// db.query("SELECT * FROM employees", (err, result) => {
			// 	// console.log(result);
			// });
			res.render("profile_new", { email, name, eid, contact, salary, designation });
		} catch (error) {
			console.log(error);
		}
	},

	orders: async function (req, res) {
		try {
            const [orders] = await db.promise().query("Select ord_id,customer.name,date, time_ordered, time_delivered from orders, customer where customer.cid = orders.cid_id;");
			const [orderdishes] = await db.promise().query("select ordered_dishes.ord_id,dish.name,quantity from dish, orders, ordered_dishes where ordered_dishes.dish_id = dish.dish_id and ordered_dishes.ord_id = orders.ord_id;");
			const [orderCost] = await db.promise().query("select ordered_dishes.ord_id,sum(ordered_dishes.quantity * dish.price) as cost from ordered_dishes,orders,dish where  dish.dish_id = ordered_dishes.dish_id and orders.ord_id = ordered_dishes.ord_id group by ord_id;");
			console.log(orders);

			const { email, name, eid, contact, salary, designation } = req.user;


			res.render("orders", { orders, orderdishes,name, orderCost});


			// console.log(JSON.stringify(totalSalesToday));
		} catch (error) {
			console.log(error);
		}
	},
	staff_management: function (req, res) {
		try {
			const { email, name, eid, contact, salary, designation } = req.user;

			db.query("SELECT * FROM employees", (err, result) => {
				if (err) {
					res.render("staff_management", { error: err });
				}
				res.render("staff_management", { staff: result ,name});
			});
		} catch (error) {
			console.log(error);
		}
	},
	newOrder: async function (req, res) {
		try {

			const [customers] = await db.promise().query("SELECT * FROM customer");
			const [dishes] = await db.promise().query("SELECT * FROM dish");

			console.log(dishes, customers);

			res.render("newOrder", { dishes, customers });
		} catch (error) {
			console.log(error);
		}

	},

	reports: async function (req, res) {
		try {
			const { email, name, eid, contact, salary, designation } = req.user;
			// const [report] = await db.promise().query("select sum(ordered_dishes.quantity * dish.price) as todaySales, date as d from ordered_dishes,orders,dish where dish.dish_id = ordered_dishes.dish_id and orders.ord_id = ordered_dishes.ord_id and orders.date = (select curdate());");

			// console.log(report);
			const report = null;


			res.render("reports", { report ,name});



		} catch (error) {
			console.log(error);
		}


	}



};



