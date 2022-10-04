/***** Data fetching function *****/
function extractData() {
  var ret = $.Deferred();

  //FHIR.oauth2.ready(onReady, onError)
  FHIR.oauth2.ready().then(function (client) {
    myApp.smart = client;
  });

  //function onError() {
  console.log("Loading error", arguments);
  ret.reject();
  //}

  //function onReady(myApp) {
  if (smart.hasOwnProperty("patient")) {
    console.log("Making requests");
    var patient = myApp.smart.patient;

    const base_url =
      "https://fhir-myrecord.cerner.com/dstu2/ec2458f2-1e24-41c8-b71b-0e701af7583d";
    var pt = fetch(base_url + "/Immunization?patient=" + patient.id, {
      headers: {
        Accept: "application/json+fhir",
        Authorization: "Bearer " + myApp.smart.state.tokenResponse.access_token,
      },
    });

    //$.when(pt).fail(onError);

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

      ret.resolve(p);
    });
  } else {
    onError();
  }
  //}

  return ret.promise();
}

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
window.drawVisualization = function (patient) {
  // Patient data
  $("#holder").show();
  $("#loading").hide();
  $("#fname").html(patient.fname);
  $("#lname").html(patient.lname);
  $("#gender").html(patient.gender);
  $("#birthdate").html(patient.birthdate);
};
