(function (window) {
    /***** Data fetching function *****/
    window.extractData = function () {
        var ret = $.Deferred()
        var myApp = {}

        function onError() {
            console.log("Loading error", arguments);
            ret.reject();
        }

        function onReady(smart) {
            if(smart.hasOwnProperty("patient")) {
                /*****Making Request*****/
                base_url = "https://fhir-myrecord.cerner.com/dstu2/ec2458f2-1e24-41c8-b71b-0e701af7583d"
                var pt = fetch(base_url+"/Patient/"+myApp.smart.patient.id,{
                    headers: {
                        Accept: "application/json+fhir",
                        Authorization: "Bearer "+myApp.smart.state.tokenResponse.access_token
                    }
                })
                
                console.log("Getting to here")
                
                $.when(pt).fail(onError)

                $.when(pt).done(function(patient) {
                    var gender = patient.gender
                    var dob = new Date(patient.birthDate);
                    var day = dob.getDate();
                    var monthIndex = dob.getMonth() + 1;
                    var year = dob.getFullYear();

                    var dobStr = monthIndex + '/' + day + '/' + year;
                    var fname = '';
                    var lname = '';

                    if(typeof patient.name[0] !== 'undefined') {
                        fname = patient.name[0].given.join(' ');
                        lname = patient.name[0].family.join(' ');
                    }

                    var p = defaultPatient()
                    p.birthdate = dobStr
                    p.gender = gender
                    p.fname = fname
                    p.lname = lname

                    ret.resolve(p)
                })
            } else {
                onError()
            }   
        }

        FHIR.oauth2.ready(onReady, onError)
        return ret.promise()
    }

    /***** Patient object definition *****/
    function defaultPatient() {
    return {
        // Patient data
        fname: { value: "" },
        lname: { value: "" },
        gender: { value: "" },
        birthdate: { value: "" },
        }
    }
})(window)