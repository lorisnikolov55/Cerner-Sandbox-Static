async function requestPatientData() {
  base_url = "https://fhir-myrecord.cerner.com/dstu2/ec2458f2-1e24-41c8-b71b-0e701af7583d"
  var patient = await fetch(base_url+"/Patient/"+myApp.smart.patient.id,{
      headers: {
          Accept: "application/json+fhir",
          Authorization: "Bearer "+myApp.smart.state.tokenResponse.access_token
      }
  }).then(function(data){
      return data
  })

  var patientData = await patient.json()
  console.log(patientData)

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

  var p = defaultPatient();
  p.birthdate = dobStr;
  p.gender = gender;
  p.fname = fname;
  p.lname = lname;

  return p
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
function drawPatient (p) {
  // Patient data
  $("#holder").show();
  $("#loading").hide();
  $("#fname").html(p.fname);
  $("#lname").html(p.lname);
  $("#gender").html(p.gender);
  $("#birthdate").html(p.birthdate);
};
