
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
            bxlAPI.updateFirmware(array, 
                function(result) {
                    if(result.error_code == 0) {
                        log(0, "Firmware update success");
                    } else {
                        log(0, "Update fail");
                    }
                },
                function(progress) {
                    console.log(progress);
                }
            );
        }
    };
    reader.readAsArrayBuffer(selectedFile);
}