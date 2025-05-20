const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Secretary = require("../models/Secretary");

const registerSecretary = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      secondLastName,
      email,
      phone,
      yearsOfExperience,
      hiringDate,
      password,
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Campos requeridos faltantes" });
    }

    const existingSecretary = await Secretary.findOne({ email });
    if (existingSecretary) {
      return res
        .status(400)
        .json({ message: "Correo electrónico ya registrado" });
    }

    const newSecretary = new Secretary({
      firstName,
      middleName,
      lastName,
      secondLastName,
      email,
      phone,
      yearsOfExperience,
      hiringDate,
      password,
    });

    await newSecretary.save();

    return res.status(201).json({
      message: "Secretaria registrada con éxito",
      secretary: newSecretary,
    });
  } catch (error) {
    console.error("Error al registrar secretaria:", error);
    return res.status(500).json({
      message: "Error al registrar la secretaria",
      error: error.message,
    });
  }
};

const loginSecretary = async (req, res) => {
  try {
    const { email, password } = req.body;

    const secretary = await Secretary.findOne({ email });
    if (!secretary) {
      return res.status(404).json({ message: "Secretario no encontrado" });
    }

    const isValidPassword = await bcrypt.compare(password, secretary.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const fullName = `${secretary.firstName} ${secretary.middleName || ""} ${
      secretary.lastName
    } ${secretary.secondLastName || ""}`;
    res.json({
      message: "Login exitoso",
      secretary: {
        id: secretary._id,
        fullName: fullName,
        email: secretary.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al intentar iniciar sesión" });
  }
};

const getSecretaryById = async (req, res) => {
  try {
    const { id } = req.params;
    const secretary = await Secretary.findById(id);
    if (!secretary) {
      return res.status(404).json({ message: "Secretario no encontrado" });
    }
    res.json(secretary);
  } catch (error) {
    console.error("Error al obtener secretario por ID:", error);
    res.status(500).json({ message: "Error al obtener el secretario" });
  }
};

const resetCodes = {}; // objeto temporal para guardar códigos

const sendPasswordResetCode = async (req, res) => {
  const { email } = req.body;

  try {
    const secretary = await Secretary.findOne({ email });
    if (!secretary) {
      return res.status(404).json({ message: "Correo no encontrado" });
    }

    const code = crypto.randomInt(100000, 999999).toString(); // código de 6 dígitos
    resetCodes[email] = code; // almacén temporal (ideal: usar base de datos o caché)

    return res.json({
      message: "Código de recuperación generado",
      code: code, // devuelves el código directamente
    });
  } catch (error) {
    console.error("Error al generar código de recuperación:", error);
    res
      .status(500)
      .json({ message: "Error al generar código de recuperación" });
  }
};

const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  if (resetCodes[email] !== code) {
    return res.status(400).json({ message: "Código incorrecto o expirado" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updated = await Secretary.findOneAndUpdate(
    { email },
    { password: hashedPassword },
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  delete resetCodes[email]; // elimina el código después de usarlo

  res.json({ message: "Contraseña restablecida con éxito" });
};

module.exports = {registerSecretary,loginSecretary,getSecretaryById,sendPasswordResetCode,resetPassword};