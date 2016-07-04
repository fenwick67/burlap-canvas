//test
var image = [
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
  
  000,255,255,255,
  255,255,000,255,
  000,255,255,255,
  255,255,000,255,
  000,255,255,255,
  255,255,000,255,
  000,255,255,255,
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
  
  ctx.textStyle = "bright.red";
  ctx.fillStyle = 'bright.cyan';
  ctx.fillRect(1,7,24,5,"Hit 'Enter', then press 'A' or 'S' to select.  C to exit. ");
  
  ctx.lineStyle = 'red';
  ctx.drawRect(0,6,26,7);
  
  ctx.lineStyle = 'bright.white';
  ctx.drawLine(0,6,25,6);
  
  ctx.drawImage(9,0,8,5,image);
  
  var cols = ['white','red','yellow','green','cyan','blue','magenta','black'];
  var h = 13;
  cols.forEach(function(col){
    ctx.lineStyle=col;
    ctx.drawLine(0,h,25,h);
    h++;
    ctx.lineStyle='bright.'+col;
    ctx.drawPoint(5,h-1);
    ctx.drawLine(0,h,25,h);
    h++
  });
  
  
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

