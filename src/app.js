(function (window) {
    /***** Data fetching function *****/
    window.extractData = async function () {
        var ret = $.Deferred();
        
        base_url = "https://fhir-myrecord.cerner.com/dstu2/ec2458f2-1e24-41c8-b71b-0e701af7583d"
        var patient = await fetch(base_url+"/Patient/"+myApp.smart.patient.id,{
        headers: {
            Accept: "application/json+fhir",
            Authorization: "Bearer "+myApp.smart.state.tokenResponse.access_token
        }
        }).then((response) => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error("Bad HTTP stuff!")
            }
        }).then((jsonData) => {
            console.log(jsonData)
            var fname = jsonData.name[0].given[0]
            var lname = jsonData.name[0].family[0]
            var gender = jsonData.gender
            var dob = new Date(jsonData.birthDate)
            var day = dob.getDate()
            var monthIndex = dob.getMonth() + 1
            var year = dob.getFullYear()
            var dobStr = monthIndex + "/" + day + "/" + year

            var p = defaultPatient()
            p.birthdate = dobStr
            p.gender = gender
            p.fname = fname
            p.lname = lname

            console.log(p)
            ret.resolve(p);
        });
        
        FHIR.oauth2.ready();
        return ret.promise();
    };
  
    /***** Patient object definition *****/
    function defaultPatient() {
      return {
        // Patient data
        fname: { value: "" },
        lname: { value: "" },
        gender: { value: "" },
        birthdate: { value: "" },
      };
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
})(window);