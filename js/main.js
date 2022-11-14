var focusedElement = undefined
let savedImages = []
let removedImages = []

window.onbeforeunload = function(e) {
    return "Do you want to exit this page?";
  };

document.onkeydown = function(e) {
    if (e.altKey) {
        let ele = undefined;
        switch (e.key) {
            case "1":
                ele = document.createElement("textarea");
                // i.className = "ueberschrift"; s
                ele.placeholder = "UNKOWN";
                ele.oninput = () => {
                    auto_height(ele);
                };
                document.querySelector("body").appendChild(ele);
                ele.focus();
                ele.addEventListener("click", delete_element);
                break;
            case "2":
                ele = document.createElement("span");

                document.querySelector("body").appendChild(ele);
                MQ = MathQuill.getInterface(2);
                ele.dataset.latex = "";
                let mathField = MQ.MathField(ele, {
                    spaceBehavesLikeTab: true, // configurable
                    handlers: {
                        edit: function() {
                            // useful event handlers
                            ele.dataset.latex = mathField.latex(); // simple API
                        },
                    },
                });

                mathField.focus();
                ele.addEventListener("click", delete_element);
                break;
            case "3":
                ele = document.createElement("canvas");
                // ele.src = "jspaint/index.html";

                let move_div = document.createElement("div");
                move_div.className = "resizeable"
                ele.addEventListener("mouseover",(e)=>{
                    console.debug(e);
                    let ctx = move_div.firstChild.getContext("2d");
                    if(Math.abs(ctx.canvas.width-move_div.clientWidth*0.95)>9 || Math.abs(ctx.canvas.height-move_div.clientHeight*0.95)>9) {
                        let img = ctx.getImageData(0,0, ctx.canvas.width, ctx.canvas.height);
                        ctx.canvas.width = move_div.clientWidth*0.95;
                        ctx.canvas.height = move_div.clientHeight*0.95;
                        ctx.putImageData(img, 0,0);
                    }
                });
                move_div.appendChild(ele);

                ele.width = document.body.clientWidth.toString();
                ele.height = "500";
                document.querySelector("body").appendChild(move_div);
                new CLIPBOARD_CLASS(ele, true);
                ele.addEventListener("click", delete_element);
                focusedElement = ele
                savedImages = []
                removedImages = []
                break;
            case "4":
                ele = document.createElement("input");
                ele.className = "ueberschrift";
                ele.placeholder = "UNKOWN";
                document.querySelector("body").appendChild(ele);
                ele.focus();
                ele.addEventListener("click", delete_element);
                break;
            case "s":
                e.preventDefault();
                saveArray = [];
                toSave = document.querySelector("body").children;
                for (let i = 0; i < toSave.length; i++) {
                    switch (toSave[i].tagName) {
                        case "TEXTAREA":
                            saveArray.push({
                                1: toSave[i].value,
                            });
                            break;
                        case "SPAN":
                            saveArray.push({
                                2: toSave[i].dataset.latex,
                            });
                            break;
                        case "CANVAS":
                            saveArray.push({
                                3: GetDrawingAsString(toSave[i]),
                            });
                            break;
                        case "DIV":
                            if(toSave[i].firstChild.tagName == "CANVAS") {
                                saveArray.push({
                                    3: GetDrawingAsString(toSave[i].firstChild),
                                });
                            }
                            break;
                        case "INPUT":
                            if(toSave[i].type =="file"){
                                break;
                            }
                            
                            saveArray.push({
                                4: toSave[i].value,
                            });
                            break;
                    }
                }

                dataStr = encodeURI("data:application/json;charset=utf-8," + JSON.stringify(saveArray));
                dlAnchorElem = document.getElementById("downloadAnchorElem");
                dlAnchorElem.setAttribute("href", dataStr);
                saveValue = ""
                dlAnchorElem.click();
                break;
            case "l":
                document.getElementById("selectFiles").style.display = "block";
                break;
        }
    } else if(e.ctrlKey) {
        switch(e.key) {
            case "z":
                if(savedImages.length>0) {
                    let ctx = focusedElement.getContext("2d");
                    removedImages.push(ctx.getImageData(0,0, ctx.canvas.width,ctx.canvas.height));
                    ctx.putImageData(savedImages.pop(), 0,0);
                }
                break;
            case "y":
                if(removedImages.length>0) {
                    let ctx = focusedElement.getContext("2d");
                    savedImages.push(ctx.getImageData(0,0, ctx.canvas.width,ctx.canvas.height));
                    focusedElement.getContext("2d").putImageData(removedImages.pop(), 0,0);
                }
                break;
        }
    }
};

