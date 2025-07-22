const User = require("../models/User");

const STATIC_USERS = [
    { email: 'user@gmail.com', password: '1user123' },
    { email: 'user2@gmail.com', password: '2user123' }
];

exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "User fields are missing" });
        }

        const user = STATIC_USERS.find(u => u.email === email && u.password === password);

        if (user) {
            const user = await User.findOne({ email });

            res.status(200).json({ 
            message: 'Login successful', 
            user: {
                id: user._id,
                name: user.name,
                }
            });

        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ errmessage: "Something went wrong.", error: error.message });
    }
};

