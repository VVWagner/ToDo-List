//                                Отправляет данные в PHP для ДОБАВЛЕНИЯ в БД при нажатии на кнопку ADD

function sendToBase() {
  let url = "insert/";

  let task_text = $("#task").val(); // Сокращение от document.getElementById(id).value
  console.log(task_text);
  $.post( url, JSON.stringify({ text:  task_text}), function( data ) {
      console.log( "Data from server: " + data);
      
      $("#task").val('');

    $('#submit').attr('disabled', true);

      addToTable(data, task_text, '', null);
    }, "json")
    .fail(function() {
      console.log( "Failed"); 
      $("#task").val(task_text);
    });
}

//                                Отправляет данные в PHP для УДАЛЕНИЯ из БД при нажатии на кнопку DELETE

function deleteFromBase(varId) {
  $('#delete' + varId).prop('disabled', true);

  $.ajax({
    url: "delete/",
    type: 'DELETE',
    data: JSON.stringify({ id: varId}),
    success: function() {
      $('#' + varId).remove();
      console.log("Успешно");
    },
    error: function() {
      $('#delete' + varId).prop('disabled', false);
      console.log("Ошибка");
    }
});
}

//                                Отправляет данные в PHP для ИЗМЕНЕНИЯ текста задачи в БД при нажатии на кнопку SAVE

function updateText(varId) {
  
  var url = "update/text/";

  var task_text = $("li[id='" + varId + "'] #new").val();
    
  $.post( url, JSON.stringify({ id: varId, text:  task_text}), function() {
      $("li[id='" + varId + "'] label").text(task_text);
      $("li[id='" + varId + "'] #save" + varId).prop('style', 'display:none;');
      $("li[id='" + varId + "'] #cancel" + varId).prop('style', 'display:none;');
      $("li[id='" + varId + "'] #new").prop('style', 'display:none;');

      $("li[id='" + varId + "'] #edit" + varId).prop('style', 'display: inline!important');
      $("li[id='" + varId + "'] label").prop('style', '');
      $('#plus' + varId).prop('style', 'display: inline!important');
      $('.col' + varId).prop('style', 'width: 12%;');
      console.log("Изменено");
    })
    .fail(function() {
      console.log("Ошибка");
    });
}

//                                Отправляет данные в PHP для ИЗМЕНЕНИЯ состояния чекбокса в БД при нажатии на ЧЕКБОКС

function updateCheckbox(varId) {

  $('#chk' + varId).prop('disabled', true); 
  console.log("Значение чекбокса " + varId  + " изменилось");
  var currCheck = $('#chk' + varId).prop('checked');
  var url = "update/checkbox/";
  
  $.post( url, JSON.stringify({ id: varId, checkboxStatus: currCheck }), function() { 
      $('#chk' + varId).prop('disabled', false);
    })
    .fail(function() {
      console.log( "Failed"); 
      $('#chk' + varId).prop('checked', !currCheck); 
    });
}

//                                 Отправляет запрос 

$(document).ready(function() { // Скрипт, который выполняется после загрузки страницы
  $("#task").keyup(function(event){
    if(event.keyCode == 13){   //Выполняет запрос при нажатии на Enter
        $("#submit").click();
    }
  });
  $('.container').fadeIn(1000); // Плавное появление контейнера
  $.ajax({
    url: "get/",
    type: 'GET',
    success: function(result) {
      var json_result = JSON.parse(result);
      console.log(json_result);
      for(var element of json_result) {
        checked = '';
        if (element['checkbox'] == 't') { // По умолчанию 'checked' равен пустой строке, а если равен 't', то принимает значение 'checked'
          checked = 'checked';
        }
        addToTable(element['id'], element['task'], checked, element['parent_id']);
        /*if(element['parent_id'] !== null) {
          addToParent(element['lists_id'], element['lists_name'], checked, element['parent_id']);
        } else {
          addToTable(element['lists_id'], element['lists_name'], checked); // Вызывает функцию addToTable
        }*/
      }
    }
  });
});

// ------------------------------------------------------------------------------------------------------------------------------------------------------- //

//                                "Рисует" таблицу

