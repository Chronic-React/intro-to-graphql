import { Product } from './product.model'
import { User, roles } from '../user/user.model'
import { AuthenticationError } from 'apollo-server'
import mongoose from 'mongoose'

const productsTypeMatcher = {
  GAMING_PC: 'GamingPc',
  BIKE: 'Bike',
  DRONE: 'Drone'
}

const products = () => {
  return Product.find({}).exec()
}

const product = (_, args) => {
  return Product.findById(args.id).exec()
}

const newProduct = (_, args, ctx) => {
  return Product.create({ ...args.input, createdBy: ctx.user._id })
}

const updateProduct = (_, args) => {
  // return Product.findById(args.id).update({ ...args.input })

  // const product = Product.findById(args.id)
  // product.update({ ...args.input })
  // product.save()
  // return product

  return Product.findOneAndUpdate({ _id: args.id }, args.input, { new: true })
    .lean()
    .exec()
  // await product.save()
  // return product
}

const removeProduct = (_, args) => {
  return Product.findByIdAndRemove(args.id)
}

export default {
  // resolvers: {
  Query: {
    products,
    product
    // }
  },
  Mutation: {
    newProduct,
    updateProduct,
    removeProduct
  },
  Product: {
    // __resolveType(product) {}
    // NOTE: This resolver will be ran AFTER product resolver has ran
    // THUS: Since all queries/mutations return (ie. RESOLVE) a Product!, then out first argument will be Product type also
    createdBy(product) {
      return User.findById(product.createdBy) //.lean().exec()
    }
  }
}
