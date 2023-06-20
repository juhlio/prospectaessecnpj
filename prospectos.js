const Sequelize = require('sequelize');
const database = require('./db');



const Clients = database.define('prospectos', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    razaoSocial: {
        type: Sequelize.STRING,
        allowNull: false
    },

    cnpj: Sequelize.STRING,
    endereco: Sequelize.STRING,
    numero: Sequelize.STRING,
    complemento: Sequelize.STRING,
    bairro: Sequelize.STRING,
    cidade: Sequelize.STRING,
    uf: Sequelize.STRING,
    cep: Sequelize.STRING,
    telefone1: Sequelize.STRING,
    telefone2: Sequelize.STRING,
    email: Sequelize.STRING,
    segmento: Sequelize.STRING,
    
})

module.exports = Clients