(function (m) {

    m.fn.extend({
        
        // moveY 
        limittop:function (moveY,translateY,targetHeight,limit) {
            limit=limit||1;
            if(translateY>=0){
                var scale = 1 - translateY / targetHeight;
                moveY = moveY * scale*limit;
                  //console.log("scale",scale) 
            }

            return moveY;
        },


          // moveY 
          limitbottom:function (moveY,translateY,targetHeight,limit) {
            limit=limit||1;
            var elH=m(this).outerHeight();
            var  moveSpace=targetHeight-elH;
			
           if(translateY<moveSpace){
                var scale = 1 - Math.abs( translateY-moveSpace) /targetHeight;
                moveY =  moveY * scale*limit;
               // console.log(scale)
           }

           return moveY;
          
        },

        // 添加滚动条

        addScrollBar:function(){

            var p=m(this).parents(".m-scroll-topbottom");
            var winH=p.outerHeight();
            var elH=m(this).outerHeight();

            if(elH>winH){
                    var div=document.createElement("div");
                    div.classList.add("m-scroll-bar");
                    var ratio=winH/elH;
                    div.style.height=ratio*winH+"px";
                    p.append(div);
                }
               
        },

        moveScrollBar:function(){

            var p=m(this).parents(".m-scroll-topbottom");
            var winH=p.outerHeight();
            var elH=m(this).height();
            // console.log(elH)
            var bar =p.find(".m-scroll-bar");
            var ratio=winH/elH;
            bar.height(ratio*winH);
            //console.log(ratio*winH)
            var scroll_Y = m(this).translateY();
            var scroll_box_h = m(this).height();
            var ratio2 = scroll_Y / scroll_box_h;
            bar.translateY(-ratio2* winH);
                
        },

       

    });



})(Mobile);