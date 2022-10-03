async function extractData() {
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

        var fname = "";
        var lname = "";

        if (typeof patient.name[0] !== "undefined") {
            fname = patient.name[0].given.join(" ");
            lname = patient.name[0].family.join(" ");
        }

        console.log(p.fname)
        console.log(p.lname)

        var fname = str(jsonData.name[0].given)
        var lname = str(jsonData.name[0].family)
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

        console.log(p.birthdate)
        console.log(p.gender)
        console.log(p.fname)
        console.log(p.lname)

        ret.resolve(p);
    });
}        

/*async function requestImmunizationData() {
    base_url = "https://fhir-myrecord.cerner.com/dstu2/ec2458f2-1e24-41c8-b71b-0e701af7583d"
    var immunization = await fetch(base_url+"/Immunization?patient="+myApp.smart.patient.id,{
        headers: {
            Accept: "application/json+fhir",
            Authorization: "Bearer "+myApp.smart.state.tokenResponse.access_token
        }
    }).then(function(data){
        return data
    })

    var response = await immunization.json()
    console.log(response)
    $("#immunization").text(JSON.stringify(response, null, '\t'))
}*/ 
     

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
drawVisualization = function (p) {
    // Patient data
    $("#holder").show();
    $("#loading").hide();
    $("#fname").html(p.fname);
    $("#lname").html(p.lname);
    $("#gender").html(p.gender);
    $("#birthdate").html(p.birthdate);
  };





/*(function (window) {
    /***** Data fetching function *****/
    /*window.extractData = function () {
      var ret = $.Deferred();
  
      function onError() {
        console.log("Loading error", arguments);
        ret.reject();
      }
  
      function onReady(smart) {
        if (smart.hasOwnProperty("patient")) {
          var patient = smart.patient;
          var pt = patient.read();
  
          const uri =
            "https://fhir-open.cerner.com/dstu2/ec2458f2-1e24-41c8-b71b-0e701af7583d/Immunization?patient=" +
            String(patient.id);
          console.log(uri);
          let h = new Headers();
          h.append("Accept", "application/json+fhir");
  
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
            .then((jsonData) => {
              console.log(jsonData.entry[0]);
              var vaccineCode = undefined;
              var vaccineManufacturer = undefined;
              var vaccineStatus = undefined;
              var doseQuantity = undefined;
              var dateGiven = undefined;
              var expiryDate = undefined;
  
              if (jsonData.entry[0].resource.hasOwnProperty("vaccineCode")) {
                vaccineCode = jsonData.entry[0].resource.vaccineCode.text;
                console.log(vaccineCode);
              } else {
                vaccineCode = "NA";
                console.log(vaccineCode);
              }
  
              if (jsonData.entry[0].resource.hasOwnProperty("manufacturer")) {
                vaccineManufacturer =
                  jsonData.entry[0].resource.manufacturer.display;
                console.log(vaccineManufacturer);
              } else {
                vaccineManufacturer = "NA";
                console.log(vaccineManufacturer);
              }
  
              if (jsonData.entry[0].resource.hasOwnProperty("status")) {
                vaccineStatus = jsonData.entry[0].resource.status;
                console.log(vaccineStatus);
              } else {
                vaccineStatus = "NA";
                console.log(vaccineStatus);
              }
  
              if (jsonData.entry[0].resource.hasOwnProperty("doseQuantity")) {
                if (
                  typeof String(jsonData.entry[0].resource.doseQuantity.value) ||
                  jsonData.entry[0].resource.doseQuantity.unit !== "unknown unit"
                ) {
                  doseQuantity =
                    String(jsonData.entry[0].resource.doseQuantity.value) +
                    " " +
                    jsonData.entry[0].resource.doseQuantity.unit;
                  console.log(doseQuantity);
                } else {
                  doseQuantity = "NA";
                  console.log(doseQuantity);
                }
              } else {
                doseQuantity = "NA";
                console.log(doseQuantity);
              }
  
              if (jsonData.entry[0].resource.hasOwnProperty("date")) {
                dateGiven = jsonData.entry[0].resource.date;
                console.log(dateGiven);
              } else {
                dateGiven = "NA";
                console.log(dateGiven);
              }
  
              if (jsonData.entry[0].resource.hasOwnProperty("expirationDate")) {
                expiryDate = jsonData.entry[0].resource.expirationDate;
                console.log(expiryDate);
              } else {
                expiryDate = "NA";
                console.log(expiryDate);
              }
  
              $.when(pt).fail(onError);
  
              $.when(pt).done(function (patient) {
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
  
                // Immunizations
                p.vCode = vaccineCode;
                p.vManufacturer = vaccineManufacturer;
                p.vStatus = vaccineStatus;
                p.vDoseQuantity = doseQuantity;
                p.vDateGiven = dateGiven;
                p.vExpiryDate = expiryDate;
  
                ret.resolve(p);
              });
            });
        } else {
          onError();
        }
      }
  
      FHIR.oauth2.ready(onReady, onError);
      return ret.promise();
    };
    
  })(window);*/