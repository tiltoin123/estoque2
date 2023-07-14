import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.addColumn("Messages", "templateId", {
            type: DataTypes.INTEGER,
            references: { model: "Templates", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "SET NULL"
        });
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.removeColumn("Messages", "templateId");
    }
};
