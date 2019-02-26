
document.getElementById('updateFirmware').addEventListener('click', updateFirmware);

function updateFirmware() {
    var selectedFile = document.getElementById('firmwarePath').files[0];

    if (selectedFile == undefined || 
        selectedFile == null) {
        return;
    }

    var reader = new FileReader();
    reader.onloadstart = function() {
        console.log("onloadstart");
    };
    reader.onprogress = function() {
        console.log("onProgress")
    };
    reader.onload = function(){
        var array = new Uint8Array(reader.result);
        console.log(array.length);
        if (selectedFile.size == array.length) {
            var usb = new BxlWebUsb();

            var discoonectCallback = function(result, error) {
                alert("펌웨어 업데이트에 성공");
                alert("LED의 붉은불이 꺼지면 작업을 재개");
            }

            var writeCallback = function(result, error) {
                if (result == false) {
                    alert("펌웨어 업데이트 실패");
                }
                usb.disconnect(discoonectCallback);
            }

            var connectCallback = function(result, error) {
                if (result == false) {
                    alert("연결실패");
                    return;
                }

                usb.write(array, writeCallback);
            }

            usb.connect(connectCallback);
        }
    };
    reader.readAsArrayBuffer(selectedFile);
}