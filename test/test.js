//test
var invader = [
  255,255,000,255,
  255,255,000,255,
  255,255,000,255,
  000,255,255,255,
  000,255,255,255,
  255,255,000,255,
  255,255,000,255,
  255,255,000,255,
  
  255,255,000,255,
  255,255,000,255,
  000,255,255,255,
  000,255,255,255,
  000,255,255,255,
  000,255,255,255,
  255,255,000,255,
  255,255,000,255,
  
  255,255,000,255,
  000,255,255,255,
  255,000,000,255,
  000,255,255,255,
  000,255,255,255,
  255,000,000,255,
  000,255,255,255,
  255,255,000,255,
  
  000,255,255,255,
  000,255,255,255,
  000,255,255,255,
  000,255,255,255,
  000,255,255,255,
  000,255,255,255,
  000,255,255,255,
  000,255,255,255,
  
  255,255,000,255,
  255,255,000,255,
  000,255,255,255,
  255,255,000,255,
  000,255,255,255,
  255,255,000,255,
  000,255,255,255,
  255,255,000,255,
  
  255,255,000,255,
  255,255,000,255,
  000,255,255,255,
  255,255,000,255,
  000,255,255,255,
  255,255,000,255,
  000,255,255,255,
  255,255,000,255
]


var invader2 = [
  255,255,000,255,
  255,255,000,255,
  255,255,000,255,
  000,255,255,255,
  000,255,255,255,
  255,255,000,255,
  255,255,000,255,
  255,255,000,255,
  
  255,255,000,255,
  255,255,000,255,
  000,255,255,255,
  000,255,255,255,
  000,255,255,255,
  000,255,255,255,
  255,255,000,255,
  255,255,000,255,
  
  255,255,000,255,
  000,255,255,255,
  100,000,000,255,
  000,255,255,255,
  000,255,255,255,
  100,000,000,255,
  000,255,255,255,
  255,255,000,255,
  
  000,255,255,255,
  000,255,255,255,
  000,255,255,255,
  000,255,255,255,
  000,255,255,255,
  000,255,255,255,
  000,255,255,255,
  000,255,255,255,
  
  255,255,000,255,
  000,255,255,255,
  255,255,000,255,
  000,255,255,255,
  255,255,000,255,
  000,255,255,255,
  255,255,000,255,
  255,255,000,255,
  
  255,255,000,255,
  000,255,255,255,
  255,255,000,255,
  000,255,255,255,
  255,255,000,255,
  000,255,255,255,
  255,255,000,255,
  255,255,000,255
]

var Canvas = require('../');

var ctx = new Canvas();

process.openStdin();
process.stdin.setRawMode( true );
process.stdin.setEncoding( 'utf8' );

process.stdin.on('data',function(d){
  if (d.indexOf('s') > -1){
    showMenu(true)
  }else if (d.indexOf('a') > -1){
    //highlight right one
    showMenu(false);
  }else if (d.indexOf('c') > -1){
    //highlight right one
    process.exit();
  }
});


function showAll(selected){
  ctx.clear();
  showStatic();
  showMenu(selected||false);  
}
 
function showStatic(){
  
  ctx.fillStyle = 'red';
  ctx.fillRect(0,0,ctx.getWidth() -1,ctx.getHeight());// fixing this is a TODO item.  You should be able to fill the whole screen.
  
  ctx.textStyle = "bright.red";
  ctx.fillStyle = 'bright.cyan';
  ctx.fillRect(1,7,24,5,"Hit 'Enter', then press 'A' or 'S' to select.  C to exit. ");
  
  ctx.lineStyle = 'bright.red';
  ctx.drawRect(0,6,26,7);
  
  ctx.lineStyle = 'bright.white';
  ctx.drawLine(0,6,25,6);
    
  var cols = ['white','red','yellow','green','cyan','blue','magenta','black'];
  var h = 13;
  cols.forEach(function(col){
    ctx.lineStyle=col;
    ctx.drawPoint(29,h);
    ctx.drawLine(0,h,25,h);
    h++;
    ctx.lineStyle='bright.'+col;
    ctx.drawPoint(28,h);
    ctx.drawLine(0,h,25,h);
    h++
  });
  
  ctx.textStyle = "white";
  ctx.fillStyle = 'blue';
  ctx.lineStyle = 'bright.white';
  ctx.drawBorderedRect(30,0,20,10,"This is a bordered rectangle right mhea");  
  
}
 
var times = 0;
function showMenu(selected){    
  ctx.textStyle = selected?'blue':"bright.blue";
  ctx.fillStyle = selected?'green':'green.bright';
  ctx.fillRect(1,1,5,5,"PICK ME");

  ctx.textStyle = selected?'bright.blue':"blue";
  ctx.fillStyle = selected?'bright.green':'green';
  ctx.fillRect(20,1,5,5,"PICK ME");
      
  ctx.moveTo(ctx.getWidth() - 10,ctx.getHeight() - 2);    
}

showAll(false);

var frame = false;
function animateInvader(){
  frame = !frame
  ctx.drawImage(9,0,8,5,frame?invader:invader2); 
  ctx.moveTo(ctx.getWidth() - 10,ctx.getHeight() - 2); 
}
animateInvader();
setInterval(animateInvader,1000);
