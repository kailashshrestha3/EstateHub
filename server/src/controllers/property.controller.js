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

export const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find({
            status: "approved"
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Properties fetched successfully",
            count: properties.length,
            properties
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch properties",
            error: error.message
        });
    }
};

export const getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;

        const property = await Property.findOne({
            _id: id,
            status: "approved"
        });

        if (!property) {
            return res.status(404).json({
                message: "Property not found"
            });
        }

        return res.status(200).json({
            message: "Property fetched successfully",
            property
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch property",
            error: error.message
        });
    }
};

export const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;

        const property = await Property.findOne({
            _id: id,
            seller: req.user.id
        });

        if (!property) {
            return res.status(404).json({
                message: "Property not found"
            });
        }

        Object.assign(property, req.body);

        await property.save();

        return res.status(200).json({
            message: "Property updated successfully",
            property
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update property",
            error: error.message
        });
    }
};

export const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;

        const property = await Property.findOneAndDelete({
            _id: id,
            seller: req.user.id
        });

        if (!property) {
            return res.status(404).json({
                message: "Property not found"
            });
        }

        return res.status(200).json({
            message: "Property deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete property",
            error: error.message
        });
    }
};

export const approveProperty = async (req, res) => {
    try {
        const { id } = req.params;

        const property = await Property.findByIdAndUpdate(
            id,
            { status: "approved" },
            { new: true, runValidators: true }
        );


        if (!property) {
            return res.status(404).json({
                message: "Property not found"
            });
        }

        return res.status(200).json({
            message: "Property approved successfully",
            property
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to approve property",
            error: error.message
        });
    }
};

export const rejectProperty = async (req, res) => {
    try {
        const { id } = req.params;

        const property = await Property.findByIdAndUpdate(
            id,
            { status: "rejected" },
            { new: true, runValidators: true }
        );

        if (!property) {
            return res.status(404).json({
                message: "Property not found"
            });
        }

        return res.status(200).json({
            message: "Property rejected successfully",
            property
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to reject property",
            error: error.message
        });
    }
};

export const getPendingProperties = async (req, res) => {
    try {
        const properties = await Property.find({
            status: "pending"
        })
            .populate("seller", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Pending properties fetched successfully",
            count: properties.length,
            properties
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch pending properties",
            error: error.message
        });
    }
};

