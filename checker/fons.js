Vue.component('fon-menu', {
 data: function() {
    return{ 
      fons:['Desk', 'workspace', 'Balance', 'Table', 'Desk2', 'Dream', 'goal', 'office','Idea', 'wall', 'vision', 'narrative', 'fitness', 'pumpkin',   'Tesla', 'whiteboard','Startup'],
    }
  },
  // mounted: function() {
  //     if (localStorage.getItem('checkerfon')) {
  //     try {
  //       this.fonnow = JSON.parse(localStorage.getItem('checkerfon'));
  //     } catch(e) {
  //       console.error();
  //     }
  //   }
  // },
  methods:{
    changefon(n){
      var fonway = 'url("checker/img/'+ this.fons[n] + '.jpg")';
      // console.log(fonway);
     
        //Сохраняем фон в ЛС
        var fonsave = JSON.stringify(fonway);
        localStorage.setItem('checkerfon', fonsave);
        this.$emit('newfon', fonsave);
        console.log("fons" + fonsave);
    }
   },

    template:`
             <div class="dropdown">
                  <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  FONS
                  </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <a v-for="fon,n in fons" v-on:click="changefon(n)" class="dropdown-item">{{ fon }}</a>
                    </div>
              </div>
  `
});
