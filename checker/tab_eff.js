//Расчет эффективности вкладки
//Идея такая - каждый раз когда пользователь чекерит задачу или подзадачу - отправляем в checker_html номер вкладки в которой это произошло тем самым запуская пересчет эффективности пользователя в этой вкладке
//Пусть пока этот номер будет 29..
Vue.component('tab_eff', {
	props: {
    //id вкладки из пропсов main-task
    idtab: Number,
    change: Boolean
    },
 data: function() {
    return{ 
      //effid: idtab,
      effMtasks:'',
      efftasks:'',
      teff: 0
  	}
  },
  mounted: function() {
  	this.effTab();
  },

watch: {
      change: function(){
      	console.log(this.change);
      	this.effTab();
        }

},
methods:{
   	effTab(){
  	//Сначала нужно узнать сколько всего больших задач в этой вкладке (длинна массива 29maintasks)
	var nmaintasks = this.idtab + 'maintasks';

	 console.log(nmaintasks);

	this.effMtasks = JSON.parse(localStorage.getItem(nmaintasks));

	if(!this.effMtasks){
		console.log('Нет больших задач!');
		    	this.teff = 0;
		        return this.teff;
		        console.log('Эффективность вкладки' + this.teff + '%');
		    } else {
	var numMtsk = this.effMtasks.length;
	//Создадим переменную, в которой будем копить проценты:
	var eff = 0;
	//Затем запускаем цикл в котором:
	   for (var t = 0; t < numMtsk; t++) {
	   	//Сразу прибавляем 100 если нажат большой чекер
	          if (this.effMtasks[t].full == true) {
	            // console.log('Большой чек! 100% ');
	           eff = eff + 100; 
    //И пересчитываем проценты во всех остальных:       
          }else{
  	       	  let effsum = 0;
		      var effcheck= 0;
		      //Получаем имя масиива подзадач в лс
		       var efftaskinls = this.idtab + 'tasks' + this.effMtasks[t].idmtask;
		       //Загружаем его..
		       this.efftasks = JSON.parse(localStorage.getItem(efftaskinls));
		       //И если его нет..
		        if(!this.efftasks){
		        	console.log('У задачи нет подзадач!');
		        } else { 

		         for (let j = 0; j < this.efftasks.length; j++){

		          if (this.efftasks[j].check !== false ) {
		              effcheck++;
		            	}
		           }
		        	for (let i = 0; i < effcheck; i++){
		          	effsum += 100/this.efftasks.length;
		          	 	}
		          	}
		          	effsum = Math.floor(effsum);	
		          	eff = eff + effsum; 	
		        }
		     		
        }
         this.teff = Math.floor(eff/numMtsk);
        // return this.teff;
        //Отправляем в main_task процент общей эфф.вкладки для отобр-я соотв-го значка батарейки
        var x = 0;
        if(this.teff <= 24){
        	x = 0;
        } else if (this.teff <= 49){
        	x = 1;
        } else if (this.teff <= 74){
        	x = 2;
        } else if (this.teff < 100){
        	x = 3;
        } else if (this.teff == 100){
        	x = 4;
        }
        this.$emit('effprocenergy', x);
        console.log(x);
        }
         
    }

   },

template:`
             <div> Эффективность {{this.teff}}%
             </div>
          
  `
});




//кратко:
//определяем id лс в которых хранятся подзадачи задач этой вкладки
//потом определяем в процентах выполнение каждой
//При этом если в большой задаче стоит флаг full=true - она сразу равна 100%
//затем складываем их всех и делим на число больших задач во вкладке (chislotasks)

