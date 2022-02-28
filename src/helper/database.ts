import "reflect-metadata";
import { createConnection } from "typeorm";
import { logger } from ".";

const createDataBaseConnection = async () => {
  const connection = await createConnection();
  logger.success(
    `createDataBaseConnection:: connected to database successfully ${connection.name}`
  );
  return connection;
};

export { createDataBaseConnection };