function addToTable(varId, task_text, checked, parent_id) {
  var selector;
  // var parent;
  if (parent_id == null) {
    selector = '#ul_id li:last';
    // parent = '';
  } else {
    selector = "#ul_id li[id='" + parent_id + "']";
    // parent = 'parent';
  }
  $(selector).after(
    "<li id='" + varId + "'>" + 
      "<div class='row'>"+
          "<div class='col'>" +
            "<input type='checkbox' " + checked + " id='chk" + varId + "'onchange='updateCheckbox(" + varId + ")'>" +
          "</div>" +

          "<div class='col-7'>" +
            "<label id='label" + varId + "' for='chk" + varId + "'>" + task_text + "</label>" + 
            "<input type='text' id='new' style='display:none;'>" +
          "</div>" +

          "<div class='btns col-2 col" + varId + "'>" +

            "<button class='btn btn-success save' style='display:none;' id='save" + varId + "' onclick='updateText(" + varId + ")'>" +
              "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-check2-all' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M12.354 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z'/><path d='M6.25 8.043l-.896-.897a.5.5 0 1 0-.708.708l.897.896.707-.707zm1 2.414l.896.897a.5.5 0 0 0 .708 0l7-7a.5.5 0 0 0-.708-.708L8.5 10.293l-.543-.543-.707.707z'/></svg>" +
            "</button>" +

            "<button class='btn btn-warning cancel' style='display:none;' id='cancel" + varId + "' onclick='cancelEdit(" + varId + ")'>" + 
            "<svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' fill='currentColor' class='bi bi-x-circle' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z'/><path fill-rule='evenodd' d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z'/></svg>" +
            "</button>" +
        
            // "<button class='btn btn-success plus' id='plus" + varId + "' onclick='addSubtask(" + varId + ")'>" + 
            //   "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-plus-circle' viewBox='0 0 16 16'><path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z'/><path d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z'/></svg>" + 
            // "</button>" + 
        
            "<button class='btn btn-primary edit' id='edit" + varId + "' onclick='editTask(" + varId + ")'>" + 
              "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-pencil' viewBox='0 0 16 16'><path d='M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z'/></svg>" + 
            "</button>" + 
          
            "<button class='btn btn-danger delete' id='delete" + varId + "' onclick='deleteFromBase(" + varId + ")'>" + 
              "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/><path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/></svg>" +  
            "</button>" +

            "<button class='btn btn-dark' id='setting" + varId + "' style='display:none;' onclick='openButtons(" + varId + ")'>" + 
              "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-gear-fill' viewBox='0 0 16 16'><path d='M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z'/></svg>" +
            "</button>" +

          "</div>" +
      "</div>" +
    "</li>"
    );
}


// ------------------------------------------------------------------------------------------------------------------------------------------------------- //


//                                Скрывает элемент label и кнопку EDIT. Показывает Input, кнопки Save и Cancel
function editTask(varId) {
  $('#label' + varId).prop('style', 'display: none;');
  $('#plus' + varId).prop('style', 'display: none;');
  console.log("Редактировать");
  labelText = $('#label' + varId).text();
  $("li[id='" + varId + "'] input").prop('style', '');
  $("li[id='" + varId + "'] input").val(labelText);
  $("li[id='" + varId + "'] input").focus();
  $('#edit' + varId).prop('style', 'display: none;');
  $('#save' + varId).prop('style', '');
  $('#cancel' + varId).prop('style', '');
  $('.col' + varId).prop('style', 'width: 16%;');
}

//                                Добавляет новый input и кнопку для создания подзадачи

// function addSubtask(varId) {
//   $('#plus' + varId).prop('style', 'display: none;');
//   $('#edit' + varId).prop('style', 'display: none;');
//   console.log("Добавить подзадачу");
//   $("li[id='" + varId + "'] input").prop('style', '');
//   $('#cancel' + varId).prop('style', '');
//   $('#save' + varId).prop('style', '');
// }

//                                Показывает элемент label и кнопку EDIT. Скрывает Input, кнопки Save и Cancel

function cancelEdit(varId) {
  $('#label' + varId).prop('style', '');
  $('#plus' + varId).prop('style', 'display: inline!important');
  console.log("Отмена");
  $("li[id='" + varId + "'] #new").prop('style', 'display: none;');
  $('#edit' + varId).prop('style', 'display: inline!important');
  $('#save' + varId).prop('style', 'display: none;');
  $('#cancel' + varId).prop('style', 'display: none;');
  $('.col' + varId).prop('style', 'width: 12%;');
}

//                                Делает кнопку недоступной, если в Input ничего не введено

function checkParams() {
  var task = $('#task').val();
  if(task.length != 0) {
    $('#submit').removeAttr('disabled');
  } else {
    $('#submit').attr('disabled', true);
  }
}

function exit(){
  var thisWindow = window.open("/New_portfolio/src/",'_self');
  var exit = confirm("Хотите закрыть страницу?");
  if(exit){
  thisWindow.close();
  }
}


function openButtons(varId) {
  console.log('Open');
  $('#setting' + varId).prop('style', 'display: none!important;');
  $('#delete' + varId).prop('style', 'display: inline!important');
  $('#edit' + varId).prop('style', 'display: inline!important');
  $('#plus' + varId).prop('style', 'display: inline!important');
}


// window.onload = function(){
//   window.setInterval(function(){
//     $('.container').prop('style', 'display: block;');
//     var now = new Date();
//       var clock = document.getElementById("clock");
//       clock.innerHTML = now.toLocaleTimeString();
//   }, 1000);
// };

// #clock{
//   color: #177070;
//   font-weight: bold;
//   font-size: 24px;
//   text-align: end;
// }