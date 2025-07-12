const token = localStorage.getItem('token');
const API_URL = 'http://localhost:4545/tareas';
let todasLasTareas = [];
let tareaEditando = null;

if (!token) {
  alert('Debes iniciar sesión');
  window.location.href = 'login.html';
}

$(document).ready(function() {
  cargarTareas();
  configurarEventos();
});

$('#logout-btn').click(function () {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
});


function configurarEventos() {
  $('#form-tarea').submit(manejarEnvioFormulario);

  $('#filtro-prioridad, #filtro-estado, #filtro-fecha').change(aplicarFiltros);
  $('#btn-limpiar').click(limpiarFiltros);
  

  $(document).on('click', '.btn-editar', manejarEdicion);
  $(document).on('click', '.btn-eliminar', manejarEliminacion);
  $(document).on('change', '.completada-checkbox', manejarEstado);
}

function cargarTareas() {
  $.ajax({
    url: API_URL,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    success: function(tareas) {
      todasLasTareas = tareas;
      mostrarTareas(todasLasTareas);
    },
    error: function(xhr) {
      mostrarError(xhr.responseJSON?.error || 'Error al cargar tareas');
    }
  });
}

function crearTarea(tareaData) {
  $.ajax({
    url: API_URL,
    method: 'POST',
    headers: {  // 👈 AÑADE ESTA PARTE
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    contentType: 'application/json',
    data: JSON.stringify({ ...tareaData, completada: false }),
    success: function(tarea) {
      todasLasTareas.push(tarea);
      mostrarTareas(todasLasTareas);
      resetearFormulario();
      mostrarMensaje('Tarea creada exitosamente');
    },
    error: function(xhr) {
      mostrarError(xhr.responseJSON?.error || 'Error al crear tarea');
    }
  });
}

function mostrarTareas(tareas) {
  const $lista = $('#lista-tareas').empty();
  
  if (tareas.length === 0) {
    $lista.append('<p class="no-tareas">No hay tareas que mostrar</p>');
    return;
  }

  tareas.forEach(tarea => {
    $lista.append(crearElementoTarea(tarea));
  });
}

function crearElementoTarea(tarea) {
  const fecha = tarea.fechaVencimiento 
    ? new Date(tarea.fechaVencimiento).toLocaleDateString() 
    : 'Sin fecha';
  
  const estaVencida = tarea.fechaVencimiento && new Date(tarea.fechaVencimiento) < new Date();
  
  return $(`
    <div class="tarea ${tarea.completada ? 'completada' : ''} ${estaVencida && !tarea.completada ? 'vencida' : ''}" data-id="${tarea._id}">
      <div class="tarea-header">
        <div class="flx-row-btw">
          <h3>${tarea.titulo}</h3>
          <label class="completada-label flx-row-ar">
          ${tarea.completada ? 'Completada':'Pendiente'}
            <input type="checkbox" class="completada-checkbox" ${tarea.completada ? 'checked' : ''}>
          </label>
        </div>
        <div class="tarea-acciones">
        </div>
        </div>
        
        <div class="flx-row-stw">
        <span>
          ${tarea.descripcion ? `<p class="descripcion">${tarea.descripcion}</p>` : ''}
          <div class="tarea-info">
            <p><strong>Prioridad: <span class="prioridad ${tarea.prioridad}">${tarea.prioridad || 'media'}</strong></span></p>
            <p><strong>Fecha límite:</strong> <span class="fecha">${fecha}</span></p>
          </div>
        </span>
        <div class="flx-column">
          <button class="btn-editar">✏️ Editar</button>
          <button class="btn-eliminar">🗑️ Eliminar</button>
        </div>
          </div>
          </div>
  `);
}

function manejarEnvioFormulario(e) {
  e.preventDefault();
  
  const tareaData = {
    titulo: $('#titulo').val().trim(),
    descripcion: $('#descripcion').val().trim(),
    prioridad: $('#prioridad').val(),
    fechaVencimiento: $('#fecha').val()
  };

  if (!tareaData.titulo) {
    mostrarError('El título es requerido');
    return;
  }

  if (tareaEditando) {
    actualizarTarea(tareaEditando._id, tareaData);
  } else {
    crearTarea(tareaData);
  }
}

function actualizarTarea(id, tareaData) {
  $.ajax({
     url: `${API_URL}/${id}`,
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    contentType: 'application/json',
    data: JSON.stringify(tareaData),
    success: function(tareaActualizada) {
      const index = todasLasTareas.findIndex(t => t._id === id);
      if (index !== -1) {
        todasLasTareas[index] = tareaActualizada;
      }
      mostrarTareas(todasLasTareas);
      resetearFormulario();
      mostrarMensaje('Tarea actualizada exitosamente');
    },
    error: function(xhr) {
      mostrarError(xhr.responseJSON?.error || 'Error al actualizar tarea');
    }
  });
}

function manejarEdicion() {
  const id = $(this).closest('.tarea').data('id');
  tareaEditando = todasLasTareas.find(t => t._id === id);
  
  if (tareaEditando) {
    $('#tarea-id').val(tareaEditando._id);
    $('#titulo').val(tareaEditando.titulo);
    $('#descripcion').val(tareaEditando.descripcion || '');
    $('#prioridad').val(tareaEditando.prioridad || 'media');
    $('#fecha').val(tareaEditando.fechaVencimiento ? tareaEditando.fechaVencimiento.split('T')[0] : '');
    
    $('#btn-crear').hide();
    $('#btn-actualizar').show();
    $('#btn-cancelar').show();
    
    $('html, body').animate({ scrollTop: 0 }, 500);
  }
}

function manejarEliminacion() {
  const id = $(this).closest('.tarea').data('id');
  
  if (confirm('¿Estás seguro de eliminar esta tarea?')) {
    $.ajax({
      url: `${API_URL}/${id}`,
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      success: function() {
        todasLasTareas = todasLasTareas.filter(t => t._id !== id);
        mostrarTareas(todasLasTareas);
        mostrarMensaje('Tarea eliminada exitosamente');
      },
      error: function(xhr) {
        mostrarError(xhr.responseJSON?.error || 'Error al eliminar tarea');
      }
    });
  }
}

function manejarEstado() {
  const $checkbox = $(this);
  const id = $checkbox.closest('.tarea').data('id');
  const completada = $checkbox.is(':checked');
  
  $.ajax({
    url: `${API_URL}/${id}`,
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    contentType: 'application/json',
    data: JSON.stringify({ completada }),
    success: function() {
      const tarea = todasLasTareas.find(t => t._id === id);
      if (tarea) tarea.completada = completada;
      aplicarFiltros();
    },
    error: function() {
      $checkbox.prop('checked', !completada);
      mostrarError('Error actualizando estado');
    }
  });
}

function resetearFormulario() {
  tareaEditando = null;
  $('#form-tarea')[0].reset();
  $('#tarea-id').val('');
  $('#btn-crear').show();
  $('#btn-actualizar').hide();
  $('#btn-cancelar').hide();
}

function aplicarFiltros() {
  const prioridad = $('#filtro-prioridad').val();
  const estado = $('#filtro-estado').val();
  const fecha = $('#filtro-fecha').val();
  
  const tareasFiltradas = todasLasTareas.filter(tarea => {
    // Filtro por prioridad
    if (prioridad && tarea.prioridad !== prioridad) return false;
    
    // Filtro por estado
    if (estado === 'completadas' && !tarea.completada) return false;
    if (estado === 'pendientes' && tarea.completada) return false;
    
    // Filtro por fecha
    if (fecha && tarea.fechaVencimiento) {
      const hoy = new Date().setHours(0, 0, 0, 0);
      const fechaTarea = new Date(tarea.fechaVencimiento).setHours(0, 0, 0, 0);
      
      switch (fecha) {
        case 'hoy': if (fechaTarea !== hoy) return false; break;
        case 'semana':
          const finSemana = hoy + (6 * 24 * 60 * 60 * 1000);
          if (fechaTarea < hoy || fechaTarea > finSemana) return false;
          break;
        case 'mes':
          const finMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).setHours(0, 0, 0, 0);
          if (fechaTarea < hoy || fechaTarea > finMes) return false;
          break;
        case 'vencidas':
          if (fechaTarea >= hoy || tarea.completada) return false;
          break;
      }
    }
    
    return true;
  });
  
  mostrarTareas(tareasFiltradas);
}

function limpiarFiltros() {
  $('#filtro-prioridad, #filtro-estado, #filtro-fecha').val('');
  mostrarTareas(todasLasTareas);
}

function mostrarError(mensaje) {
  console.error('Error:', mensaje);
  alert(`Error: ${mensaje}`);
}

function mostrarMensaje(mensaje) {
  console.log(mensaje);
}