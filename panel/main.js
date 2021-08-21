var targetUrl;
var tabId;

$(function () {
    function onComplete(data) {
        var time = Date.now();
        var diffImage = new Image();
        diffImage.src = data.getImageDataUrl();
        $("#image-diff").html(diffImage);

        $(diffImage).click(function () {
            var w = window.open("about:blank", "_blank");
            var html = w.document.documentElement;
            var body = w.document.body;

            html.style.margin = 0;
            html.style.padding = 0;
            body.style.margin = 0;
            body.style.padding = 0;

            var img = w.document.createElement("img");
            img.src = diffImage.src;
            img.alt = "image diff";
            img.style.maxWidth = "100%";
            img.addEventListener("click", function () {
                this.style.maxWidth =
                    this.style.maxWidth === "100%" ? "" : "100%";
            });
            body.appendChild(img);
        });

        $(".buttons").show();

        if (data.misMatchPercentage == 0) {
            $("#thesame").show();
            $("#diff-results").hide();
        } else {
            $("#mismatch").text(data.misMatchPercentage);
            if (!data.isSameDimensions) {
                $("#differentdimensions").show();
            } else {
                $("#differentdimensions").hide();
            }
            $("#diff-results").show();
            $("#thesame").hide();
        }
    }

    var resembleControl;

    var buttons = $(".buttons button");

    buttons.click(function () {
        var $this = $(this);

        $this
            .parent(".buttons")
            .find("button")
            .removeClass("active");
        $this.addClass("active");

        if ($this.is("#raw")) {
            resembleControl.ignoreNothing();
        } else if ($this.is("#less")) {
            resembleControl.ignoreLess();
        }
        if ($this.is("#colors")) {
            resembleControl.ignoreColors();
        } else if ($this.is("#antialiasing")) {
            resembleControl.ignoreAntialiasing();
        } else if ($this.is("#alpha")) {
            resembleControl.ignoreAlpha();
        } else if ($this.is("#same-size")) {
            resembleControl.scaleToSameSize();
        } else if ($this.is("#original-size")) {
            resembleControl.useOriginalSize();
        } else if ($this.is("#pink")) {
            resembleControl
                .outputSettings({
                    errorColor: {
                        red: 255,
                        green: 0,
                        blue: 255
                    }
                })
                .repaint();
        } else if ($this.is("#yellow")) {
            resembleControl
                .outputSettings({
                    errorColor: {
                        red: 255,
                        green: 255,
                        blue: 0
                    }
                })
                .repaint();
        } else if ($this.is("#flat")) {
            resembleControl
                .outputSettings({
                    errorType: "flat"
                })
                .repaint();
        } else if ($this.is("#movement")) {
            resembleControl
                .outputSettings({
                    errorType: "movement"
                })
                .repaint();
        } else if ($this.is("#flatDifferenceIntensity")) {
            resembleControl
                .outputSettings({
                    errorType: "flatDifferenceIntensity"
                })
                .repaint();
        } else if ($this.is("#movementDifferenceIntensity")) {
            resembleControl
                .outputSettings({
                    errorType: "movementDifferenceIntensity"
                })
                .repaint();
        } else if ($this.is("#diffOnly")) {
            resembleControl
                .outputSettings({
                    errorType: "diffOnly"
                })
                .repaint();
        } else if ($this.is("#opaque")) {
            resembleControl
                .outputSettings({
                    transparency: 1
                })
                .repaint();
        } else if ($this.is("#transparent")) {
            resembleControl
                .outputSettings({
                    transparency: 0.3
                })
                .repaint();
        } else if ($this.is("#boundingBox")) {
            resembleControl
                .outputSettings({
                    boundingBox: {
                        left: $("#bounding-box-x1").val(),
                        top: $("#bounding-box-y1").val(),
                        right: $("#bounding-box-x2").val(),
                        bottom: $("#bounding-box-y2").val()
                    }
                })
                .repaint();
            $this.removeClass("active");
        } else if ($this.is("#ignoredBox")) {
            resembleControl
                .outputSettings({
                    ignoredBox: {
                        left: $("#ignored-box-x1").val(),
                        top: $("#ignored-box-y1").val(),
                        right: $("#ignored-box-x2").val(),
                        bottom: $("#ignored-box-y2").val()
                    }
                })
                .repaint();
            $this.removeClass("active");
        } else if ($this.is("#ignoredColor")) {
            resembleControl
                .outputSettings({
                    ignoreAreasColoredWith: {
                        r: parseInt($("#ignored-color-r").val()),
                        g: parseInt($("#ignored-color-g").val()),
                        b: parseInt($("#ignored-color-b").val()),
                        a: parseInt($("#ignored-color-a").val())
                    }
                })
                .repaint();
            $this.removeClass("active");
        }
    });

    (function () {

        $("#fileInput").change(function (e) {
            const file = e.target.files[0];
            targetUrl = URL.createObjectURL(file);
            $("#error-info").html("");
        });
        $("#example-images").click(function () {
            resembleControl = null;
            if (!targetUrl) {
                $("#error-info").html("请选择图片");
            } else {
                chrome.runtime.sendMessage({
                    command: 'screenShot'
                }, function (response) {
                    resembleControl = resemble(targetUrl)
                        .compareTo(response)
                        .onComplete(onComplete);
                });
            }

        })
    })();
});