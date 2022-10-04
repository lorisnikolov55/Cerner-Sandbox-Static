(function (window) {
    /***** Data fetching function *****/
    window.extractData = function () {
        var ret = $.Deferred()
        /*****Making Request*****/
        const base_url = "https://fhir-myrecord.cerner.com/dstu2/ec2458f2-1e24-41c8-b71b-0e701af7583d"
        const uri = base_url+"/Patient/"+myApp.smart.patient.id
        console.log(uri)

        let h = new Headers()
        h.append("Accept", "application/json+fhir")
        h.append("Authorization", "Bearer "+myApp.smart.state.tokenResponse.access_token)
       
        let req = new Request(uri, {
            method: "GET",
            headers: h,
            mode: "cors",
            });

        fetch(req)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Bad HTTP stuff!");
            }
        })
        .then((patientData) => {        
            var gender = patientData.gender;
            var dob = new Date(patientData.birthDate);
            var day = dob.getDate();
            var monthIndex = dob.getMonth() + 1;
            var year = dob.getFullYear();
        
            var dobStr = monthIndex + "/" + day + "/" + year;
            var fname = "";
            var lname = "";
        
            if (typeof patientData.name[0] !== "undefined") {
                fname = patientData.name[0].given.join(" ");
                lname = patientData.name[0].family.join(" ");
            }
        
            //var p = defaultPatient();
            patient.birthdate = dobStr;
            patient.gender = gender;
            patient.fname = fname;
            patient.lname = lname;
        
            ret.resolve(patient);   
            return ret.promise()         
        })
    }

    /***** Patient object definition *****/
    window.defaultPatient = function() {
    return {
        // Patient data
        fname: { value: "" },
        lname: { value: "" },
        gender: { value: "" },
        birthdate: { value: "" },
        }
    }

    /***** HTML indexing *****/
    window.drawVisualization = function (p) {
    // Patient data
    $("#holder").show();
    $("#loading").hide();
    $("#fname").html(p.fname);
    $("#lname").html(p.lname);
    $("#gender").html(p.gender);
    $("#birthdate").html(p.birthdate);
    };
})(window)