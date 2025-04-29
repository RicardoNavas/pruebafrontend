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

  // Mostrar detalles del cliente
  $(document).on('click', '.ver-detalles', function () {
    const btn = $(this);

    $('#detalle-nombre').text(btn.data('nombre'));
    $('#detalle-email').text(btn.data('email'));
    $('#detalle-tarjeta').text(btn.data('tarjetas'));
    $('#detalle-estado').text(btn.data('estado'));
    $('#detalle-telefono').text(btn.data('telefono'));
    $('#detalle-direccion').text(btn.data('direccion'));

    // Generar tarjetas simuladas
    const tarjetas = [];
    const marcas = ['Visa', 'MasterCard', 'Amex'];
    for (let i = 0; i < btn.data('tarjetas'); i++) {
      tarjetas.push({
        id: i + 1,
        numero: '**** **** **** ' + Math.floor(1000 + Math.random() * 9000),
        marca: marcas[Math.floor(Math.random() * marcas.length)],
        estado: 'Activo'
      });
    }

    // Pintar tarjetas
    let htmlTarjetas = '';
    tarjetas.forEach((t, i) => {
      htmlTarjetas += `
        <tr>
          <td>${t.numero}</td>
          <td>${t.marca}</td>
          <td><span class="badge bg-success" id="estado-${i}">${t.estado}</span></td>
          <td>
            <button class="btn btn-sm btn-danger bloquear-btn" data-id="${i}">Bloquear</button>
          </td>
        </tr>
      `;
    });
    $('#detalle-tarjetas-body').html(htmlTarjetas);

    // Guardar tarjetas para acceso global (temporal)
    window._tarjetasCliente = tarjetas;

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modalDetalles'));
    modal.show();
  });

  // Bloquear tarjeta (AJAX PATCH simulado)
  $(document).on('click', '.bloquear-btn', function () {
    const id = $(this).data('id');
    const tarjeta = window._tarjetasCliente[id];

    if (confirm(`¿Seguro que deseas bloquear la tarjeta ${tarjeta.numero}?`)) {
      $.ajax({
        url: 'https://jsonplaceholder.typicode.com/posts/' + tarjeta.id,
        method: 'PATCH',
        data: { estado: 'Inactiva' },
        success: function () {
          $(`#estado-${id}`)
            .removeClass('bg-success')
            .addClass('bg-secondary')
            .text('Inactiva');
        },
        error: function () {
          alert('Error simulando bloqueo de tarjeta');
        }
      });
    }
  });
});
