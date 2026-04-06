export default function ProductForm({productos, filtroProducto, setFiltroProducto, idSeleccionado, setIdSeleccionado, cantidad, setCantidad, agregarAlCarrito}) {
    return (
        <form className="ventas-form" onSubmit={agregarAlCarrito}>
            <div className="input-group">
                <label>Buscar Producto:</label>
                <input 
                type="text"
                placeholder="Escriba nombre del producto..."
                value={filtroProducto}
                onChange={(e) => setFiltroProducto(e.target.value)}
                />
            </div>

            <select value={idSeleccionado} onChange={(e) => setIdSeleccionado(e.target.value)} required>
                <option value="">Seleccionar Producto...</option>
                {productos.filter(p => p.nombre.toLowerCase().includes(filtroProducto.toLowerCase())).map(p => (
                <option key={p.id} value={p.id}>{p.nombre} - Talle: {p.talle} (${p.precio})</option>
                ))}
            </select>

            <div className="input-group">
                <label>Cantidad:</label>
                <input type="number" min="1" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
            </div>
            <button type="submit" className="btn-agregar">Añadir al carrito</button>
        </form>
    )
}

