const conexion = {
    user: 'node',
    password: 'node123',
    server: 'localhost',
    database: 'PeluqueriaLander',
    options: {
        trustServerCertificate: true,
        instancename: 'SQLEXPRESS'
    }
}

module.exports = conexion;
