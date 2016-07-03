/*
implement canvas methods


*/

var ansiEscapes = require('ansi-escapes');
var termPx = require('term-px'); 

//output needs these methods:

//write
//prop: width
//prop:height

function Canvas(output){
  
  var stdout = {
    write:function(s){process.stdout.write(s)},
    getHeight:function(){return process.stdout.rows},
    getWidth:function(){return process.stdout.columns},
  }  
  this.stdout = stdout;
  
  
  var output = output || stdout;
  
  //console.log(output);
  
  
  var canvas = this;
  
  this.getHeight = function(){
    return output.getHeight();
  }
  this.getWidth = function(){
    return output.getWidth();
  }
  
  
  this.fillStyle = 'bgBlack';
  this.textStyle = 'white';
  this._charStyle = function(){

    var bg = getBgTagPair(canvas.fillStyle);
    var fg = getFgTagPair(canvas.textStyle);
    
    //todo: split fillStyle / textStyle by . and apply chalk styles
    return [fg[0] + bg[0],fg[1] + bg[1]];
  }
  
  function applyStyle(str){
    //apply current style to str
    var cs = canvas._charStyle();
    return cs[0] + str + cs[1];
  }  
  
  this.fillRect = function(x,y,width,height,text){//text is optional
    

    var outputWidth = output.getWidth();
    var outputHeight = output.getHeight();
  
    text = text||'';
    var toWrite = ansiEscapes.cursorTo(x,y);//move to x,y   
    
    for (var dy = 0; dy < height; dy ++){//move down
      for (var dx = 0; dx < width; dx ++){//move across
        if (dy + y >= outputHeight || dx + x >= outputWidth  || dy + y < 0 || dx + x < 0){
          return;//don't print things offscreen dummy
          //console.log('ooh')
        }        
        // put a space in there... or the character from the "text" option
        toWrite = toWrite + ( text[dy*width+dx] ||' ');
      }
      //drop in a newline and move across to X
      toWrite = toWrite + '\n' + ansiEscapes.cursorForward(x);  
    }    
    
    //toWrite = toWrite + (ansiEscapes.cursorTo(x,y));
    
    output.write(applyStyle(toWrite));//flush it down the pipe 
  }
  
  this.drawImage = function(x,y,width,height,imageData){// imageData is an iterable thing in RGBA format.  Width and height are in PX and not in Chars!

      var ret = ansiEscapes.cursorTo(x,y);
      
      var options = options || {};
      
      var dat = imageData||[];
      
      var outputWidth = output.getWidth();
      var outputHeight = output.getHeight();
      

      var i = 0;
      while (i < dat.length){
        //handle off-screen writing in X direction
        if ( x + (i/4)%width  >= outputWidth){
          //return;
        }
        //handle writing offscreen in Y direction
         if ( y + ((i/4)/width)/2  >= outputHeight){
          //return;
        }
        
        // it's RGBA
        var top = [dat[i],dat[i+1],dat[i+2]];
        var bottom = [dat[i + width*4 ],dat[i + width*4+1],dat[i + width*4+2]];
        
        ret = ret + (termPx(top,bottom));
        
        i = i + 4;
        if ( (i/4) % width == 0 ){// move to next line
          ret = ret + ('\n');
          i = i + width*4;//skip line
          // move over
          ret = ret + ansiEscapes.cursorForward(x);
        }
      }
      
    //move back
    ret = ret + (ansiEscapes.cursorTo(x,y));
    output.write(ret);
  } 
  
  //clear screen and move to top left
  this.clear = function(){
    
    output.write(
      ansiEscapes.clearScreen + 
      ansiEscapes.cursorTo(0,0) + 
      repeat('\n ',output.getHeight()) + 
      ansiEscapes.cursorTo(0,0)
    );
  }
  
  this.moveTo = function(x,y){
    output.write(
      ansiEscapes.cursorTo(x||0,y||0)
    );
  }
  


  return this;
}

var styles = ['black','red','green','yellow','blue','magenta','cyan','white'];
var esc = String.fromCharCode(27);

//get open / closing tags for background
function getBgTagPair(str){
  var open = [];
  var close = [];
  var s = str.split('.');
  s.forEach(function(style){
    if (style == 'bright'){
      open.push('5');
      //close = close + '';//TODO get colosing tag to unbrighten the bg
    }
    var idx = styles.indexOf(style);
    if (idx > -1){
      open.push( (idx +  40 )+ '');
      //close = close + '';//TODO get colosing tag to remove color
    }
  });
  
  //now join the tags :)
  var openRt = esc + '[' +  open.join(';') + 'm'
  var closeRt = esc + '[' +  close.join(';') + 'm'  
  return ([openRt,closeRt]);
  
}

function getFgTagPair(str){
  var open = [];
  var close = [];
  var s = str.split('.');
  s.forEach(function(style){
    if (style == 'bright'){
      open.push('1');
      //close = close + '';//TODO get colosing tag to unbrighten the text
    }
    var idx = styles.indexOf(style);
    if (idx > -1){
      open.push( (idx +  30 )+ '');
      //close = close + '';//TODO get colosing tag to remove color
    }
  });
  
  //now join the tags :)
  var openRt = esc + '[' +  open.join(';') + 'm';
  var closeRt = esc + '[' +  close.join(';') + 'm';
  return ([openRt,closeRt]);
  
}

function repeat(str,times){  
  if (typeof times == 'undefined'){
    return '';
  }
  
  var times = Math.round(times);
  if (!times || times < 0){return ''};//times rounds to 0 or is NAN => ''
  
  var s = [str];
  for(var i = 1; i < times; i ++){
    s.push(str);
  }
  return s.join('');
}

module.exports = Canvas;