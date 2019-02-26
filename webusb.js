
class BxlWebUsb {
    constructor() {
        this._device = undefined;
        this._endPointIn = undefined;
        this._endPointOut = undefined;
    }

    connect(callback) {
        var me = this;

        var getDevices = function() {
            return new Promise(function(resolve, reject) {
                navigator.usb.requestDevice({ filters: [{ vendorId : 0x1504 }]})
                .then(selectedDevice => {
                    me._device = selectedDevice;
                    resolve();
                })
                .catch(() => {
                    reject();
                })
            });

        };

        var openDevice = function() {
            return me._device.open();
        }

        var selectConfiguration = function() {
            return me._device.selectConfiguration(1);
        }

        var claim = function() {
            return me._device.claimInterface(0);
        }

        var setEndPoint = function() {
            return new Promise(function(resolve, reject) {
                me._device.configuration.interfaces[0].alternate.endpoints.forEach(function(e) {
                    if(e.direction == 'in') {
                        me._endPointIn = e;
                    }

                    if(e.direction == 'out') {
                        me._endPointOut = e;
                    }
                })
                resolve();
            });
        }

        getDevices()
        .then(openDevice)
        .then(selectConfiguration)
        .then(claim)
        .then(setEndPoint)
        .then(() => {
            if (callback != undefined) {
                callback(true);
            }
        })
        .catch(function(err) {
            if (callback != undefined) {
                callback(false, err);
            }
        });
    }

    write(data, callback) {
        var me = this;

        if (me._device == undefined || me._endPointIn == undefined || me._endPointOut == undefined) {
            return;
        }

        me._device.transferOut(me._endPointOut.endpointNumber, data)
        .then(() => {
            if (callback != undefined) {
                callback(true);
            }
        })
        .catch((err) => {
            if (callback != undefined) {
                callback(false, err);
            }
        });
    }

    disconnect(callback) {
        var me = this;

        me._device.releaseInterface(0)
        .then(() => { return me._device.close() })
        .then(() => { 
            me._endPointIn = undefined;
            me._endPointOut = undefined;
            me._device = undefined;

            if(callback != undefined) {
                callback(true);
            }
        })
        .catch(function(err) { 
            if (callback != undefined) {
                callback(false, err);
            }
        });
    }
}
