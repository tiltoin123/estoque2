import { QueryInterface } from "sequelize";

const queueData = [
    {
        name: "Canal de Boas Vindas",
        color: "#008b02",
        greetingMessage: "Olá sou o chatbot da imobiliária fábio liporoni, como posso ajudar?",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Canal de Vendas",
        color: "#004dcf",
        greetingMessage: "Seja Bem Vindo ao Canal de Vendas.",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Canal de Compras",
        color: "#0000FF",
        greetingMessage: "Seja Bem Vindo ao Canal de Compras.",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Canal de Finanças",
        color: "#48D1CC",
        greetingMessage: "Seja Bem Vindo ao Canal de Finanças.",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Canal Jurídico",
        color: "#00FF00",
        greetingMessage: "Seja Bem Vindo ao Canal Jurídico.",
        createdAt: new Date(),
        updatedAt: new Date()
    },
];

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.bulkInsert("Queues", queueData, {});
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.bulkDelete("Queues", {});
    }
};
