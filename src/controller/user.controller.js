const bcrypt = require("bcrypt");
const { prisma } = require("../config/Database");
const { generateAccessToken } = require("../middleware/auth.middleware");
const config = require("../config/config");
const { activationEmail } = require("../services/mail");


const user = async (req, res) => {
    const { user: decodedToken } = req;
    const userId = decodedToken.id;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized. User ID not provided." });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
        if (!user) {
            return res.status(404).json({ message: "Logged-in user not found." });
        }

        return res.status(200).json({ message: "Logged-in user fetched successfully.", user });
    } catch (error) {
        console.error("Error in getLoggedInUser:", error);
        return res.status(500).json({ message: "Error fetching logged-in user.", error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const { user: decodedToken } = req;
        let users;

        if (decodedToken.role === "ADMIN") {
            users = await prisma.user.findMany({ where: { role: "USER" } });
        } else if (decodedToken.role === "DHOBI") {

        } else {
            return res.status(403).json({ message: "Access denied." });
        }

        return res.status(200).json({ message: `All Users fetched successfully.`, users });
    } catch (error) {
        console.error("Error in getAll:", error);
        return res.status(500).json({ message: "Error fetching users.", error: error.message });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({ where: { id: Number(id), role: 'USER' } });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({ message: "User fetched successfully.", user });
    } catch (error) {
        console.error("Error in getUserById:", error);
        return res.status(500).json({ message: "Error fetching user.", error: error.message });
    }
};

const updateUserById = async (req, res) => {
    const { id } = req.params;
    const { name, email, status, password } = req.body;

    // Validate ID
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "Invalid user ID." });
    }

    try {
        // Check if user exists
        const user = await prisma.user.findUnique({ where: { id: Number(id), role: 'USER' } });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Prepare update data
        const updateData = {};
        if (name) updateData.name = name.trim();
        if (email) updateData.email = email.trim();

        // Validate and update status
        if (status && ["INVITED", "PENDING", "SUSPENDED", "ACTIVE"].includes(status)) {
            updateData.status = status;
        } else if (status) {
            return res.status(400).json({ message: "Invalid status value." });
        }

        // Hash and update password
        if (password) {

            updateData.password = await bcrypt.hash(password, 10);
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: Number(id), role: 'USER' },
            data: updateData,
            select: {
                name: true,
                email: true,
                role: true,
                status: true,
                profile: true
            }
        });

        return res.status(200).json({ message: "User updated successfully.", user: updatedUser });
    } catch (error) {
        console.error("Error in update:", error);
        return res.status(500).json({ message: "Error updating user.", error: error.message });
    }
};

const getAllDhobis = async (req, res) => {
    try {
        const dhobis = await prisma.user.findMany({ where: { role: "DHOBI" } });
        return res.status(200).json({ message: "All Dhobis fetched successfully.", dhobis });
    } catch (error) {
        console.error("Error in getAllDhobis:", error);
        return res.status(500).json({ message: "Error fetching dhobis.", error: error.message });
    }
};

const getDhobiById = async (req, res) => {
    const { id } = req.params;

    try {
        const owner = await prisma.user.findUnique({ where: { id: Number(id), role: "OWNER" } });
        if (!owner) {
            return res.status(404).json({ message: "Owner not found." });
        }

        return res.status(200).json({ message: "Owner fetched successfully.", owner });
    } catch (error) {
        console.error("Error in getOwnerById:", error);
        return res.status(500).json({ message: "Error fetching owner.", error: error.message });
    }
};

const getUsersByDhobi = async (req, res) => {
    const { id } = req.params; // Owner ID from the route parameter

    try {
        // Check if the owner exists and has the role "OWNER"
        const owner = await prisma.user.findUnique({
            where: { id: Number(id), role: "OWNER" },
            include: { children: true }, // Include associated users
        });

        if (!owner) {
            return res.status(404).json({ message: "Owner not found." });
        }

        // Fetch the children (users) of the owner
        const users = owner.children;

        return res.status(200).json({
            message: `Users fetched successfully for owner with ID: ${id}.`,
            users,
        });
    } catch (error) {
        console.error("Error in getUsersByDhobi:", error);
        return res.status(500).json({
            message: "An error occurred while fetching users.",
            error: error.message,
        });
    }
};

const updateDhobiById = async (req, res) => {
    const { id } = req.params;
    const { name, email, username, status } = req.body;

    try {
        const owner = await prisma.user.findUnique({ where: { id: Number(id), role: "OWNER" } });
        if (!owner) {
            return res.status(404).json({ message: "Owner not found." });
        }

        const updateData = { name, email, username, status };
        const updatedOwner = await prisma.user.update({
            where: { id: Number(id) },
            data: updateData,
        });

        return res.status(200).json({ message: "Owner updated successfully.", owner: updatedOwner });
    } catch (error) {
        console.error("Error in updateOwner:", error);
        return res.status(500).json({ message: "Error updating owner.", error: error.message });
    }
};


const verifyDhobiAccount = async (req, res) => {
    const { userIds } = req.body;

    try {
        // Arrays to store the results
        const users = [];
        const notAvailableIds = [];

        // Fetch users and generate activation tokens in parallel
        await Promise.all(
            userIds.map(async (id) => {
                const user = await prisma.user.update({
                    where: { id: id, role: 'DHOBI' },
                    data: { status: 'INVITED', },
                    select: { id: true, name: true, email: true, role: true, status: true }
                });

                if (!user) {
                    // If user not found, track the id
                    notAvailableIds.push(id);
                } else {
                    // If user found, generate the token and update the user
                    const token = await generateAccessToken({ id: user.id, role: user.role, email: user.email });
                    user.activationLink = `${config.baseUrl}/account/activate?token=${token}`;
                    users.push(user);
                }
            })
        );


        // Send activation emails for the valid users
        if (users.length > 0) {
            await activationEmail(users);
        }

        // Respond with success and information about unavailable IDs
        res.status(200).json({
            success: true,
            updatedUsers: users,
            notAvailableIds: notAvailableIds.length > 0 ? notAvailableIds : null
        });

    } catch (error) {
        // Enhanced error handling
        console.error("Error verifying accounts:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};


module.exports = {
    user,
    getAllUsers,
    getUserById,
    updateUserById,
    getAllDhobis,
    getDhobiById,
    getUsersByDhobi,
    updateDhobiById,
    verifyDhobiAccount,
};
