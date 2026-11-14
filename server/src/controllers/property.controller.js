import Property from "../models/property.model.js";

export const createProperty = async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            location,
            propertyType,
            bedrooms,
            bathrooms,
            images
        } = req.body;

        const property = await Property.create({
            title,
            description,
            price,
            location,
            propertyType,
            bedrooms,
            bathrooms,
            images,
            seller: req.user.id
        });

        return res.status(201).json({
            message: "Property created successfully",
            property
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create property",
            error: error.message
        });
    }
};