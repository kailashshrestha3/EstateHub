import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        propertyType: {
            type: String,
            enum: ["house", "apartment", "land"],
            required: true
        },

        bedrooms: {
            type: Number,
            default: 0,
            min: 0
        },

        bathrooms: {
            type: Number,
            default: 0,
            min: 0
        },

        images: {
            type: [String],
            default: []
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        }
    },
    { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;