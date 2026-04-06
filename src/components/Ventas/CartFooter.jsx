export default function CartFooter({inputNC, setInputNC, notaAplicada, buscandoNC, validarNotaCredito,
    quitarNota,subtotalVenta, totalConDescuento, metodoPago, setMetodoPago, onVaciar, finalizarCompra}) {
    return(
        <>
          <div className="seccion-canje-nc">
            <label>¿Tiene Nota de Crédito?</label>
            <div className="nc-input-group">
              <input 
                type="text" 
                placeholder="Código NC (ej: NC-1234)" 
                value={inputNC}
                onChange={(e) => setInputNC(e.target.value)}
                disabled={!!notaAplicada}
              />
              {!notaAplicada ? (
                <button onClick={validarNotaCredito} disabled={buscandoNC} className="btn-aplicar-nc">
                  {buscandoNC ? '...' : 'Aplicar'}
                </button>
              ) : (
                <button onClick={quitarNota} className="btn-quitar-nc">Quitar</button>
              )}
            </div>
          </div>

          <div className="carrito-footer">
            <div className="totales-desglose">
                <p>Subtotal: <span>${subtotalVenta}</span></p>
                {notaAplicada && <p className="descuento-nc">Nota de Crédito: <span>-${notaAplicada.monto}</span></p>}
                <p className="total-texto">Total a Pagar: <span>${totalConDescuento}</span></p>
            </div>
            
            <div className="pago-selector">
              <label>Método de Pago Restante:</label>
              <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} className="select-pago">
                <option value="Efectivo">💵 Efectivo</option>
                <option value="Transferencia">📱 Transferencia</option>
                <option value="Débito">💳 Débito</option>
                <option value="Crédito">💳 Crédito</option>
              </select>
            </div>

            <div className="acciones-finales">
              <button onClick={onVaciar} className="btn-vaciar">Cancelar</button>
              <button onClick={finalizarCompra} className="btn-finalizar">Confirmar Compra</button>
            </div>
          </div>
        </>
    )
}