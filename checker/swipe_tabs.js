 $(document).ready(function(){  
   $(".card").swipe( {
     swipeLeft:function(event, direction, distance, duration, fingerCount) {
          $(".nav-tabs li.active").next('li').find('a').tab('show');
        },
     swipeRight:function(event, direction, distance, duration, fingerCount) {
          $(".nav-tabs li.active").prev('li').find('a').tab('show');
        },
  });
});