export default function CartTable({carrito, aumentarCantidad, disminuirCantidad, eliminarDelCarrito}) {
    return(
        <table className="tabla-carrito">
            <tbody>
              {carrito.map(item => (
                <tr key={item.id}>
                  <td>{item.nombre} (T{item.talle})</td>
                  <td>${item.precio * item.cantidadEnCarrito}</td>
                  <td>
                    <div className="controles-cantidad">
                      <button className="btn-mini" onClick={() => disminuirCantidad(item.id)}>-</button>
                      <span className="cant-numero">{item.cantidadEnCarrito}</span>
                      <button className="btn-mini" onClick={() => aumentarCantidad(item.id)}>+</button>
                    </div>
                  </td>
                  <td><button onClick={() => eliminarDelCarrito(item.id)} className="btn-borrar-item">×</button></td>
                </tr>
              ))}
            </tbody>
        </table>
    )
}