function GetDrawingAsString(canvas) {
    let pngUrl = canvas.toDataURL(); // PNG is the default
    // or as jpeg for eg
    // var jpegUrl = canvas.toDataURL("image/jpeg");
    return pngUrl;
}

function ReuseCanvasString(div, canvas, url) {
    let img = new Image();
    img.onload = () => {
        // Note: here img.naturalHeight & img.naturalWidth will be your original canvas size
        let ctx = canvas.getContext("2d");
        ctx.canvas.width = img.width;
        ctx.canvas.height = img.height;
        div.style.width = (img.width*1.05).toString()+"px";
        div.style.height = (img.height*1.05).toString()+"px";
        ctx.drawImage(img, 0, 0);
    };
    img.src = url;
}

function load_file(e) {
    var files = document.getElementById("selectFiles").files;
    if (files.length <= 0) {
        return false;
    }
    var fr = new FileReader();

    fr.onload = function(e) {
        console.log(e);
        var result = JSON.parse(e.target.result);
        let ele = undefined;
        for (let i = 0; i < result.length; i++) {
            switch (Object.keys(result[i])[0]) {
                case "1":
                    ele = document.createElement("textarea");
                    // i.className = "ueberschrift"; s
                    ele.placeholder = "UNKOWN";
                    ele.oninput = () => {
                        auto_height(ele);
                    };
                    document.querySelector("body").appendChild(ele);
                    ele.value = result[i][1];
                    ele.addEventListener("click", delete_element);
                    break;
                case "2":
                    try{
                        ele = document.createElement("span");

                    document.querySelector("body").appendChild(ele);
                    MQ = MathQuill.getInterface(2);
                    ele.dataset.latex = "";
                    let mathField = MQ.MathField(ele, {
                        spaceBehavesLikeTab: true, // configurable
                        handlers: {
                            edit: function() {
                                // useful event handlers
                                ele.dataset.latex = mathField.latex(); // simple API
                            },
                        },
                    });

                    mathField.latex(result[i][2]);
                    ele.addEventListener("click", delete_element);
                    }
                    catch(e){
                        console.error(e)
                    }
                    break;
                case "3":
                    ele = document.createElement("canvas");
                    // ele.src = "jspaint/index.html";

                    let move_div = document.createElement("div");
                    move_div.className = "resizeable";
                    ele.addEventListener("mouseover",(e)=>{
                        console.debug(e);
                        let ctx = move_div.firstChild.getContext("2d");
                        if(Math.abs(ctx.canvas.width-move_div.clientWidth*0.95)>9 || Math.abs(ctx.canvas.height-move_div.clientHeight*0.95)>9) {
                            let img = ctx.getImageData(0,0, ctx.canvas.width, ctx.canvas.height);
                            ctx.canvas.width = move_div.clientWidth*0.95;
                            ctx.canvas.height = move_div.clientHeight*0.95;
                            ctx.putImageData(img, 0,0);
                        }
                    });

                    //ele.width = document.body.clientWidth.toString();
                    //ele.height = "500";
                    new CLIPBOARD_CLASS(ele, true);
                    ele.addEventListener("click", delete_element);
                    ReuseCanvasString(move_div, ele, result[i][3]);
                    move_div.appendChild(ele);
                    document.querySelector("body").appendChild(move_div);
                    break;
                case "4":
                    ele = document.createElement("input");
                    ele.className = "ueberschrift";
                    ele.placeholder = "UNKOWN";
                    document.querySelector("body").appendChild(ele);
                    ele.focus();
                    ele.addEventListener("click", delete_element);
                    ele.value = result[i][4];
                    break;
            }
        }
    };

    fr.readAsText(files.item(0));
    document.getElementById("selectFiles").style.display = "none";
}

function delete_element(e) {
    if (e.ctrlKey && e.shiftKey) {
        delete_element_rekursive(e.target);
    }
}

function delete_element_rekursive(element) {
    if (element == document.querySelector("body")) {
        return true;
    }
    if (delete_element_rekursive(element.parentElement)) {
        element.remove();
    }
}

function auto_height(elem) {
    /* javascript */
    elem.style.height = "1px";
    elem.style.height = elem.scrollHeight + "px";
}

function PAINT_BTN_CLASS(canvas, color, index) {
    var _self = this;
    var ctx = canvas.getContext("2d");
    let white_btn = document.createElement("div");
    white_btn.className = "paint_btn";
    white_btn.style.background = color;
    white_btn.onclick = () => {
        ctx.strokeStyle = color;
    }

    if (canvas.parentElement && canvas.parentElement.tagName == "DIV") {
        white_btn.style.left = (index*10).toString()+"px";
        canvas.parentElement.appendChild(white_btn);
    }
}

