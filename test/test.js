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
  255,255,000,255,
  000,255,255,255,
  000,255,255,255,
  255,255,000,255,
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

process.stdin.setRawMode( true );
process.stdin.resume();
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

 
var times = 0;
function showMenu(selected){
  
  if (++times <= 3){ctx.clear()}
  
  ctx.textStyle = selected?'blue':"bright.blue";
  ctx.fillStyle = selected?'green':'green.bright';
  ctx.fillRect(1,1,5,5,"PICK ME");

  ctx.textStyle = selected?'bright.blue':"blue";
  ctx.fillStyle = selected?'bright.green':'green';
  ctx.fillRect(20,1,5,5,"PICK ME");
  
  ctx.textStyle = "bright.red";
  ctx.fillStyle = 'bright.cyan';
  ctx.fillRect(1,7,24,5,"Press 'A' or 'S' to select.  C to exit. ");
  
  
  ctx.drawImage(9,0,8,5,image);
    
  ctx.moveTo(ctx.getWidth() - 10,ctx.getHeight());  
  
}

showMenu(false);

