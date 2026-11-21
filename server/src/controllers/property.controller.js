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
        const {
            location,
            propertyType,
            minPrice,
            maxPrice,
            bedrooms
        } = req.query;

        const filter = {
            status: "approved"
        }

        if (location) {
            filter.location = {
                $regex: location,
                $options: "i"
            };
        }
        if (propertyType) {
            filter.propertyType = propertyType;
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};

            if (minPrice !== undefined) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice !== undefined) {
                filter.price.$lte = Number(maxPrice);
            }

            if (minPrice !== undefined && (!Number.isFinite(Number(minPrice)) || Number(minPrice) < 0)
            ) {
                return res.status(400).json({
                    message: "Minimum price must be a valid non-negative number"
                });
            }

            if (maxPrice !== undefined && (!Number.isFinite(Number(maxPrice)) || Number(maxPrice) < 0)
            ) {
                return res.status(400).json({
                    message: "Maximum price must be a valid non-negative number"
                });
            }
            if (
                minPrice !== undefined &&
                maxPrice !== undefined &&
                Number(minPrice) > Number(maxPrice)
            ) {
                return res.status(400).json({
                    message: "Minimum price cannot be greater than maximum price"
                });
            }
        }

        if (bedrooms !== undefined) {
            filter.bedrooms = Number(bedrooms);
        }

        // Handle pagination: fetch the requested page and calculate the total pages.
        const pageQuery = Number(req.query.page);
        const limitQuery = Number(req.query.limit);

        const page = Number.isInteger(pageQuery) && pageQuery > 0
            ? pageQuery
            : 1;

        const limit = Number.isInteger(limitQuery) && limitQuery > 0
            ? Math.min(limitQuery, 50)
            : 10;

        const skip = (page - 1) * limit;
        const sort = req.query.sort;

        let sortOption = { createdAt: -1 };

        if (sort === "price_asc") {
            sortOption = { price: 1 };
        } else if (sort === "price_desc") {
            sortOption = { price: -1 };
        }

        const properties = await Property.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        const totalProperties = await Property.countDocuments(filter);
        const totalPages = Math.ceil(totalProperties / limit);


        return res.status(200).json({
            message: "Properties fetched successfully",
            count: properties.length,
            success: true,
            currentPage: page,
            totalPages,
            totalProperties,
            properties,
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
            .populate("seller", "username email")
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

export const getAllPropertiesForAdmin = async (req, res) => {
    try {
        const properties = await Property.find()
            .populate("seller", "username email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "All properties fetched successfully",
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

// export const getMyProperties = async (req, res) => {
//     try {
//         const properties = await Property.find({ seller: req.user.id })
//             .populate("seller", "username email")
//             .sort({ createdAt: -1 });

//         return res.status(200).json({
//             message: "My properties fetched successfully",
//             count: properties.length,
//             properties
//         });
//     } catch (error) {
//         return res.status(500).json({
//             message: "Failed to fetch my properties",
//             error: error.message
//         });
//     }
// };