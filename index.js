/*
implement canvas methods


*/

var ansiEscapes = require('ansi-escapes');
var termPx = require('term-px'); 

var BLOCK = String.fromCharCode(9608);
var ESC = String.fromCharCode(27);
var RESET = ESC + '[0m';
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
  this.lineStyle = 'white';
  
  this._charStyle = function(text,fill){    
    var bg = getBgTagPair(fill||canvas.fillStyle);
    var fg = getFgTagPair(text||canvas.textStyle);
    return [fg[0] + bg[0],fg[1] + bg[1]];
  }
  
  this._getLineCharacter = function(){
    // get character for lines
    if (canvas.lineStyle === 'white.bright' || canvas.lineStyle === 'bright.white'){
      // white is magical... it is 
      var st = canvas._charStyle('white.bright','white');
      return st[0] + BLOCK + st[1];
    }
    // otherwier, get same line and bg style
    var st = canvas._charStyle(canvas.lineStyle,canvas.lineStyle);
    return st[0] + BLOCK + st[1];    
    
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
  
  this.drawRect = function(x,y,width,height){
    var x2 = width + x - 1;
    var y2 = height + y - 1;
    canvas.drawLine(x,y,x2,y);//top
    canvas.drawLine(x,y2,x2,y2);//bottom
    
    canvas.drawLine(x,y2-1,x,y+1);//left
    canvas.drawLine(x2,y2-1,x2,y+1);//right  
  }
  
  // TODO make the top/bottom borders with termPx
  this.drawBorderedRect = function(x,y,width,height,text){
    //inner part is easy peasy
    canvas.fillRect(x+1,y+1,width-2,height-2,text);
    
    //draw left and right borders
    var x2 = width + x - 1;
    var y2 = height + y - 1;
    canvas.drawLine(x,y,x,y2);
    canvas.drawLine(x2,y,x2,y2);   
    
    var st = canvas._charStyle(canvas.lineStyle,canvas.fillStyle);
    var topChar = String.fromCharCode(9600);    
    var bottomChar = String.fromCharCode(9604);
    
    
    canvas.drawLine(x+1,y,x2-1,y,st[0] + topChar + st[1]);
    canvas.drawLine(x+1,y2,x2-1,y2,st[0] + bottomChar + st[1]);
    
  }
  
  this.drawLine = function(x1,y1,x2,y2,character){
    //only vertical or horizontal lines
    var toWrite = '';
    if (y1 == y2){// horizontal
      var left = Math.min(x1,x2);
      var right = Math.max(x1,x2);      
      toWrite = ansiEscapes.cursorTo(left,y1) + repeat(character||canvas._getLineCharacter(),(right-left)+1);      
    }
    else if (x1 == x2){// vertical
      var top = Math.min(y1,y2);
      var bottom = Math.max(y1,y2);      
      toWrite = ansiEscapes.cursorTo(0,top) + repeat(ansiEscapes.cursorForward(x1) + (character||canvas._getLineCharacter()) + '\r\n',(bottom-top)+1);
    }else{
      return;// I don't do diagonal lines.
    }
    
    output.write(toWrite);
  }
  
  //draw a line from here to here :P
  this.drawPoint = function(x,y){
    return canvas.drawLine(x,y,x,y);
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