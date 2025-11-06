import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import argon2 from "argon2";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const PORT = 3001;

// Configuración de Middleware
app.use(cors());
app.use(bodyParser.json());

/**
 * Genera un hash de la contraseña utilizando Argon2.
 * @param {string} password La contraseña en texto plano.
 * @returns {Promise<string>} Una promesa que resuelve con el hash de la contraseña.
 */
const hashPassword = (password) => {
  return argon2.hash(password);
};

/**
 * Verifica una contraseña comparándola con un hash de Argon2 almacenado.
 * @param {string} password La contraseña a verificar.
 * @param {string} storedHash El hash almacenado en la base de datos.
 * @returns {Promise<boolean>} Una promesa que resuelve a verdadero si la contraseña es correcta.
 */
const verifyPassword = (password, storedHash) => {
  return argon2.verify(storedHash, password);
};

// --- Definición de Endpoints de la API ---

// Endpoint para registrar un nuevo usuario.
app.post("/api/register", async (req, res) => {
  const { name, email, password, calorieGoal, phone, address, idNumber } = req.body;

  // Validación básica de campos obligatorios.
  if (!name || !email || !password || !calorieGoal || !phone || !address || !idNumber) {
    return res.status(400).json({ message: "Todos los campos son obligatorios." });
  }

  try {
    const hashedPassword = await hashPassword(password);
    const avatarUrl = `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`;

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        calorieGoal: Number(calorieGoal),
        avatar: avatarUrl,
        phone,
        address,
        idNumber,
      },
    });

    // Devuelve el objeto del nuevo usuario, excluyendo la contraseña por seguridad.
    const userToReturn = { ...newUser };
    delete userToReturn.password;

    res.status(201).json(userToReturn);
  } catch (error) {
    // Maneja el error de restricción ÚNICA para el correo electrónico.
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(409).json({ message: "Ya existe una cuenta con este correo." });
    }
    console.error(error);
    res.status(500).json({ message: "Error al registrar el usuario." });
  }
});

// Endpoint para autenticar a un usuario.
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Correo y contraseña son obligatorios." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Si no se encuentra el usuario o la contraseña es incorrecta, devuelve un error.
    if (!user || !(await verifyPassword(password, user.password))) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos." });
    }

    // Devuelve el objeto del usuario encontrado, excluyendo la contraseña por seguridad.
    const userToReturn = { ...user };
    delete userToReturn.password;

    res.status(200).json(userToReturn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor." });
  }
});

// --- Endpoints de Recetas ---

// Endpoint para obtener todas las recetas.
app.get("/api/recipes", async (req, res) => {
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        ingredients: true, // Incluye los ingredientes relacionados
        steps: {
          orderBy: {
            order: 'asc', // Ordena los pasos
          },
        },
      },
    });
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las recetas." });
  }
});

// Endpoint para buscar recetas por ingrediente.
app.get("/api/recipes/search", async (req, res) => {
  const { ingredient } = req.query;

  if (!ingredient) {
    return res.status(400).json({ message: "El parámetro 'ingredient' es requerido." });
  }

  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        ingredients: {
          some: {
            name: {
              contains: ingredient,
            },
          },
        },
      },
      include: {
        ingredients: true,
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar recetas." });
  }
});

// --- Endpoints del Planificador ---

// Middleware improvisado para obtener el ID de usuario de las cabeceras.
// En una app real, esto se manejaría con un token de autenticación (JWT).
const getUserId = (req) => {
  const userId = req.headers['x-user-id'];
  return userId ? parseInt(userId, 10) : null;
};

// Endpoint para obtener (o crear) el planificador del día actual.
app.get("/api/planner/today", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: "No autorizado: ID de usuario no proporcionado." });
  }

  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  try {
    let plan = await prisma.dailyPlan.findFirst({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        entries: {
          include: {
            recipe: true,
          },
          orderBy: {
            id: 'asc' // Ordenar por creación
          }
        },
      },
    });

    // Si no existe un plan para hoy, se crea uno nuevo.
    if (!plan) {
      plan = await prisma.dailyPlan.create({
        data: {
          userId,
          date: new Date(),
        },
        include: {
          entries: true, // Inicialmente vacío
        },
      });
    }
    res.status(200).json(plan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el planificador diario." });
  }
});

// Endpoint para añadir una receta al planificador del día.
app.post("/api/planner/entries", async (req, res) => {
  const userId = getUserId(req);
  const { recipeId, planId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "No autorizado." });
  }
  if (!recipeId || !planId) {
    return res.status(400).json({ message: "recipeId y planId son requeridos." });
  }

  try {
    const newEntry = await prisma.planEntry.create({
      data: {
        planId,
        recipeId,
      },
      include: {
        recipe: true // Devolver la receta completa para actualizar la UI
      }
    });
    res.status(201).json(newEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al añadir la receta al plan." });
  }
});

// Endpoint para eliminar una entrada del planificador.
app.delete("/api/planner/entries/:id", async (req, res) => {
  const userId = getUserId(req);
  const entryId = parseInt(req.params.id, 10);

  if (!userId) {
    return res.status(401).json({ message: "No autorizado." });
  }

  try {
    // Verificación opcional: asegurar que la entrada pertenezca al plan del usuario.
    const entry = await prisma.planEntry.findUnique({
      where: { id: entryId },
      select: { plan: { select: { userId: true } } },
    });
    
    if (!entry || entry.plan.userId !== userId) {
      return res.status(404).json({ message: "Entrada no encontrada o no pertenece al usuario." });
    }

    await prisma.planEntry.delete({
      where: { id: entryId },
    });
    res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la receta del plan." });
  }
});

// --- Endpoints de Usuario ---

// Endpoint para actualizar el perfil del usuario.
app.put("/api/users/me", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: "No autorizado." });
  }

  // Se extraen solo los campos que permitimos actualizar.
  const { name, calorieGoal, phone, address, idNumber } = req.body;

  // Validación básica
  if (!name || !calorieGoal || !phone || !address || !idNumber) {
    return res.status(400).json({ message: "Todos los campos son obligatorios." });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        calorieGoal: Number(calorieGoal),
        phone,
        address,
        idNumber,
      },
    });

    // Se elimina la contraseña del objeto antes de devolverlo.
    const userToReturn = { ...updatedUser };
    delete userToReturn.password;

    res.status(200).json(userToReturn);
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    res.status(500).json({ message: "Error al actualizar el perfil." });
  }
});

// Endpoint para obtener el historial calórico de los últimos 7 días.
app.get("/api/users/me/calorie-history", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: "No autorizado." });
  }

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const plans = await prisma.dailyPlan.findMany({
      where: {
        userId,
        date: {
          gte: sevenDaysAgo,
        },
      },
      include: {
        entries: {
          include: {
            recipe: {
              select: {
                kcal: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    const history = plans.map(plan => {
      const totalCalories = plan.entries.reduce((sum, entry) => sum + entry.recipe.kcal, 0);
      return {
        date: plan.date.toISOString().split('T')[0], // Formato YYYY-MM-DD
        totalCalories,
      };
    });

    res.status(200).json(history);
  } catch (error) {
    console.error("Error al obtener el historial calórico:", error);
    res.status(500).json({ message: "Error al obtener el historial." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
