import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { generarFacturaPDF } from '../GeneradorPDF';
import { generarCodigoVenta } from './VentaUtils';
import './Ventas.css';
import ProductForm from './ProductForm';
import CartTable from './CartTable';
import CartFooter from './CartFooter';

export default function SeccionVentas({ alTerminar, sesion }) {
  const [productos, setProductos] = useState([]);
  const [idSeleccionado, setIdSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [filtroProducto, setFiltroProducto] = useState('');

  const [inputNC, setInputNC] = useState('');
  const [notaAplicada, setNotaAplicada] = useState(null); 
  const [buscandoNC, setBuscandoNC] = useState(false);

  const traerProductos = async () => {
    const { data } = await supabase
      .from('productos')
      .select('*')
      .gt('stock', 0)
      .order('nombre', { ascending: true });
    setProductos(data || []);
  };

  useEffect(() => {
    traerProductos();
  }, []);

  const validarNotaCredito = async () => {
    if (!inputNC) return;
    setBuscandoNC(true);
    try {
      const { data, error } = await supabase
        .from('notas_credito')
        .select('*')
        .eq('codigo_nc', inputNC.trim().toUpperCase())
        .single();

      if (error || !data) {
        alert("El código de nota de crédito no existe.");
      } else if (data.estado !== 'disponible') {
        alert(`Esta nota de crédito está en estado: ${data.estado}`);
      } else {
        setNotaAplicada(data);
        alert(`✅ Nota aplicada por: $${data.monto}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBuscandoNC(false);
    }
  };

  const quitarNota = () => {
    setNotaAplicada(null);
    setInputNC('');
  };

  const agregarAlCarrito = (e) => {
    e.preventDefault();
    const producto = productos.find(p => p.id === parseInt(idSeleccionado));
    if (!producto) return;

    const existe = carrito.find(item => item.id === producto.id);
    const cantidadASumar = parseInt(cantidad);

    if (existe) {
      if (producto.stock < (existe.cantidadEnCarrito + cantidadASumar)) {
        alert("No hay suficiente stock para sumar esa cantidad");
        return;
      }
      setCarrito(carrito.map(item =>
        item.id === producto.id
          ? { ...item, cantidadEnCarrito: item.cantidadEnCarrito + cantidadASumar }
          : item
      ));
    } else {
      if (producto.stock < cantidadASumar) {
        alert("No hay suficiente stock");
        return;
      }
      setCarrito([...carrito, { ...producto, cantidadEnCarrito: cantidadASumar }]);
    }

    setIdSeleccionado('');
    setCantidad(1);
    setFiltroProducto('');
  };

  const eliminarDelCarrito = (id) => setCarrito(carrito.filter(item => item.id !== id));

  const disminuirCantidad = (id) => {
    setCarrito(carrito.map(item => 
      item.id === id && item.cantidadEnCarrito > 1 
        ? { ...item, cantidadEnCarrito: item.cantidadEnCarrito - 1 } 
        : item
    ));
  };

  const aumentarCantidad = (id) => {
    setCarrito(carrito.map(item => {
      if (item.id === id) {
        if (item.cantidadEnCarrito < item.stock) return { ...item, cantidadEnCarrito: item.cantidadEnCarrito + 1 };
        alert("No hay más stock disponible");
      }
      return item;
    }));
  };

  const subtotalVenta = carrito.reduce((acc, item) => acc + (item.precio * item.cantidadEnCarrito), 0);
  const totalConDescuento = Math.max(0, subtotalVenta - (notaAplicada?.monto || 0));

  const finalizarCompra = async () => {
    if (carrito.length === 0) return;
    const nuevoCodigo = generarCodigoVenta();

    try {
      const { data: cabecera, error: errorCabecera } = await supabase
        .from('ventas_cabecera')
        .insert([{ 
          vendedor_email: sesion?.user?.email,
          total_total: totalConDescuento,
          metodo_pago: notaAplicada ? `${metodoPago} + NC` : metodoPago,
          codigo_venta: nuevoCodigo 
        }])
        .select().single();

      if (errorCabecera) throw errorCabecera;

      if (notaAplicada) {
        const { error: errorNC } = await supabase
          .from('notas_credito')
          .update({ 
            estado: 'usado',
            venta_destino_id: cabecera.id 
          })
          .eq('id', notaAplicada.id);
        
        if (errorNC) throw errorNC;
      }

      const registrosDetalle = carrito.map(item => ({
        venta_id: cabecera.id,
        producto_id: item.id,
        cantidad: item.cantidadEnCarrito,
        precio_unitario: item.precio
      }));
      const { error: errorDetalle } = await supabase.from('ventas_detalle').insert(registrosDetalle);
      if (errorDetalle) throw errorDetalle;

      const promesasStock = carrito.map(async (item) => {
        const { data: prodActual } = await supabase.from('productos').select('stock').eq('id', item.id).single();
        return supabase.from('productos').update({ stock: (prodActual?.stock || 0) - item.cantidadEnCarrito }).eq('id', item.id);
      });
      await Promise.all(promesasStock);

      generarFacturaPDF({
        codigo: nuevoCodigo,
        carrito: [...carrito],
        total: totalConDescuento,
        metodoPago: metodoPago,
        vendedor: sesion?.user?.email || 'Vendedor'
      });

      alert(`🎉 Venta exitosa!\nCódigo: ${nuevoCodigo}`);
      setCarrito([]);
      setMetodoPago('Efectivo');
      setNotaAplicada(null);
      setInputNC('');
      traerProductos();
      if (alTerminar) alTerminar();

    } catch (error) {
      console.error("Error completo:", error);
      alert("Error al procesar la venta. Revisa la consola.");
    }
  };

  return (
    <div className="ventas-container">
      <h3>Punto de Venta 🛒</h3>

      <ProductForm
        productos={productos}
        filtroProducto={filtroProducto}
        setFiltroProducto={setFiltroProducto}
        idSeleccionado={idSeleccionado}
        setIdSeleccionado={setIdSeleccionado}
        cantidad={cantidad}
        setCantidad={setCantidad}
        agregarAlCarrito={agregarAlCarrito}
      />

      {carrito.length > 0 && (
        <div className="carrito-resumen">
          <h4>Detalle de la Orden</h4>

          <CartTable
            carrito={carrito}
            aumentarCantidad={aumentarCantidad}
            disminuirCantidad={disminuirCantidad}
            eliminarDelCarrito={eliminarDelCarrito}
          />

          <CartFooter
            // Datos de la Nota de Crédito
            inputNC={inputNC}
            setInputNC={setInputNC}
            notaAplicada={notaAplicada}
            buscandoNC={buscandoNC}
            validarNotaCredito={validarNotaCredito}
            quitarNota={quitarNota}
            
            // Totales y Pago
            subtotalVenta={subtotalVenta}
            totalConDescuento={totalConDescuento}
            metodoPago={metodoPago}
            setMetodoPago={setMetodoPago}
            
            // Acciones finales
            onVaciar={() => { setCarrito([]); setNotaAplicada(null); }}
            onFinalizar={finalizarCompra}
          />

        </div>
      )}
    </div>
  );
}