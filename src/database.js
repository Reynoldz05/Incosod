import {createPool} from 'mysql2/promise';

const pool = createPool({
    host: 'prueba.cdsmegi42ugg.us-east-2.rds.amazonaws.com',
    port: '3306',
    user: 'reynoldz',
    password: 'root2024.',
    database: 'prueba_sistema'
});

export default pool;

