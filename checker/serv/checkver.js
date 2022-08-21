//отправляем(каждые три секунды) на сервер номер текущей версии ЛС
//для проверки наличия обновлений
var todovers = localStorage.getItem('todovers');
$.ajax({
  type: 'POST',
  url: '/checker/serv/checkver.php',
  data: {
    'todovers': todovers
  },
  dataType: 'json',
  success: function(checkver){
    if (checkver != "ok" && checkver != ""){
      //тут удаляем существующие ls
      localStorage.clear();
      //и распарсиваем в них новые, пришедшие с сервера
        var newls = JSON.parse(checkver);
        for (var t = 0; t < newls.length; t++) {
          localStorage.setItem(newls[i][0], newls[i][1]);
        }
    }
  }
});