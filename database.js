async function connect() {

    if(global.connection)
        return global.connection.connect();

    const { Pool } = require("pg");
    const pool = new Pool({
        connectionString: process.env.CONNECTION_STRING
    });

    const client = await pool.connect();
    console.log("Criou o pool de conexão");

    const res = await client.query("select now()");
    console.log(res.rows[0]);
    client.release();

    global.connection = pool;
    return pool.connect();
}

connect();

async function selectCustomer(id) {
    const client = await connect();
    const res = await client.query("SELECT * FROM clientes WHERE ID=$1", [id]);
    return res.rows;
}

async function selectCustomers() {
    const client = await connect();
    const res = await client.query
    ("select clientes.id, clientes.nome, clientes.idade, uf.unidade_fiscal from clientes inner join uf on clientes.uf_id = uf.id");
    return res.rows;
}

async function insertCustomer(customer) {
    const client = await connect();
    const sql = "INSERT INTO clientes(nome,idade,uf_id) VALUES($1, $2, $3)"
    await client.query(sql, [customer.nome, customer.idade, customer.uf_id]);
}

async function updateCustomer(id, customer) {
    const client = await connect();
    const sql = "UPDATE clientes SET nome=$1, idade=$2, uf_id=$3 WHERE id=$4"
    await client.query(sql, [customer.nome, customer.idade, customer.uf_id, id]);
}

async function deleteCustomer(id) {
    const client = await connect();
    const sql = "DELETE FROM clientes WHERE id=$1"
    await client.query(sql, [id]);
}

module.exports = {
    selectCustomers,
    selectCustomer,
    insertCustomer,
    updateCustomer,
    deleteCustomer
}