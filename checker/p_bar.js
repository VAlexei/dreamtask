Vue.component("task-progressbar", {
  props: {
    //id вкладки
    idtab: Number,
    //id большой задачи
    mtnum: Number,
    //Имя большой задачи
    mtname: String,
    //Открыт  ли блок с подзадачами
    openum: Boolean,
    mtfull: Boolean,
    procmt: Number,
  },

  data: function () {
    return {
      //массив подзадач и их отметок о выполнении
      tasks: [],
      //св-во в которое попадают новые подзадачи
      newtask: "",
      //свойство с моим именем(текущего пользователя для отметок inwork)
      whoinwrk: "",
      //св-ва для отображения классов цвета прогрессбара
      danger: 0,
      success: 0,
      //свойство которое будет тру когда sum = 100 чтобы заменить главный чекер дублером
      fullsum: 0,
      //свойство чтобы сделать серыми все подзадачи если нажали чек возле имени большой задачи
      fullcheck: 0,
      //свойство для открытия закрытия кнопок для подзадач
      openmenu: "",
      //свойство для редактирования подзадач
      edit: 0,
    };
  },
  //Сначала загружаем все имеющиеся в ЛС данные о подзадачах и их метках (*tasks*)
  mounted: function () {
    var tasks1 = this.idtab + "tasks" + this.mtnum;

    if (localStorage.getItem(tasks1)) {
      try {
        this.tasks = JSON.parse(localStorage.getItem(tasks1));
      } catch (e) {
        console.error();
      }
    }
  },
  //Отслеживаем изменения меток и сразу обновляем их массив в ЛС
  watch: {
    tasks: function () {
      this.saveTask();
      //Отправляем сигнал на пересчет общей эффективности тк количество подзадач увеличилось
      this.$emit("effchangebar", 1);
    },

    //Отслеживаем изменение процентов вып задач.,чтобы вовремя послать сигнал на пересчет общей эффективности
    sumPbar: function () {
      console.log("Чекнут какой-то чекер!!!");

      //Попробуем добывить звук колокольчика
      var audio_din = new Audio("checker/sound/din3.mp3");
      audio_din.play();

      this.$emit("effchangebar", 1);
    },
  },

  methods: {
    //метод для сохранения массива  задач tasks в локал сторадж
    //он же вызывается при изменения отметок в массиве (tasks.check)
    saveTask() {
      var tasks1 = this.idtab + "tasks" + this.mtnum;
      const parsedTasks = JSON.stringify(this.tasks);
      localStorage.setItem(tasks1, parsedTasks);
    },
    //методы для добавления и удаления задач в tasks
    addTask: function () {
      // убедиться, что было что-либо введено
      if (!this.newtask) {
        return;
      }
      this.tasks.push({
        name: this.newtask,
        inwrk: false,
        whoinwork: "",
        check: false,
        men: false,
        red: false,
      });
      this.newtask = "";
      //сохраняем задачи в локал сторадж
      this.saveTask();
    },
    //Общий метод для установки отметок "в работе"
    inWork(x) {
      //получим ник текущего пользователя
      this.whoinwrk = localStorage.getItem("MyNameIS");
      //обратим значение отметки "в работе" в соответствующей подзадаче в массиве tasks
      this.tasks[x].inwrk = !this.tasks[x].inwrk;
      //отобразим в кнопке "в работе" ник текущего пользователя..или уберем.
      if (this.tasks[x].inwrk == true) {
        this.tasks[x].whoinwork = this.whoinwrk;
      } else {
        this.tasks[x].whoinwork = "";
      }
      //обновим данные об этой подзадаче в ЛС
      this.saveTask();
    },
    //Метод для открытия и закрытия кнопок в подзадачах
    openmentsk(x) {
      //Обратим значение отметки "показать кнопки" в соответствующей подзадаче в массиве tasks
      this.tasks[x].men = !this.tasks[x].men;
      //обновим данные об этой подзадаче в ЛС
      this.saveTask();
    },
    //Метод для открытия редактирования подзадач
    openedittsk(x) {
      //Обратим значение отметки "показать форму редактирования" в соответствующей подзадаче в массиве tasks
      this.tasks[x].red = !this.tasks[x].red;
      //обновим данные об этой подзадаче в ЛС
      this.saveTask();
    },

    //Общий метод для удаления подзадач (везде)
    removeTask(x) {
      //заносим в переменную delel значение удаляемого элемента
      this.tasks.splice(x, 1);
      this.saveTask();
      var audio = new Audio("/checker/sound/bankai.mp3");
      audio.play();
    },
    //метод для поднятия подзадачи
    taskup(x) {
      console.log("поднять" + x);
      if (x != 0) {
        var arr = this.tasks;
        arr[x - 1] = [arr[x], (arr[x] = arr[x - 1])][0];
        this.tasks = arr;
        this.tasks[x].inwrk = !this.tasks[x].inwrk;
        this.tasks[x].inwrk = !this.tasks[x].inwrk;
        this.saveTask();
      }
    },
    //метод для спуска подзадачи
    taskdown(x) {
      console.log("спускаем" + x);
      if (x != this.tasks.length - 1) {
        var arr = this.tasks;
        arr[x + 1] = [arr[x], (arr[x] = arr[x + 1])][0];
        this.tasks = arr;
        this.tasks[x].inwrk = !this.tasks[x].inwrk;
        this.tasks[x].inwrk = !this.tasks[x].inwrk;
        this.saveTask();
      }
    },

    // arr.splice(index, 0, item);
    tasknaruto(x) {
      this.tasks.splice(x + 1, 0, {
        name: this.tasks[x].name,
        inwrk: false,
        whoinwork: "",
        check: false,
        men: false,
        red: false,
      });
      var audio = new Audio("/checker/sound/naruto.mp3");
      audio.play();
    },
    sendmnaruto(mtnum) {
      console.log("Дублируем БЗ с id №" + mtnum);
      this.$emit("sendmnaruto", this.mtnum);
      //Здесь нужно дописать код для дублирования подзадач
    },

    //###################Отправляем номер для УДАЛЕНИя БОЛЬШИХ ЗАДАЧ#################################
    sendIdRemoveMainTask(mtnum) {
      this.$emit("numremovemtask", this.mtnum);
      // console.log('Номер удаляемой БЗ: ' + mtnum);
      //и СРАЗУ удаляем соответствующие подзадачи из ЛС
      var tasks111 = this.idtab + "tasks" + this.mtnum;
      localStorage.removeItem(tasks111);
    },
    //отправляем в main_task id большо задачи, которую нужно поднять
    sendidupmt(mtnum) {
      this.$emit("sendidupmt", this.mtnum);
    },
    //отправляем в main_task id большо задачи, которую нужно поднять спустить
    sendiddownmt(mtnum) {
      this.$emit("sendiddownmt", this.mtnum);
    },

    sendIdChangeOpen(mtnum) {
      this.$emit("numchangeopentask", this.mtnum);
    },

    changeFullmtask: function (mtnum) {
      this.$emit("changefullmt", this.mtnum);
      // this.$emit('changefullmtask', this.mtnum);
    },
  },

  computed: {
    //Определяем % выполнения задачи
    sum() {
      let sum = 0;
      //получаем число отмеченных задач
      var ncheck = 0;
      for (let j = 0; j < this.tasks.length; j++) {
        if (this.tasks[j].check !== false) {
          ncheck++;
        }
      }
      // console.log('выполнено: ' + ncheck);

      for (let i = 0; i < ncheck; i++) {
        sum += 100 / this.tasks.length;
      }
      if (sum <= 49) {
        this.fullsum = 0;
        this.danger = 1;
      } else {
        if (sum >= 100) {
          this.fullsum = true;
          this.success = 1;
          var audio = new Audio("/checker/sound/rasengan.mp3");
          audio.play();
        } else {
          this.fullsum = 0;
          this.danger = 0;
          this.success = 0;
        }
      }
      return Math.floor(sum);
      this.procmt = this.sum;
    },
    //выводим вычисляемый процент выполнения задачи (sum) или 100% если чекнут главный чекер задачи
    sumPbar() {
      var w = "0";
      if (!this.mtfull) {
        w = this.sum;
        return w;
      } else {
        w = "100";
        var audio = new Audio("/checker/sound/getsuga_tenshou.mp3");
        audio.play();
        return w;
      }
    },
  },

  template: `
      <div id="p-bar">
        <div class="progress md-progress" style="height: 35px">
            <div class="progress-bar" v-bind:class="{ 'red': danger, 'success': success || mtfull  }" role="progressbar" v-bind:style="{ width: sumPbar + '%' }" style="height:35px" v-bind:aria-valuenow="sumPbar" aria-valuemin="0" aria-valuemax="100" >{{ sumPbar }} %</div>
        </div>  
 
        <h1 style="margin-left: 0.5vh" style="padding-top: 8px" v-on:change="">&nbsp;{{ mtname }} {{ sumPbar }} % 

        <!-- Кнопка сворачивания/разворачивания списка подзадач -->
            <button class="btn btn-outline-dark left2" @click="sendIdChangeOpen(mtnum)" aria-label="open">{{ this.tasks.length }}
              <i class="fa fa-bars fa-lg" aria-hidden="true"></i></button>
        
        <!-- Главный чекер задачи --> 
              <input class="input_checkbox" type="checkbox" v-show="!this.fullsum" v-model="this.mtfull"  v-on:change="changeFullmtask(mtnum)" style="margin-left: 1vh"></i>
        <!-- Дублер главного чекера задачи скрыт пока sum не равна 100 -->       
              <input type="checkbox" v-show="this.fullsum" v-bind:checked="this.fullsum" style="margin-left: 1vh"></i>

       <!-- Кнопка менюшка раскрывающая редактир и тд  -->
              <button v-on:click="openmenu = !openmenu" class="btn btn-light left2">
          <i v-show="!openmenu" class="fa fa-ellipsis-v 2x" aria-hidden="true"></i>
            <i v-show="openmenu" class="fa fa-caret-left 2x" aria-hidden="true"></i></button>

           <!-- пока скроем несколько кнопок -->
              <!-- Кнопка добавить заметку 
                  <button v-show="openmenu" class="btn btn-light left2">
              <i class="fa fa-commenting-o 2x" aria-hidden="true"></i></button>  -->
         
              <!-- Кнопка добавить ссылку  
                    <button v-show="openmenu" class="btn btn-light left2">
              <i class="fa fa-globe 2x" aria-hidden="true"></i></button>  -->
                   
              <!-- Кнопка добавить документ 
                    <button v-show="openmenu" class="btn btn-light left2">
              <i class="fa fa-file-text-o 2x" aria-hidden="true"></i></button>  -->

              <!-- Кнопка редактировать задачу 
                    <button v-show="openmenu" class="btn btn-light left2">
              <i class="fa fa-pencil-square-o 2x" aria-hidden="true"></i></button>  -->

              <!-- Кнопка дублировать задачу -->
                  <button v-show="openmenu" @click="sendmnaruto(mtnum)" class="btn btn-light left2">  
              <i class="fa fa-clone 2x" aria-hidden="true"></i></button> 

              <!-- Кнопка таймера 
              <button v-show="openmenu" class="btn btn-light left2">
              <i class="fa fa-clock-o 2x" aria-hidden="true"></i></button>  -->
           
              <!-- Кнопка поднять Задачу  -->
                  <button v-show="openmenu" @click="sendidupmt" class="btn btn-light left2" style="margin-left: 2vh">
              <i class="fa fa-long-arrow-up 2x" aria-hidden="true"></i></button>

              <!-- Кнопка спустить Задачу  -->
                    <button v-show="openmenu" @click="sendiddownmt" class="btn btn-light left2">
              <i class="fa fa-long-arrow-down 2x" aria-hidden="true"></i></button>  

            
              <!-- Кнопка удаления больших задач -->
                  <button v-show="openmenu" class="btn btn-outline-secondary left2" @click="sendIdRemoveMainTask(mtnum)" href="#" aria-label="Удалить">
                    <i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></button>



      </h1> 
   
<template v-if="openum">

<!-- Список подзадач!!!! -->
      
      <table class="table table-hover table-dark" style="border-radius: 5px;" >
       <tbody>
            <tr v-for="(task, n) in tasks" class="left2 line-height" >

    <div class="d-flex justify-content-between paddis">    
      <div>
            <label v-bind:class="[ task.check || mtfull ? 'gray' : '', '']">{{ n+1 }}&nbsp;{{ task.name }}
              <input type="checkbox" v-bind:id="task.name" v-bind:value="task.name" v-on:change="saveTask" v-model="task.check" style="margin-left: 1.5vh">
            </label>
          </div>
        <div>
        <!-- Кнопка Задача в работе -->
              <button class="btn btn-outline-secondary right2" @click="inWork(n)" v-bind:class="[ task.inwrk ? 'btn-success' : 'btn-default', 'btn']"  aria-label="В РАБОТЕ!" title="В работе!">
          {{ task.whoinwork }} <i class="fa fa-thumb-tack fa-lg" aria-hidden="true"></i></button>


           <!-- пока скроем несколько кнопок 
              <!-- Кнопка добавить заметку 
                  <button v-show="task.men" class="btn btn-light left2">
              <i class="fa fa-commenting-o 2x" aria-hidden="true"></i></button>  -->
         
              <!-- Кнопка добавить ссылку  
                    <button v-show="task.men" class="btn btn-light left2">
              <i class="fa fa-globe 2x" aria-hidden="true"></i></button>  -->
                   
              <!-- Кнопка добавить документ 
                    <button v-show="task.men" class="btn btn-light left2">
              <i class="fa fa-file-text-o 2x" aria-hidden="true"></i></button>  -->

              <!-- Кнопка открыть-закрыть форму редактирования подзадачи -->
                    <button v-show="task.men" @click="openedittsk(n)" class="btn btn-light left2">
              <i class="fa fa-pencil-square-o 2x" aria-hidden="true"></i></button>  

              <!-- Кнопка дублировать задачу -->
                    <button v-show="task.men" @click="tasknaruto(n)" class="btn btn-light left2">  
              <i class="fa fa-clone 2x" aria-hidden="true"></i></button> 

              <!-- Кнопка таймера 
              <button v-show="task.men" class="btn btn-light left2">
              <i class="fa fa-clock-o 2x" aria-hidden="true"></i></button>  -->
           
          <!-- Кнопка поднять Задачу  -->
              <button v-show="task.men" @click="taskup(n)" class="btn btn-light left2" style="margin-left: 2vh">
          <i class="fa fa-long-arrow-up 2x" aria-hidden="true"></i></button>

          <!-- Кнопка спустить Задачу  -->
                <button v-show="task.men" @click="taskdown(n)" class="btn btn-light left2">
          <i class="fa fa-long-arrow-down 2x" aria-hidden="true"></i></button>


         <!-- Кнопка удаления подзадач -->
        <button v-show="task.men" class="btn btn-outline-secondary left2" @click="removeTask(n)" aria-label="Удалить" style="margin-left: 2vh">
            <i class="fa fa-trash-o fa-lg" aria-hidden="true"></i>
            </button>

          <!-- Кнопка менюшка раскрывающая редактир и тд  -->
              &ensp;<button @click="openmentsk(n)" class="btn btn-light left2">
          <i v-show="!task.men" class="fa fa-ellipsis-v 2x" aria-hidden="true"></i>
            <i v-show="task.men" class="fa fa-caret-left 2x" aria-hidden="true"></i></button>&ensp;
        
        <!-- форма для редактирования -->
              <div v-show="task.red" class="col-sm-12" style="margin: 0.5vh">
                   <div class="input-group" style="margin-left: -2vh">
                    <input v-model="task.name" type="text" class="form-control" @keyup.enter="openedittsk(n)">
                    <div class="input-group-append">
                      <button @click="openedittsk(n)" class="btn btn-outline-secondary" type="button" v-on:click="">ИЗМЕНИТЬ!</button>
                    </div>
                  </div>
              </div> 
          
          </div>
        </div>
     
      </tr>
        <!-- Форма ввода подзадач -->
        
         <div class="col-sm-11 margins" >
                   <div class="input-group" >
                    <input type="text" maxlength="62" class="form-control" placeholder="" v-model="newtask" @keyup.enter="addTask"">
                    <div class="input-group-append">
                      <button class="btn btn-outline-secondary" type="button" v-on:click="addTask">+ ПОДЗАДАЧА</button>
                    </div>
                </div>
         </div>


            </tbody>
        </table> 
        
       </template>
      
   `,
});
