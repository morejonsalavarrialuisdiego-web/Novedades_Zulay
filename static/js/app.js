let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productosGlobal = [];

/* CARGAR PRODUCTOS */
async function cargarProductos() {
    const contenedor = document.getElementById("productos");
    if (!contenedor) return;

    const res = await fetch("productos.json");
    productosGlobal = await res.json();

    pintarProductos(productosGlobal);

    const buscar = document.getElementById("buscar");
    if (buscar) {
        buscar.addEventListener("input", () => {
            const texto = buscar.value.toLowerCase();

            const filtrados = productosGlobal.filter(p =>
                p.nombre.toLowerCase().includes(texto)
            );

            pintarProductos(filtrados);
        });
    }
}

/* MOSTRAR PRODUCTOS */
function pintarProductos(lista) {

    const contenedor = document.getElementById("productos");

    contenedor.innerHTML = lista.map(p => `
        <div class="card">
            <img src="${p.imagen}" alt="${p.nombre}">
            <h3>${p.nombre}</h3>
            <p>$${p.precio}</p>
            <button onclick="agregar(${p.id})">
                Agregar
            </button>
        </div>
    `).join("");
}

/* AGREGAR AL CARRITO */
function agregar(id) {

    const producto = productosGlobal.find(p => p.id == id);
    const existe = carrito.find(p => p.id == id);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    guardar();
    alert("Producto agregado");
}

/* GUARDAR */
function guardar() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

/* MOSTRAR CARRITO */
function cargarCarrito() {

    const contenedor = document.getElementById("carrito");
    if (!contenedor) return;

    if (carrito.length === 0) {
        contenedor.innerHTML = "<h2 style='text-align:center;'>🛒 Carrito vacío</h2>";
        return;
    }

    let total = 0;

    contenedor.innerHTML = `
        <div class="carrito-grid">
            ${carrito.map((p, i) => {

                let subtotal = p.precio * p.cantidad;
                total += subtotal;

                return `
                <div class="carrito-card">

                    <img src="${p.imagen}" alt="${p.nombre}">

                    <div class="carrito-info">
                        <h3>${p.nombre}</h3>
                        <p>$${p.precio} x ${p.cantidad}</p>
                        <p class="subtotal">Total: $${subtotal}</p>

                        <div class="acciones">
                            <button onclick="sumar(${i})">+</button>
                            <button onclick="restar(${i})">-</button>
                            <button class="eliminar" onclick="eliminar(${i})">🗑</button>
                        </div>
                    </div>

                </div>
                `;
            }).join("")}
        </div>

        <div class="resumen">

            <h2>Total: $${total}</h2>

            <button class="btn" onclick="enviarWhatsApp()">
                📲 Enviar Pedido
            </button>

            <button class="btn-vaciar" onclick="vaciar()">
                🗑 Vaciar Carrito
            </button>

        </div>
    `;
}

/* FUNCIONES CARRITO */
function sumar(i) {
    carrito[i].cantidad++;
    guardar();
    cargarCarrito();
}

function restar(i) {
    carrito[i].cantidad--;

    if (carrito[i].cantidad <= 0) {
        carrito.splice(i, 1);
    }

    guardar();
    cargarCarrito();
}

function eliminar(i) {
    carrito.splice(i, 1);
    guardar();
    cargarCarrito();
}

function vaciar() {
    carrito = [];
    guardar();
    cargarCarrito();
}

/* WHATSAPP */
function enviarWhatsApp() {

    let texto = "Hola, deseo pedir:%0A%0A";

    carrito.forEach(p => {
        texto += `${p.nombre} x${p.cantidad}%0A`;
    });

    window.open(
        `https://wa.me/593986159709?text=${texto}`,
        "_blank"
    );
}

/* INICIAR */
cargarProductos();
cargarCarrito();
