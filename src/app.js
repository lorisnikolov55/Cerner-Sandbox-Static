(function (window) {
  /***** Data fetching function *****/
  window.extractData = function () {
    var ret = $.Deferred();

    function onError() {
      console.log("Loading error", arguments);
      ret.reject();
    }

    function onReady() {
      if (myApp.smart.hasOwnProperty("patient")) {
        console.log("In onReady")
        var patient = myApp.smart.patient;
        //var pt = patient.read();

        /*****Making Request*****/
        const base_url =
          "https://fhir-myrecord.cerner.com/dstu2/ec2458f2-1e24-41c8-b71b-0e701af7583d";
        const uri = base_url + "/Patient/" + patient.id;
        console.log(uri);

        let h = new Headers();
        h.append("Accept", "application/json+fhir");
        h.append(
          "Authorization",
          "Bearer " + myApp.smart.state.tokenResponse.access_token
        );

        let req = new Request(uri, {
          method: "GET",
          headers: h,
          mode: "cors",
        });

        fetch(req)
          .then((response) => {
            if (response.ok) {
              console.log(response);
              return response.json();
            } else {
              throw new Error("Bad HTTP stuff!");
            }
          })
          .then((patient) => {
            $.when(patient).fail(onError);

            $.when(patient).done(function (patient) {
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
            });
          });
      } else {
        onError();
      }
    }

    FHIR.oauth2.ready(onReady, onError)
    .then(function(client) {
        myApp.smart = client
    })
    return ret.promise();
  };

  /***** Patient object definition *****/
  window.defaultPatient = function () {
    return {
      // Patient data
      fname: { value: "" },
      lname: { value: "" },
      gender: { value: "" },
      birthdate: { value: "" },
    };
  };

  /***** HTML indexing *****/
  window.drawVisualization = function (patient) {
    // Patient data
    $("#holder").show();
    $("#loading").hide();
    $("#fname").html(patient.fname);
    $("#lname").html(patient.lname);
    $("#gender").html(patient.gender);
    $("#birthdate").html(patient.birthdate);
  };
})(window);
