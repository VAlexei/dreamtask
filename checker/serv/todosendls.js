//При каждом изменении в ЛС увеличиваем todovers на 1 и 
//запускаем отправку всех ЛС на сервер для обновления остальных устройств
var todovers = localStorage.getItem('todovers');
todovers = todovers++;
localStorage.setItem('todovers', todovers);

var datals = JSON.stringify(localStorage);
//console.log(data);
$.ajax({
  type: 'POST',
  url: '/checker/serv/todosendls.php',
  data: {
    'localStorage': datals,
    'todovers': todovers
  },
  dataType: 'json',
  success: function(data, textStatus){
    alert(data.my_over_status);

  }
});