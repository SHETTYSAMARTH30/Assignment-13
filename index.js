const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");


const port = 3000;
app.use(express.static(__dirname + "/build"));
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://Samarth:Samarth*30@cluster0-yfew6.mongodb.net/test?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useUnifiedTopology: true
}, (err) => {
	if (err) return console.error(err);
	console.log('Connected successfully');
})


const Product = mongoose.model("products", {
	"id": Number,
	"product": {
		"productid": Number,
		"category": String,
		"price": Number,
		"name": String,
		"instock": Boolean
	}
})



app.get("/products/get", (req, res) => {
	Product.find({}, (err, products) => {
		if (err) {
			console.error(err);
			return res.send({
				success: 0,
				message: err
			})
		}
		res.send({
			success: 1,
			data: products
		});
	})
})

app.post("/products/create", (req, res) => {
	const { body } = req;

	Product.find({}, { id: 1 })
	.sort({"id": -1})
	.limit(1)
	.then((maxProduct) => {
		
		const id=(maxProduct[0])?maxProduct[0].id+1:0;
		
		const newProduct = new Product({
			id: id,
			product: {
				productid: id,
				category: body.category,
				price: body.price,
				name: body.name,
				instock: body.instock
			}
		})

		newProduct.save().then((product) => {
			res.send({
				success: 1,
				data: product
			});
		}).catch((err) => {
			console.error(err);
			return res.send({
				success: 0,
				message: err
			})
		})

	}).catch((err) => {
		console.error(err);
		return res.send({
			success: 0,
			message: err
		})
	})
})

app.post("/products/update/:id", (req, res) => {
	Product.updateOne({id: req.params.id}, { product: req.body })
	.then((updateRes) => {
		
		res.send({
			success: 1,
			message: "Successfully Updated the products!!"
		});
	})
	.catch((err) => {
		console.error(err);
		return res.send({
			success: 0,
			message: err
		})
	})
})

app.get("/products/delete/:id", (req, res) => {
	Product.deleteOne({id: req.params.id})
	.then((deleteRes) => {
		res.send({
			success: 1,
			message: "Successfully Deleted the products!!"
		})
	})
	.catch((err) => {
		console.error(err);
		return res.send({
			success: 0,
			message: err
		})
	})
})



app.listen(port, () => {
	console.log('Listening on port', port, "\nOpen http://localhost:" + port, "in the browser");
})