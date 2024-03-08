// const fs = require("fs");

import fs from "fs"

class ProductManager {

    constructor(path) {
        this.path = path;
        try {
            let products = fs.readFileSync(path, "utf-8");
            this.products = JSON.parse(products);
        } catch {
            this.products = [];
        }
    }

    src = id => this.products.find(prod => prod.id === id);

    async saveProduct (product) {
        try {
            await fs.promises.writeFile (
                this.path,
                JSON.stringify(product, null, "\t")
            )
            console.log ("Se graba base.")
        } catch (error) {
            console.log (`Error al grabar base. Error: ${error}`)
        }
    }

    validate(element) {
        const {title, description, price, thumbnail, code, stock} = element;
        return (!title || !description || !price || !thumbnail || !code || !stock) ? false : true;
    }
    async addProduct(element) {

        const val = this.validate(element);

        if (!val) {
            console.log ("Datos de producto incompletos.");
        } else {
            const product = this.products.some(prod => prod.code === element.code);

            if (product) {
                console.log (`el codigo ${element.code}, ya existe en la base`);

            } else {
                const newProduct = {
                    ...element,
                    id: this.products.length + 1
                }
                this.products.push(newProduct);
                console.log("Producto agregado.")

                const resp = await this.saveProduct(this.products)
                return !resp
                ? console.log ("Producto agregado a la base.")
                : console.log ("Hubo un error al agregar el producto a la base.");
            }
        }
    }

    getProducts = () => this.products;

    async getProductById(id) {
        const product = await this.src(id);
        if (product){
            return (product);
        } else {
            console.log ("Not found.-");
            return(`El producto id: ${id}, no existe`)
        }
    }

    async deleteProduct(id) {

        const product = this.src(id);

        if (product) {
            await this.products.splice  (this.products.indexOf(product), 1);
            console.log ("Se Elimina el producto.")

            const resp = await this.saveProduct(this.products);

            return !resp
            ? console.log ("Se borra producto de la base.")
            : console.log ("Hubo un error al borrar producto de la base.");
        } else {
            console.log (`El producto id: ${id}, no existe en la base para ser eliminado.`);
        }
    }

    async updateProduct(id, element) {

        const product = this.src(id)

        if (product) {
            const productCode = this.products.some(prod => prod.code === element.code);

            if (!productCode) {
                
                const val = this.validate(element)

                if (val) {
                    const newProduct = {
                        ...element,
                        id: id
                    }

                    this.products.splice (this.products.indexOf(product), 1, newProduct);
                    console.log (`El producto id: ${id}, fue modificado.`);

                    const resp = await this.saveProduct(this.products)
                    return !resp
                    ? console.log ("El producto fue actualizado en la base.")
                    : console.log ("Hubo un error en actualizar el producto en la base.");
                } else {
                    console.log ("Datos incompletos para actualizar producto.")
                }
            } else{
                console.log (`El codigo ${element.code}, ya existe.`)
            }
        } else {
            console.log (`El producto id: ${id}, no existe para ser modificado.`)
        }
    }

}

class Product {
    constructor (title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

// async function fetchDatos () {
//     try {
//         const listado = new ProductManager ("./lista.json");

//         await listado.getProducts();

        // await listado.addProduct(
        //     new Product ("Producto prueba1", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
        //     );

//         await listado.getProducts();

        // await listado.addProduct(
        //     new Product ("Producto prueba2", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
        //     );
        
//         await listado.addProduct(
//             new Product ("Producto prueba3", "Este es un producto prueba", "Sin imagen", "abc456", 25)
//             );

//         await listado.addProduct(
//             new Product ("Producto prueba4", "Este es un producto prueba", 200, "Sin imagen", "abc456", 25)
//             );

//         await listado.addProduct(
//             new Product ("Producto prueba5", "Este es un producto prueba", 200, "Sin imagen", "def456", 25)
//             );

//         await listado.getProducts();

//         await listado.getProductById(2);
//         await listado.getProductById(8);

//         await listado.updateProduct(3,
//             new Product ("Producto modificado", "Este producto de modifico", 200, "Sin imagen", "abc123", 25)
//             );
            
//         await listado.updateProduct(3,
//             new Product ("Producto modificado", "Este producto de modifico", 200, "Sin imagen", "mod123", 25)
//             );

//         await listado.updateProduct(9,
//             new Product ("Producto modificado", "Este producto de modifico", 200, "Sin imagen", "xyz987", 25)
//             );

//         await listado.getProducts();
        
//         await listado.deleteProduct(2);

//         await listado.getProducts();

//         await listado.deleteProduct(7);

//     } catch (error) {
//         console.log(`Hubo un error al utilizar fetch: ${error}`);
//     }
// }

// fetchDatos();

export { ProductManager };


// const listado = new ProductManager();

// listado.getProducts();

// listado.addProduct(
//     new Product ("Producto prueba")
// );

// listado.addProduct(
//     new Product ("Producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
// );

// listado.getProducts();

// listado.addProduct(
//     new Product ("Producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
// );

// listado.getProductById(1);