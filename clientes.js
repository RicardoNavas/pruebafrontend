$(document).ready(function () {
  $.ajax({
    url: 'https://jsonplaceholder.typicode.com/users',
    method: 'GET',
    success: function (data) {
      data.forEach(cliente => {
        const tarjetas = Math.floor(Math.random() * 5) + 1;
        const estado = Math.random() > 0.3 ? 'Activo' : 'Inactivo';

        const fila = `
          <tr>
            <td>${cliente.name}</td>
            <td>${cliente.email}</td>
            <td>${tarjetas}</td>
            <td><span class="badge bg-${estado === 'Activo' ? 'success' : 'secondary'}">${estado}</span></td>
            <td>
              <button class="btn btn-sm btn-primary ver-detalles" 
                data-nombre="${cliente.name}" 
                data-email="${cliente.email}" 
                data-tarjetas="${tarjetas}" 
                data-estado="${estado}" 
                data-telefono="${cliente.phone}" 
                data-direccion="${cliente.address.street}, ${cliente.address.city}">
                Ver Detalles
              </button>
            </td>
          </tr>
        `;

        $('#clientes-body').append(fila);
      });
    },
    error: function () {
      alert('Error cargando datos de clientes');
    }
  });

  // Evento delegado para el botón Ver Detalles
  $(document).on('click', '.ver-detalles', function () {
    const btn = $(this);

    $('#detalle-nombre').text(btn.data('nombre'));
    $('#detalle-email').text(btn.data('email'));
    $('#detalle-tarjeta').text(btn.data('tarjetas'));
    $('#detalle-estado').text(btn.data('estado'));
    $('#detalle-telefono').text(btn.data('telefono'));
    $('#detalle-direccion').text(btn.data('direccion'));

    const modal = new bootstrap.Modal(document.getElementById('modalDetalles'));
    modal.show();
  });
});
