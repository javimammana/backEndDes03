import express from "express";
import {ProductManager} from "./ProductManager.js";

const app = express();
const PORT = 8080;

app.use (express.urlencoded({extended: true}));

const manager = new ProductManager ("./src/lista.json");

//RUTAS
app.get("/", (req, res) => {
    res.send("Mi primer mensaje")
})

app.get("/products", async (req,res) => {

    const productos = manager.getProducts();

    const limit = await Number(req.query.limit);
    // console.log(limit);

    if (limit) {
        const productosFiltrados = productos.slice(0,limit);
        res.send (productosFiltrados);
        return;
    } 
    res.send (productos);
})

app.get("/products/:id", async (req, res) => {
    console.log (req.params);
    const { id } = req.params;

    const producto = await manager.getProductById(Number(id));

    res.send (producto);
})





app.listen(PORT,  () => console.log(`Escuchando en http://localhost:${PORT}`));