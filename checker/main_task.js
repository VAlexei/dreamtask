Vue.component("main-task", {
  props: {
    idtab: Number,
  },
  data: function () {
    return {
      //массив больших задач
      maintasks: [],
      //опция для хранения вводимого пользователем названия задачи
      newMtask: "",
      //адишник последней большой задачи
      idMTaskStor: "",
      open: [],
      //свойство с моим именем-пригодиться
      myNameIS: "!",
      //свойство для показа кнопки удалить вкладку
      deltabshow: 0,
      //свойство для показа верхнего поля ввода большой задачи
      adduptask: 0,
      //свойство для общих процентов выполнения всех задач во вкладке
      procmt: "1",
      //свойство для отправки сигнала в tab-eff меняется когда кто-то чекает з. или подз..
      change: false,
      //Свойство для открытия и закрытия общей эффективности
      effwatch: false,
      energy: 0,
      //свойство для хранения массива подзадач при дублировании
      oldtsks: [],
    };
  },

  //Сначала загружаем из ЛС массив больших задач
  mounted: function () {
    if (localStorage.getItem(this.idtab + "maintasks")) {
      try {
        this.maintasks = JSON.parse(
          localStorage.getItem(this.idtab + "maintasks")
        );
      } catch (e) {
        console.error();
      }
    }
    //и номер последней добавленной большой задачи
    if (localStorage.getItem(this.idtab + "idMTaskStor")) {
      try {
        this.idMTaskStor = JSON.parse(
          localStorage.getItem(this.idtab + "idMTaskStor")
        );
      } catch (e) {
        console.error();
      }
    } else {
      this.idMTaskStor = 0;
    }
    //Также создадим в ЛС переменную с именем текущего пользователя(задел на будущее)
    //потом эту переменную нужно будет завязать на авторизацию
    localStorage.setItem("MyNameIS", "!");
    this.myNameIS = localStorage.getItem("MyNameIS");
  },

  methods: {
    sendDelTabTask() {
      this.$emit("numdeltab", this.idtab);
    },
    effchange() {
      this.change = !this.change;
      console.log("effchange:" + this.change);
    },
    //Метод для смены значка энергии..получает проценты по эмету из tab_eff
    effprocenergy(x) {
      console.log("effprocenergy:" + x);
      switch (x) {
        case 0:
          this.energy = 0;
          break;
        case 1:
          this.energy = 1;
          break;
        case 2:
          this.energy = 2;
          break;
        case 3:
          this.energy = 3;
          break;
        case 4:
          this.energy = 4;
          break;
        default:
          this.energy = 0;
      }
    },

    newFons(fonsave) {
      //   if (localStorage.getItem('checkerfon')) {
      //   try {
      //     var fonsnow = JSON.parse(localStorage.getItem('checkerfon'));
      //   } catch(e) {
      //     console.error();
      //   }
      // }
      console.log("foninmain" + fonsave);

      this.$emit("mainfon", fonsave);
    },

    //метод для сохранения массива  задач maintasks в локал сторадж
    saveMainTask: function () {
      const parsMTasks = JSON.stringify(this.maintasks);
      localStorage.setItem(this.idtab + "maintasks", parsMTasks);
    },

    //метод добавления новой большой задачи
    addMainTask: function () {
      // убедимся, что было что-либо введено
      if (!this.newMtask) {
        return;
      }
      var newid = this.idMTaskStor + 1;
      // this.maintasks.push({idmtask: newid, name: this.newMtask, open: true, full: false});
      this.maintasks.unshift({
        idmtask: newid,
        name: this.newMtask,
        open: true,
        full: false,
      });
      this.newMtask = "";
      //созраняем новый последний айдишник большой задачи в этой вкладке в свойстве idMTaskStor
      this.idMTaskStor = newid;
      //Запускаем пересчет общей эффективности
      this.change = !this.change;
      //сохраняем большие задачи в локал сторадж
      this.saveMainTask();
      //сохраняем айдишник новой задачи в ЛС
      localStorage.setItem(this.idtab + "idMTaskStor", this.idMTaskStor);
    },
    //метод добавления новой большой задачи снизу
    addMainTaskDown: function () {
      // убедимся, что было что-либо введено
      if (!this.newMtask) {
        return;
      }
      var newid = this.idMTaskStor + 1;
      this.maintasks.push({
        idmtask: newid,
        name: this.newMtask,
        open: true,
        full: false,
      });
      // this.maintasks.unshift({idmtask: newid, name: this.newMtask, open: true, full: false});
      this.newMtask = "";
      //созраняем новый последний айдишник большой задачи в этой вкладке в свойстве idMTaskStor
      this.idMTaskStor = newid;
      //Запускаем пересчет общей эффективности
      this.change = !this.change;
      //сохраняем большие задачи в локал сторадж
      this.saveMainTask();
      //сохраняем айдишник новой задачи в ЛС
      localStorage.setItem(this.idtab + "idMTaskStor", this.idMTaskStor);
    },
    //###################УДАЛЕНИЕ БОЛЬШИХ ЗАДАЧ#################################
    //Общий метод для удаления ,больших задач (везде)
    removeMainTask(tnum) {
      console.log("Номер БЗ: " + tnum);
      // this.maintasks.splice(tnum, 1);
      this.maintasks = this.maintasks.filter((item) => item.idmtask !== tnum);
      //Запускаем пересчет общей эффективности
      this.change = !this.change;
      this.saveMainTask();

      var audio = new Audio("/checker/sound/bankai_kuchiki.mp3");
      audio.play();
    },
    //Метод для поднятия БЗ получает id большой задачи по эмету из p_bars
    sendidupmt(mtnum) {
      console.log("Поднимаем БЗ с id! " + mtnum);
      if (this.maintasks[0].idmtask != mtnum) {
        var s = 0;
        while (this.maintasks[s].idmtask != mtnum) {
          s++;
        }
        console.log("Поднимаем элемент maintasks № " + s);
        var arr = this.maintasks;
        arr[s - 1] = [arr[s], (arr[s] = arr[s - 1])][0];
        this.maintasks = arr;
        //След 2 строчки чтобы показать вью , что массив изменился
        //можно будет заменить на что-то более адекватное
        this.maintasks[s].full = !this.maintasks[s].full;
        this.maintasks[s].full = !this.maintasks[s].full;
        this.saveMainTask();
      }
    },
    //Метод для спуска БЗ получает id большой задачи по эмету из p_bars
    sendiddownmt(mtnum) {
      var s = 0;
      while (this.maintasks[s].idmtask != mtnum) {
        s++;
      }
      console.log("Элемент s: " + mtnum);
      if (s != this.maintasks.length - 1) {
        console.log("Спускаем элемент maintasks № " + s);
        var arr = this.maintasks;
        arr[s + 1] = [arr[s], (arr[s] = arr[s + 1])][0];
        this.maintasks = arr;
        //След 2 строчки чтобы показать вью , что массив изменился
        //можно будет заменить на что-то более адекватное
        this.maintasks[s].full = !this.maintasks[s].full;
        this.maintasks[s].full = !this.maintasks[s].full;
        this.saveMainTask();
      }
    },
    //Метод для дублирования больших задач(только имен)
    sendmnaruto(mtnum) {
      console.log("sendmnaruto" + mtnum);
      console.log("Вкладка №" + this.idtab);
      //Здесь нужно дописать код для дублирования
      //1 знаем номер последней задачи
      var lustmt = this.idMTaskStor + 1;
      for (var k = 0; k < this.maintasks.length; k++) {
        if (this.maintasks[k].idmtask == mtnum) {
          console.log("БИНГО2 " + mtnum);
          var lustmt = this.idMTaskStor;
          this.maintasks.splice(k + 1, 0, {
            idmtask: lustmt + 1,
            name: this.maintasks[k].name,
            open: true,
            full: false,
          });

          //так же дублируем все подзадачи
          var oldtasksname = this.idtab + "tasks" + mtnum;
          this.oldtsks = JSON.parse(localStorage.getItem(oldtasksname));
          for (var z = 0; z < this.oldtsks.length; z++) {
            this.oldtsks[z].inwrk = false;
            this.oldtsks[z].whoinwork = "";
            this.oldtsks[z].check = false;
          }
          var oldtsk = JSON.stringify(this.oldtsks);
          var newtskname = this.idtab + "tasks" + (lustmt + 1);
          localStorage.setItem(newtskname, oldtsk);

          var audio = new Audio("/checker/sound/kakashi.mp3");
          audio.play();
          // this.maintasks[k].open = !this.maintasks[k].open;
          //и сохраняем в ЛС
          this.idMTaskStor = lustmt + 1;
          var idMTaskStor = this.idtab + "idMTaskStor";
          localStorage.setItem(idMTaskStor, this.idMTaskStor);
          this.saveMainTask();
        }
      }
    },

    //####################Запоминаем какие задачи были закрыты .open##################################
    changeOpenTask(tnum) {
      for (var k = 0; k < this.maintasks.length; k++) {
        if (this.maintasks[k].idmtask == tnum) {
          console.log("БИНГО!!! " + tnum);
          this.maintasks[k].open = !this.maintasks[k].open;
          //и сохраняем в ЛС
          this.saveMainTask();
        }
      }
      console.log("Номер open БЗ: " + tnum);
    },
    //######################################################
    numFullchange(tnum) {
      console.log(tnum);
      for (var k = 0; k < this.maintasks.length; k++) {
        if (this.maintasks[k].idmtask == tnum) {
          console.log("БИНГО!!! " + tnum);
          this.maintasks[k].full = !this.maintasks[k].full;
          //и сохраняем в ЛС
          this.saveMainTask();
        }
      }
    },
  },
  // computed:{

  // },
  template: `

    <div id="app1">
          <div class="row navbar navbar-expand-lg navbar-light bg-light justify-content-between  border_up" style="padding: 1vh">
              <div class="col-sm-8">

                <div class="row justify-content-between">
                  <div class="col-md-5 col-lg-3">

                    <!-- Кнопка сворачивания/разворачивания инпута добавления задачи -->
                   <button class="btn btn-light" v-on:click="adduptask = !adduptask">
                    <i v-show="!adduptask" class="fa fa-plus-circle gray fa-2x" aria-hidden="true"></i>
                    <i v-show="adduptask" class="fa fa-minus-circle gray fa-2x" aria-hidden="true"></i>
                   </button>

                <!-- Кнопка показа общей эффективности -->
                    <button class="btn btn-light" v-on:click="effwatch = !effwatch">
                          <i v-show="this.energy == 0" class="fa fa-battery-0 gray fa-2x" aria-hidden="true"></i>
                          <i v-show="this.energy == 1" class="fa fa-battery-1 gray fa-2x" aria-hidden="true"></i>
                          <i v-show="this.energy == 2" class="fa fa-battery-2 gray fa-2x" aria-hidden="true"></i>
                          <i v-show="this.energy == 3" class="fa fa-battery-3 gray fa-2x" aria-hidden="true"></i>
                          <i v-show="this.energy == 4" class="fa fa-battery-4 gray fa-2x" aria-hidden="true"></i>
                    </button> 

                  </div>
   
                </div>
                               
              </div>
              <div id="menu1" class="col-sm-3 col-md-2" style="padding-left: 5vw">
                      <button v-show="deltabshow" class="btn btn-outline-danger" v-on:click="sendDelTabTask(this.idtab)" style="padding-left: 1vh">
                      <i class="fa fa-trash-o" aria-hidden="true"></i> ВКЛАДКУ! 
                      </button>

            <fon-menu @newfon="newFons"></fon-menu>



              </div>
             <div class="col-sm-1 col-md-1" style="margin-right: 1vw">
                        <button class="btn btn-outline-secondary" v-on:click="deltabshow = !deltabshow">
                        <i class="fa fa-bars fa-2x" aria-hidden="true"></i>
                        </button>
              </div>
          </div>

                <div class="col-md-12 col-lg-12">

                      <!-- сообщение об общей эффективности вкладки -->  
                      <div class="row justify-content-center"> 
                        <tab_eff v-show="effwatch" @effprocenergy="effprocenergy" v-bind:idtab="this.idtab" v-bind:change="this.change">
                        </tab_eff>
                      </div>
                  
                      <!-- верхняя форма добавления больших задач скрытая или нет-->  
                      <div v-show="adduptask" class="input-group">
                       <input type="text" class="form-control" placeholder="" v-model="newMtask" @keyup.enter="addMainTask">
                        <div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button" v-on:click="addMainTask">+ ЗАДАЧА</button>
                        </div>
                      </div>
                </div>


      <task-progressbar v-for="(maintask, n) in maintasks" :key="maintask.idmtask" v-bind:idtab="idtab" v-bind:mtnum="maintask.idmtask" v-bind:mtname="maintask.name" v-bind:mtfull="maintask.full" @sendmnaruto="sendmnaruto" @sendidupmt="sendidupmt" @sendiddownmt="sendiddownmt" @numremovemtask="removeMainTask" @numchangeopentask="changeOpenTask" @changefullmt="numFullchange" @effchangebar="effchange()" v-bind:openum="maintask.open" style="padding-top: 1vh" ></task-progressbar>

         <!-- <input class="form-control" size="47" maxlength="47" style="width: 38vw" type="text" v-model="newMtask" @keyup.enter="addMainTask">
          <button class="btn btn-outline-secondary" v-on:click="addMainTask">+ НОВАЯ ЗАДАЧА!</button> -->
          <hr>

              <div v-show="!adduptask" class="col-sm-12">
                   <div  class="input-group" >
                    <input type="text" class="form-control" placeholder="" v-model="newMtask" @keyup.enter="addMainTaskDown">
                    <div class="input-group-append">
                      <button class="btn btn-outline-secondary" type="button" v-on:click="addMainTaskDown">+ ЗАДАЧА</button>
                    </div>
                  </div>
              </div>
    
    </div>
  `,
});
