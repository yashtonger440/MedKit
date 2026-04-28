import bcrypt from "bcryptjs";

const password = "admin123";

const hashPassword = async () => {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    console.log("Hashed password");
    console.log(hashed);
};

hashPassword();