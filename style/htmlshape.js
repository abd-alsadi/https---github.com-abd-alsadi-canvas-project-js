
class DragElement{
    constructor(containerID,elementID,elementHeaderID,position){
        
        this.element = document.getElementById(elementID);
        this.elementHeader = document.getElementById(elementHeaderID);
        this.container = document.getElementById(containerID);

        if(this.element && this.elementHeader && this.container){
            if(position && position.left){
                this.element.style.left=position.left;
            }
            if(position && position.top){
                this.element.style.top=position.top;
            }
            if(position && position.right){
                this.element.style.right=position.right;
            }
            if(position && position.bottom){
                this.element.style.bottom=position.bottom;
            }
            this.initDragElement();
        }
           
    }

    initDragElement(){
        
         this.pos1 = 0,this.pos2 = 0,this.pos3 = 0,this.pos4 = 0;
         this.currentZIndex = 100; //TODO reset z index when a threshold is passed

        this.element.onmousedown = function() {
            this.style.zIndex = "" + ++this.currentZIndex;
        };

        if (this.elementHeader) {
            this.elementHeader.onmousedown = this.startDragElement.bind(this);
        }
    }

    stopDragElement() {
        console.log('stopDragElement');
        /* stop moving when mouse button is released:*/
        this.container.onmouseup = null;
        this.container.onmousemove = null;
    }

 
    dragElementMove(e) {
        if (!this.element) {
        return;
        }
        
        console.log('dragElementMove');

        e = e || window.event;
        // calculate the new cursor position:
        this.pos1 = this.pos3 - e.clientX;
        this.pos2 = this.pos4 - e.clientY;
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        // set the element's new position:
        this.element.style.top = this.element.offsetTop - this.pos2 + "px";
        this.element.style.left = this.element.offsetLeft - this.pos1 + "px";

        console.log("pos1:"+this.pos1+" pos2:"+this.pos2+" pos3:"+this.pos3+" pos4:"+this.pos4);

  }
  
   startDragElement(e) {
    console.log('startDragElement');

    this.element.style.zIndex = "" + ++this.currentZIndex;
    e = e || window.event;
    // get the mouse cursor position at startup:
    this.pos3 = e.clientX;
    this.pos4 = e.clientY;
    this.container.onmouseup = this.stopDragElement.bind(this);
    // call a function whenever the cursor moves:
    this.container.onmousemove = this.dragElementMove.bind(this);
  }

}

class ResizElement{
    constructor(containerID,elementID,position){
        this.element = document.getElementById(elementID);
        this.container = document.getElementById(containerID);
        if(this.element && this.container){
            if(position && position.left){
                this.element.style.left=position.left;
            }
            if(position && position.top){
                this.element.style.top=position.top;
            }
            if(position && position.right){
                this.element.style.right=position.right;
            }
            if(position && position.bottom){
                this.element.style.bottom=position.bottom;
            }

            this.initResizeElement();
        }
        
    }
    initResizeElement(){
       this.startX, this.startY, this.startWidth, this.startHeight;
       
        this.buildPointers();
    }
    buildPointers(){
        var right = document.createElement("div");
        right.className = "resizer-right";
        this.element.appendChild(right);
        right.addEventListener("mousedown", this.initDrag.bind(this), false);
       // right.parentPopup = p;

        var bottom = document.createElement("div");
        bottom.className = "resizer-bottom";
        this.element.appendChild(bottom);
        bottom.addEventListener("mousedown", this.initDrag.bind(this), false);
       // bottom.parentPopup = p;

        var both = document.createElement("div");
        both.className = "resizer-both";
        this.element.appendChild(both);
        both.addEventListener("mousedown", this.initDrag.bind(this), false);
        //both.parentPopup = p;
    }

 initDrag(e) {
     //this.element = e.target.parentPopup;

    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startWidth = parseInt(
      document.defaultView.getComputedStyle(this.element).width,
      10
    );
    this.startHeight = parseInt(
      document.defaultView.getComputedStyle(this.element).height,
      10
    );
    this.container.onmousemove=this.doDrag.bind(this);
    this.container.onmouseup=this.stopDrag.bind(this);
  }

 doDrag(e) {
    this.element.style.width =  this.startWidth + e.clientX -  this.startX + "px";
    this.element.style.height = this. startHeight + e.clientY -  this.startY + "px";
  }

   stopDrag() {
    this.container.onmousemove=null;
    this.container.onmouseup=null;
  }
}



class HtmlShape{
    constructor(callbacks){
        this.callbacks=callbacks;
    }
 
    destroy(){
        this.dragElement=null;
        this.resizeElement=null;
    }
    loadHtml(content,containerID,elementID,elementHeaderID,position){
        this.position=position;
        this.containerID=containerID;
        this.elementID=elementID;
        this.elementHeaderID=elementHeaderID;
        this.content=content;
        this.element=document.getElementById(this.elementID);
        if(this.element){
            this.element.remove();
        }

        this.checkAddElement();
        this.destroy();

        this.container = document.getElementById(this.containerID);
        this.element=document.getElementById(this.elementID);
        this.elementHeader=document.getElementById(this.elementHeaderID);

        this.dragElement=new DragElement(this.containerID,this.elementID,this.elementHeaderID,this.position);
        this.resizeElement=new ResizElement(this.containerID,this.elementID,this.position);
    }
    getElementData(){
         
        if(this.element){
            var newContent = this.element.getElementsByClassName('content')[0].innerHTML;
            return {
                left:this.element.style.left.replace('px',''),
                top:this.element.style.top.replace('px',''),
                right:this.element.style.right.replace('px',''),
                bottom:this.element.style.bottom.replace('px',''),
                html:newContent
            };
        }
        return null;
    }
    checkAddElement(){
        var node = document.createElement('div');
        node.className='element';
        node.id=this.elementID;

        var deleteNode = document.createElement('button');
        deleteNode.innerText='X';
        deleteNode.onclick = this.deleteElement.bind(this);
        deleteNode.style.float='left';
        
        var header = document.createElement('div');
        header.className='element-header noselect';
        header.id=this.elementHeaderID;

        var headerText = document.createElement('span');
        headerText.innerText='click to move';

        header.appendChild(deleteNode);
        header.appendChild(headerText);

        var cont = document.createElement('div');
        cont.className='content';
        cont.innerHTML=this.content;

        node.appendChild(header);
        node.appendChild(cont);
        
        var container = document.getElementById(this.containerID);
        if(container){
            container.appendChild(node);
        }
    }

    deleteElement(e){
        if(this.container){
            if(this.element && this.callbacks.deleteCallback){
                this.callbacks.deleteCallback(this);
            }
        }
    }
}

