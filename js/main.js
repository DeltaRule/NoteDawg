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

                ele.width = document.body.clientWidth.toString();
                ele.height = "500";
                document.querySelector("body").appendChild(ele);
                new CLIPBOARD_CLASS(ele, true);
                ele.addEventListener("click", delete_element);
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
                        case "INPUT":
                            saveArray.push({
                                4: toSave[i].value,
                            });
                            break;
                    }
                }

                dataStr = encodeURI("data:application/json;charset=utf-8," + JSON.stringify(saveArray));
                dlAnchorElem = document.getElementById("downloadAnchorElem");
                dlAnchorElem.setAttribute("href", dataStr);
                dlAnchorElem.setAttribute("download", "");
                dlAnchorElem.click();
                break;
            case "l":
                document.getElementById("selectFiles").style.display = "block";
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

function ReuseCanvasString(canvas, url) {
    let img = new Image();
    img.onload = () => {
        // Note: here img.naturalHeight & img.naturalWidth will be your original canvas size
        let ctx = canvas.getContext("2d");
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
                    break;
                case "3":
                    ele = document.createElement("canvas");
                    // ele.src = "jspaint/index.html";

                    ele.width = document.body.clientWidth.toString();
                    ele.height = "500";
                    document.querySelector("body").appendChild(ele);
                    new CLIPBOARD_CLASS(ele, true);
                    ele.addEventListener("click", delete_element);
                    ReuseCanvasString(ele, result[i][3]);
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

function CLIPBOARD_CLASS(canvas, autoresize) {
    var _self = this;
    var ctx = canvas.getContext("2d");
    var isPainting = false;
    ctx.fillStyle = "white";
    var lineWidth = 4;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //handlers
    document.addEventListener(
        "paste",
        function(e) {
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
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.lineTo(e.clientX - canvas.offsetLeft + window.scrollX, e.clientY - canvas.offsetTop + window.scrollY);
        ctx.stroke();
    };

    canvas.addEventListener("mousedown", (e) => {
        isPainting = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    canvas.addEventListener("mouseup", (e) => {
        isPainting = false;
        ctx.stroke();
        ctx.beginPath();
    });

    canvas.addEventListener("mousemove", draw);
}
document.getElementById("selectFiles").addEventListener("change", load_file);