function CLIPBOARD_CLASS(canvas, autoresize) {
    var _self = this;
    var ctx = canvas.getContext("2d");
    var isPainting = false;
    ctx.fillStyle = "white";
    var lineWidth = 4;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    new PAINT_BTN_CLASS(canvas, "black", 0);
    new PAINT_BTN_CLASS(canvas, "red", 1);
    new PAINT_BTN_CLASS(canvas, "white", 2);
    /*let white_btn = document.createElement("div");
    white_btn.className = "paint_btn";
    white_btn.style.background = "white";
    white_btn.onclick = () => {
        ctx.strokeStyle = "white";
    }
    let black_btn = document.createElement("div");
    black_btn.className = "paint_btn";
    black_btn.style.background = "black";
    black_btn.onclick = () => {
        ctx.strokeStyle = "black";
    }

    if (canvas.parentElement.tagName == "DIV") {
        black_btn.style.left = "1px";
        canvas.parentElement.appendChild(black_btn);
        black_btn.style.left = "11px";
        canvas.parentElement.appendChild(white_btn);
    }*/

    //handlers
    document.addEventListener(
        "paste",
        function(e) {
            if(focusedElement != canvas){
                return
            }
            _self.paste_auto(e);
        },
        false
    );

    //on paste
    this.paste_auto = function(e) {
        
        if (e.clipboardData) {
            var items = e.clipboardData.items;
            if (!items) return;

            //access data directly
            var is_image = false;
            for (var i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    //image
                    var blob = items[i].getAsFile();
                    var URLObj = window.URL || window.webkitURL;
                    var source = URLObj.createObjectURL(blob);
                    this.paste_createImage(source);
                    is_image = true;
                }
            }
            if (is_image == true) {
                e.preventDefault();
            }
        }
    };
    //draw pasted image to canvas
    this.paste_createImage = function(source) {
        var pastedImage = new Image();
        pastedImage.onload = function() {
            if (autoresize == true) {
                //resize
                canvas.width = pastedImage.width;
                canvas.height = pastedImage.height;
            } else {
                //clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            ctx.drawImage(pastedImage, 0, 0);
        };
        pastedImage.src = source;
    };
    const draw = (e) => {
        if (!isPainting) {
            return;
        }
        clientX = e.clientX || e.touches[0].clientX
        clientY = e.clientY || e.touches[0].clientY
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.lineTo(clientX - canvas.offsetLeft + window.scrollX, clientY - canvas.offsetTop + window.scrollY);
        ctx.stroke();
    };

    canvas.addEventListener("mousedown", (e) => {
        isPainting = true;
        if(focusedElement != canvas) {
            savedImages = [];
            focusedElement = canvas;
        }
        removedImages = [];
        startX = e.clientX;
        startY = e.clientY;
        savedImages.push(ctx.getImageData(0,0, ctx.canvas.width, ctx.canvas.height));
    });
    canvas.addEventListener("touchstart", (e) => {
        isPainting = true;
        if(focusedElement != canvas) {
            savedImages = [];
            focusedElement = canvas;
        }
        removedImages = [];
        savedImages.push(ctx.getImageData(0,0, ctx.canvas.width, ctx.canvas.height));
    });

    canvas.addEventListener("mouseup", (e) => {
        isPainting = false;
        ctx.stroke();
        ctx.beginPath();
    });
    canvas.addEventListener("touchend", (e) => {
        isPainting = false;
        ctx.stroke();
        ctx.beginPath();
    });
    function addInput(x, y) {

    var input = document.createElement('input');

    input.type = 'text';
    input.style.position = 'fixed';
    input.style.left = (x - 4) + 'px';
    input.style.top = (y - 4) + 'px';

    input.onkeydown = handleEnter;

    document.body.appendChild(input);

    input.focus();

    hasInput = true;
}

//Key handler for input box:
function handleEnter(e) {
    var keyCode = e.keyCode;
    if (keyCode === 13) {
        drawText(this.value, parseInt(this.style.left, 10), parseInt(this.style.top, 10));
        document.body.removeChild(this);
        hasInput = false;
    }
}

//Draw the text onto canvas:
function drawText(txt, x, y) {
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.font = font;
    ctx.fillText(txt, x - 4, y - 4);
}


    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("touchmove", draw);
}
document.getElementById("selectFiles").addEventListener("change", load_file);