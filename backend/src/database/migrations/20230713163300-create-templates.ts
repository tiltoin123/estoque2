import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.createTable("Templates", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            lastMessage: {
                type: DataTypes.INTEGER,
                defaultValue: null
            },
            nextMessage: {
                type: DataTypes.INTEGER,
                defaultValue: null
            },
            condition: {
                type: DataTypes.STRING,
                defaultValue: null
            },
            queueId: {
                type: DataTypes.INTEGER,
                references: { model: "Queues", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            }
        });
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.dropTable("Templates");
    }
};
