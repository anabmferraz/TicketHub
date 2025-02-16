const sequelize = require("./config/db");

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Conexão com MySQL bem-sucedida!");
  } catch (error) {
    console.error("Falha na conexão:", error);
  }
}

testConnection();
