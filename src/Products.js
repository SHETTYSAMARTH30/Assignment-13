import React, { Component } from 'react'
import Filters from './Filters'
import ProductTable from './ProductTable'
import ProductForm from './ProductForm'

let PRODUCTS = [];



class Products extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filterText: '',
			products: PRODUCTS,
			currProduct: null
        }
        this.handleFilter = this.handleFilter.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handleDestroy = this.handleDestroy.bind(this)
        this.handleSave = this.handleSave.bind(this)
	}
	
	componentDidMount() { this.getProducts() }

	getProducts() {
		fetch( "/products/get")
		.then((res) => res.json())
		.then((res) => {
			if (res.success === 0) 
			return alert(res.message);
			this.setState({ products: res.data })
		})
	}

    handleFilter(filterInput) {
        this.setState(filterInput)
    }

    handleSave(product) {
		if (product.productid != null) {
			

			fetch("/products/update/" + product.productid, {
				body: JSON.stringify(product),
				method: "POST",
				headers: {'Content-Type': 'application/json'}
			})
			.then(res => res.json())
			.then((res) => {
				if(res.success === 0) 
				return alert(res.message);
				this.getProducts();
			})
			.catch(err => console.error(err))
		} else {
			

			fetch("/products/create", {
				body: JSON.stringify(product),
				method: "POST",
				headers: {'Content-Type': 'application/json'}
			})
			.then(res => res.json())
			.then((res) => {
				if(res.success === 0) 
				return alert(res.message);
				this.getProducts();
			})
			.catch(err => console.error(err))
		}
    }

	handleEdit(productId) {
		let currProduct = this.state.products.find(p => p.id === productId);
		this.setState({
			currProduct: currProduct
		})
	}

    handleDestroy(productId) {
		fetch("/products/delete/" + productId)
		.then((res) => res.json())
		.then((res) => {
			if (res.success === 0) 
			return alert(res.message);
			this.getProducts();
		})
    }

    render () {
        return (
            <div>
                <h1>My Inventory</h1>
                <Filters 
                    onFilter={this.handleFilter}></Filters>
				<ProductTable 
					filterText={this.state.filterText}
                    products={this.state.products}
					onDestroy={this.handleDestroy}
                    onEdit={this.handleEdit}
                   ></ProductTable>
                <ProductForm
					key={JSON.stringify(this.state.currProduct)}
					onSave={this.handleSave}
					product={this.state.currProduct}></ProductForm>
            </div>
        )
    }
}

export default Products