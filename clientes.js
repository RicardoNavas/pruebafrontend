$(document).ready(function () {
  const tarjetasPorCliente = {};
  const LS_KEY = 'clientes_cardtech';

  function obtenerClientes() {
    const data = localStorage.getItem(LS_KEY);
    return data ? JSON.parse(data) : [];
  }

  function guardarClientes(clientes) {
    localStorage.setItem(LS_KEY, JSON.stringify(clientes));
  }

  function generarTarjetas(cantidad) {
    const marcas = ['Visa', 'MasterCard', 'Amex'];
    const tarjetas = [];
    for (let i = 0; i < cantidad; i++) {
      tarjetas.push({
        id: i + 1,
        numero: '**** **** **** ' + Math.floor(1000 + Math.random() * 9000),
        marca: marcas[Math.floor(Math.random() * marcas.length)],
        estado: 'Activo'
      });
    }
    return tarjetas;
  }

  function renderClientes() {
    $('#clientes-body').empty();
    const clientes = obtenerClientes();
    clientes.forEach((cliente, index) => {
      const fila = `
        <tr>
          <td>${cliente.nombre}</td>
          <td>${cliente.email}</td>
          <td>${cliente.tarjetas.length}</td>
          <td><span class="badge bg-${cliente.estado === 'Activo' ? 'success' : 'secondary'}">${cliente.estado}</span></td>
          <td>
            <button class="btn btn-sm btn-primary ver-detalles"
              data-id="${index}"
              data-nombre="${cliente.nombre}"
              data-email="${cliente.email}"
              data-tarjetas="${cliente.tarjetas.length}"
              data-estado="${cliente.estado}"
              data-telefono="${cliente.telefono}"
              data-direccion="${cliente.direccion || 'No disponible'}">
              Ver Detalles
            </button>
          </td>
        </tr>
      `;
      $('#clientes-body').append(fila);
    });
  }

  // Cargar clientes del localStorage al iniciar
  renderClientes();

  // Manejar envío del formulario
  $('#form-cliente').on('submit', function (e) {
    e.preventDefault();

    const nombre = $('#nombre').val().trim();
    const email = $('#email').val().trim();
    const telefono = $('#telefono').val().trim();

    if (!nombre || !email || !telefono) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const nuevoCliente = {
      nombre,
      email,
      telefono,
      direccion: 'No disponible',
      estado: 'Activo',
      tarjetas: generarTarjetas(Math.floor(Math.random() * 5) + 1)
    };

    const clientes = obtenerClientes();
    clientes.push(nuevoCliente);
    guardarClientes(clientes);
    renderClientes();
    $('#form-cliente')[0].reset();
  });

  // Mostrar detalles
  $(document).on('click', '.ver-detalles', function () {
    const btn = $(this);
    const id = btn.data('id');
    const clientes = obtenerClientes();
    const cliente = clientes[id];

    $('#detalle-nombre').text(cliente.nombre);
    $('#detalle-email').text(cliente.email);
    $('#detalle-tarjeta').text(cliente.tarjetas.length);
    $('#detalle-estado').text(cliente.estado);
    $('#detalle-telefono').text(cliente.telefono);
    $('#detalle-direccion').text(cliente.direccion);

    window._tarjetasCliente = cliente.tarjetas;

    let htmlTarjetas = '';
    cliente.tarjetas.forEach((t, i) => {
      htmlTarjetas += `
        <tr>
          <td>${t.numero}</td>
          <td>${t.marca}</td>
          <td><span class="badge ${t.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}" id="estado-${i}">${t.estado}</span></td>
          <td>
            <button class="btn btn-sm btn-danger bloquear-btn" data-id="${i}" data-cliente="${id}">Bloquear</button>
          </td>
        </tr>
      `;
    });

    $('#detalle-tarjetas-body').html(htmlTarjetas);
    new bootstrap.Modal(document.getElementById('modalDetalles')).show();
  });

  // Bloquear tarjeta
  $(document).on('click', '.bloquear-btn', function () {
    const idTarjeta = $(this).data('id');
    const idCliente = $(this).data('cliente');

    const clientes = obtenerClientes();
    const tarjeta = clientes[idCliente].tarjetas[idTarjeta];

    if (tarjeta.estado === 'Inactiva') {
      alert('Esta tarjeta ya está bloqueada.');
      return;
    }

    if (confirm(`¿Seguro que deseas bloquear la tarjeta ${tarjeta.numero}?`)) {
      tarjeta.estado = 'Inactiva';
      guardarClientes(clientes);

      $(`#estado-${idTarjeta}`)
        .removeClass('bg-success')
        .addClass('bg-secondary')
        .text('Inactiva');
    }
  });
});
