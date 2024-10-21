import mongoose from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = "products"

const productSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    code: {type: Number, required: true},
    price: {type: Number, required: true},
    stock: {type: Number, required: true},
    status: {type: Boolean, required: true},
    category: {type: String, required: true}
})

productSchema.plugin(mongoosePaginate) 
const productsModel = mongoose.model(productCollection, productSchema)

export default productsModel 