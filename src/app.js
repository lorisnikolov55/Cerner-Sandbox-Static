(function (window) {
    /***** Data fetching function *****/
    window.extractData = function () {
        /*****Making Request*****/
        const base_url = "https://fhir-myrecord.cerner.com/dstu2/ec2458f2-1e24-41c8-b71b-0e701af7583d"
        const uri = base_url+"/Patient/"+myApp.smart.patient.id
        console.log(uri)

        let h = new Headers()
        h.append("Accept", "application/json+fhir")
        h.append("Authorization", "Bearer "+myApp.smart.state.tokenResponse.access_token)
        console.log(h)

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
        .then((patient) => {        
            var gender = patient.gender;
            var dob = new Date(patient.birthDate);
            var day = dob.getDate();
            var monthIndex = dob.getMonth() + 1;
            var year = dob.getFullYear();
        
            var dobStr = monthIndex + "/" + day + "/" + year;
            var fname = "";
            var lname = "";
        
            if (typeof patient.name[0] !== "undefined") {
                fname = patient.name[0].given.join(" ");
                lname = patient.name[0].family.join(" ");
            }
        
            var p = defaultPatient();
            p.birthdate = dobStr;
            p.gender = gender;
            p.fname = fname;
            p.lname = lname;
        
            ret.resolve(p);      
            return ret.promise()         
        })
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