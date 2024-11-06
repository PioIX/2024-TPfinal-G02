const { realizarQuery } = require('../../modulos/mysql');   

// Ruta para el login
const loginHandler = async (req, res) => {
    const { username, password } = req.body;

    // Construimos la query SQL
    // Habría que proteger en caso de inyeccion sql pero no lo hacemos acá
    const query = `SELECT * FROM usuarios WHERE username = '${username}' AND password = '${password}'`;
    
    try {
        // Ejecutamos la consulta usando la función `realizarQuery`
        const results = await realizarQuery(query);

        if (results.length > 0) {
            // Guardamos los datos del usuario en la sesión si se encuentra el usuario
            req.session.user = {
                id: results[0].id,
                username: results[0].username,
                // Otros datos que necesites almacenar
            };
            res.json({ message: 'Login exitoso' });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error('Error en la base de datos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}


module.exports = {
    loginHandler
};